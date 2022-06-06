

// Here, we use geth's state override set in eth_call to really simulate the blockchain
import {HardhatRuntimeEnvironment} from "hardhat/types";
import * as fs from "fs";
import {chunk, uniq} from "lodash";
import {parseEther} from "ethers/lib/utils";
import tokenCheck from "../src/helpers";

export default async function tokenBulkOverrideCmd(params: { dexName:string, tokensFilePath:string }, hre: HardhatRuntimeEnvironment): Promise<void> {
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

    let result = []
    for (let i = 0; i < buckets.length; i++) {
        console.log("Bucket", i+1, "/", buckets.length);
        const bucket = buckets[i];
        await Promise.all(bucket.map(async (address:string) => {
            try {
                let r = await tokenCheck({address, dexName}, hre, parseEther("1"))
                result.push(r.r.join('\n'))
            } catch (e) {
                console.log(e);
            }
        }))
    }
    console.log(result.join('\n'));
}