import { HardhatRuntimeEnvironment } from "hardhat/types";
import fs from "fs";
import {chunk} from "lodash";
import {parseEther} from "ethers/lib/utils";
import tokenCheckStateless from "../src/tokenCheckStateless";

export const timeout = (ms: number) => new Promise(res => setTimeout(res, ms))

export default async function tokenCheckStatelessBulk(params: { dexName:string, tokensFilePath:string }, hre: HardhatRuntimeEnvironment): Promise<void> {
    console.warn('Be careful with wrapped native token. It will show "Tolerance failed"')
    console.log(params);

    let {dexName, tokensFilePath} = params;
    if (!fs.existsSync(tokensFilePath)) {
        console.warn("File not exists", tokensFilePath)
        process.exit(1)
    }

    let tokens = fs.readFileSync(tokensFilePath, 'utf8')
        .replace(/\r/gi, '')
        .split('\n')
        .filter(t=>{return t !== ""})

    let threads = tokens.length < 25 ? tokens.length-1 : 25
    if (threads < 1) threads = 1

    let buckets = chunk(tokens, threads)

    console.log({uniqTokens: tokens.length, threads})

    let result:any = []
    for (let i = 0; i < buckets.length; i++) {
        console.log("Bucket", i+1, "/", buckets.length);
        const bucket = buckets[i];
        await Promise.all(bucket.map(async (address:string) => {
            try {
                // @ts-ignore
                let r = await tokenCheckStateless({address, dexName}, parseEther("1"), hre, hre.ethers.provider)
                result.push(r.r.join('\n'))
            } catch (e) {
                console.log("#33123",e);
            }
        }))
        await timeout(5000)
    }
    console.log(result.join('\n'));
}
