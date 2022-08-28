import tokenCheck from "../src/tokenCheckStateOverride";
import {TokenParams} from "../dexSettings";

const hre = require("hardhat");

it('should test ETH network', async function () {
    let params: TokenParams = {
        address: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
        dexName: "eth_uni_v2",
    }

    let r = await tokenCheck(params, hre, hre.ethers.utils.parseEther("1"))
    console.log(r.r.join('\n')+'\n-----')
});

it('should test AVAX network', async function () {
    let params: TokenParams = {
        address: "0xde3A24028580884448a5397872046a019649b084",
        dexName: "avax_joe",
    }
    let r = await tokenCheck(params, hre, hre.ethers.utils.parseEther("1"))
    console.log(r.r.join('\n')+'\n-----')
});

it('should test Optimism network', async function () {
    let params: TokenParams = {
        address: "0xeEeEEb57642040bE42185f49C52F7E9B38f8eeeE", // elk
        dexName: "optimism_dex1",
    }
    let r = await tokenCheck(params, hre, hre.ethers.utils.parseEther("1"))
    console.log(r.r.join('\n')+'\n-----')
});

it('should test Okc network', async function () {
    let params: TokenParams = {
        address: "0xdCAC52E001f5bd413aa6ea83956438F29098166b",
        dexName: "okc_jswap",
    }
    let r = await tokenCheck(params, hre, hre.ethers.utils.parseEther("1"))
    console.log(r.r.join('\n')+'\n-----')
});