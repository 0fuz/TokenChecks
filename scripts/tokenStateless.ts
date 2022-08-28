import { HardhatRuntimeEnvironment } from "hardhat/types";
import {TokenParams} from "../dexSettings";
import tokenCheckStateless from "../src/tokenCheckStateless";
import {ethers} from "ethers";

export default async function tokenStateless(params: TokenParams, hre: HardhatRuntimeEnvironment): Promise<void> {
    console.warn('Be careful with wrapped native token. It will show "Tolerance failed"')

    // @ts-ignore
    let r = await tokenCheckStateless(params, ethers.utils.parseEther("1"), hre, hre.ethers.provider)
    if (r.r.join('').includes("FAILED")) {
        console.log(r.r.join('\n')+'\n-----')
        return
    }
    console.log(r.r.join('\n')+'\n-----')
}
