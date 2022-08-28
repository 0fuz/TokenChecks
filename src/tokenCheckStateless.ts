import {dexSettings, TokenParams} from "../dexSettings";
import { HardhatRuntimeEnvironment } from "hardhat/types";
// @ts-ignore
// import {ethers as ethersHre} from "hardhat";
import {BigNumber, ethers} from "ethers";

const IERC20abi = require('../artifacts/contracts/test/ERC20.sol/ERC20.json').abi

function toNormalizedHex(a:BigNumber):string {
    return "0x"+parseInt(a.toString()).toString(16)
}

// not depends on eth_call.state_override feature
export default async function tokenCheckStateless(
    params: TokenParams,
    startEth: any,
    hre: HardhatRuntimeEnvironment,
    provider: ethers.providers.JsonRpcProvider
): Promise<{r: string[],x: any }> {
    startEth = toNormalizedHex(startEth)

    // @ts-ignore
    let ethersHre = hre.ethers
    if (!provider) {
        provider = ethersHre.provider
    }

    let {dexName, address: tokenAddress} = params
    if (!dexSettings[dexName]) {
        console.error("(!dexSettings[key])", dexName)
        process.exit(1)
    }

    let {routerAddress, initCodeHash, dexFeeNumerator, dexFeeDenominator, chainId} = dexSettings[dexName]
    let { chainId: providerChainId } = await provider.getNetwork()

    if (chainId !== providerChainId) {
        console.log(`dexSettings[${dexName}].chainId=${chainId} !== ${providerChainId}, Check --network`)
        process.exit(1)
    }

    if (providerChainId === 43114) startEth = '0x1de0b6b3a7640000' // ~2avax, be careful with zeros after 'x'
    if (providerChainId === 10) startEth = '0x15F5AE76B69BB3' // ~0.06
    if (providerChainId === 66) startEth = '0x17BD66E826319E' // ~0.66
    if (providerChainId === 42161) startEth = '0x368560C5E54FE7' // ~0.017
    if (providerChainId === 100) startEth = '0xE8D4A51000' // ~0.017
    if (providerChainId === 288) startEth = '0x1550F7DCA70000' // ~0.017

    let factory = 'ToleranceCheckStatelessEth'
    if (dexName === 'avax_joe' || dexName === 'avax_pangolin') {
        factory = 'ToleranceCheckStatelessAvax'
    }

    let {data} = (await ethersHre.getContractFactory(factory)).getDeployTransaction(
        routerAddress,
        tokenAddress,
        dexFeeNumerator,
        dexFeeDenominator,
        Buffer.from(initCodeHash, "hex") // univ2 init hash
    )

    let r: string[] = []
    let x:any = {}

    let token = new ethers.Contract(tokenAddress, IERC20abi, provider)
    try {
        let call = await Promise.all([
            token.name(),
            token.decimals(),
            provider.send("eth_call", [
                {
                    data: data,
                    value: startEth,
                },
                'latest',
            ])
        ])
        r.push(`Check token ${tokenAddress} with name ${call[0]}`);
        const tokenDecimals: any = BigInt(call[1])
        const returnedData: string = call[2];

        // 1e18*0.9975*0.9975, psc_v2 pair fees
        let border = BigInt(startEth) * BigInt(dexFeeNumerator) / BigInt(dexFeeDenominator) * BigInt(dexFeeNumerator) / BigInt(dexFeeDenominator);

        if (returnedData == '0x') {
            r.push('returnedData: ' + returnedData);
        } else {
            let amountIn = BigInt('0x' + returnedData.substring(2, 2 + 64))
            let amountOut = BigInt('0x' + returnedData.substring(2 + 64, 2 + 64 + 64))
            let midOut = BigInt('0x' + returnedData.substring(2 + 64 + 64, 2 + 64 + 64 + 64))
            let midGot = BigInt('0x' + returnedData.substring(2 + 64 + 64 + 64, 2 + 64 + 64 + 64 + 64))
            let ethExpectingBack = BigInt('0x' + returnedData.substring(2 + 64 + 64 + 64 + 64, 2 + 64 + 64 + 64 + 64 + 64))
            let midKfBuy = midGot * (10n ** tokenDecimals) / midOut // buy tokenB
            let midKfSell = amountOut * (10n ** tokenDecimals) / ethExpectingBack // sell tokenB

            let buy = ethers.utils.formatUnits(midKfBuy, parseInt(tokenDecimals))
            let sell = ethers.utils.formatUnits(midKfSell, parseInt(tokenDecimals))

            let passed = amountOut > border ? "ok" : "!!!!";
            x.minKf = Math.min(parseFloat(buy), parseFloat(sell))

            r.push(`in: ${ethers.utils.formatEther(amountIn)} out: ${ethers.utils.formatEther(amountOut)} | ${passed}`);
            r.push(`kfBuy: ${buy} kfSell: ${sell}`);
            r.push('delta: ' + Math.abs(parseFloat(buy) - parseFloat(sell)));
            r.push('minKf: ' + x.minKf);
        }

    } catch (e) {
        console.log("#1123", tokenAddress, e);
        r.push("FAILED ToleranceCheck " + tokenAddress +" "+(await token.name()));
    }
    return {r, x};

}