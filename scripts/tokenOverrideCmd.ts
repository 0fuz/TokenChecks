

// Here, we use geth's state override set in eth_call to really simulate the blockchain
import {HardhatRuntimeEnvironment} from "hardhat/types";
// @ts-ignore
import tokenCheck, {TokenParams} from "../src/helpers";

export default async function tokenOverrideCmd(params: TokenParams, hre: HardhatRuntimeEnvironment): Promise<void> {
    let r = await tokenCheck(params, hre, hre.ethers.utils.parseEther("1"))
    if (r.r.join('').includes("FAILED")) {
        console.log(r.r.join('\n')+'\n-----')
        return
    }
    console.log(r.r.join('\n')+'\n-----')
}