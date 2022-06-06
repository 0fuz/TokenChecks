import {HardhatRuntimeEnvironment} from "hardhat/types";
import {dexSettings, TokenParams} from "../dexSettings";

export default async function tokenCheck(params: TokenParams, hre: HardhatRuntimeEnvironment, startEth: any): Promise<{r: string[],x: any }> {
    const callingAddress = "0x0000000000000000000000000000000000000124";
    const key = params.dexName
    if (!dexSettings[key]) {
        console.error("(!dexSettings[key])", key)
        process.exit(1)
    }
    let {routerAddress, initCodeHash, dexFeeNumerator, dexFeeDenominator, chainId} = dexSettings[key]

    if (chainId !== hre.network.config.chainId) {
        console.log("Provided ", {chainId}, " but ", {'hre.network.config.chainId': hre.network.config.chainId}, ". Check --network or hardhat.config.ts>defaultNetwork")
        process.exit(1)
    }

    // @ts-ignore
    let ethers = hre.ethers;

    const utils = ethers.utils;

    let address = params.address

    let r: string[] = []
    let x:any = {}

    const token = await ethers.getContractAt("IERC20", address);

    if (!startEth) {
        startEth = utils.parseEther("1")
    }

    try {
        const ToleranceCheckOverrideDeployedBytecode = require('../artifacts/contracts/ToleranceCheckOverride3.sol/ToleranceCheckOverride3.json').deployedBytecode;

        const ToleranceCheckOverride = await ethers.getContractFactory("ToleranceCheckOverride3");
        const functionData = ToleranceCheckOverride.interface.encodeFunctionData("checkToken", [
            routerAddress,
            address,
            dexFeeNumerator,
            dexFeeDenominator,
            Buffer.from(initCodeHash, "hex") // univ2 init hash
        ]);

        let params = [
            {
                data: functionData,
                to: callingAddress,
            },
            "latest",
            {
                // state override set, the famous 3rd param of `eth_call` https://twitter.com/libevm/status/1476791869585588224
                // we set the bytecode to the deployed bytecode of our "tolerance check override" contract
                [callingAddress]: {
                    code: ToleranceCheckOverrideDeployedBytecode,
                    balance: utils.hexStripZeros(startEth.toHexString()),
                },
            },
        ]

        let call = await Promise.all([
            token.name(),
            token.decimals(),
            ethers.provider.send("eth_call", params)
        ])
        r.push(`Check token ${address} with name ${call[0]}`);
        const tokenDecimals:any = BigInt(call[1])
        const returnedData:string = call[2];

        // 1e18*0.9975*0.9975, psc_v2 pair fees
        let border = BigInt(startEth) * BigInt(dexFeeNumerator)/BigInt(dexFeeDenominator)*BigInt(dexFeeNumerator)/BigInt(dexFeeDenominator);

        let amountIn = BigInt('0x'+returnedData.substring(2, 2+64))
        let amountOut = BigInt('0x'+returnedData.substring(2+64, 2+64+64))
        let midOut = BigInt('0x'+returnedData.substring(2+64+64, 2+64+64+64))
        let midGot = BigInt('0x'+returnedData.substring(2+64+64+64, 2+64+64+64+64))
        let ethExpectingBack = BigInt('0x'+returnedData.substring(2+64+64+64+64, 2+64+64+64+64+64))
        let midKfBuy = midGot*(10n**tokenDecimals)/midOut // buy tokenB
        let midKfSell = amountOut*(10n**tokenDecimals)/ethExpectingBack // sell tokenB

        let buy = ethers.utils.formatUnits(midKfBuy, parseInt(tokenDecimals))
        let sell = ethers.utils.formatUnits(midKfSell, parseInt(tokenDecimals))

        let passed = amountOut > border ? "ok" : "!!!!";
        x.minKf = Math.min(buy,sell)

        r.push(`in: ${ethers.utils.formatEther(amountIn)} out: ${ethers.utils.formatEther(amountOut)} | ${passed}`);
        r.push(`kfBuy: ${buy} kfSell: ${sell}`);
        r.push('delta: '+Math.abs(parseFloat(buy)-parseFloat(sell)));
        r.push('minKf: '+x.minKf);


        // console.log('------');
    } catch (e) {
        // console.log(e);
        r.push("FAILED ToleranceCheck " + address +" "+(await token.name()));
    }
    return {r, x};
}