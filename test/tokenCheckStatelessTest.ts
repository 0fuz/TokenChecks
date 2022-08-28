// todo write tests

import tokenCheck from "../src/tokenCheckStateOverride";
import {TokenParams} from "../dexSettings";
import tokenCheckStateless from "../src/tokenCheckStateless";
import {ethers} from "ethers";
const hre = require("hardhat");

const config:any = [
    {
        networkName: 'eth',
        address: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
        dexName: "eth_uni_v2",
    },
    {
        networkName: 'avax',
        address: "0xde3A24028580884448a5397872046a019649b084",
        dexName: "avax_joe",
    },
    {
        networkName: 'bsc',
        address: "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d",
        dexName: "bsc_psc_v2",
    },
    {
        networkName: 'polygon',
        address: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
        dexName: "polygon_quick",
    },
    {
        networkName: 'ftm',
        address: "0xAd84341756Bf337f5a0164515b1f6F993D194E1f",
        dexName: "ftm_spirit",
    },
    {
        networkName: 'movr',
        address: "0xE3F5a90F9cb311505cd691a46596599aA1A0AD7D",
        dexName: "movr_solarbeam",
    },
    {
        networkName: 'cronos',
        address: "0xc21223249CA28397B4B6541dfFaEcC539BfF0c59",
        dexName: "cronos_mmfinance",
    },
    {
        networkName: 'optimism',
        address: "0x7F5c764cBc14f9669B88837ca1490cCa17c31607", // elk
        dexName: "optimism_dex1",
    },
    {
        networkName: 'okc',
        address: "0xdCAC52E001f5bd413aa6ea83956438F29098166b",
        dexName: "okc_jswap",
    },
    {
        networkName: 'gnosis',
        address: "0xDDAfbb505ad214D7b80b1f830fcCc89B60fb7A83",
        dexName: "gnosis_dex1",
    },
    {
        networkName: 'boba',
        address: "0x66a2A913e447d6b4BF33EFbec43aAeF87890FBbc",
        dexName: "boba_oolong",
    }

    // // not work
    // {
    //     networkName: 'metis',
    //     address: "0xEA32A96608495e54156Ae48931A7c20f0dcc1a21",
    //     dexName: "metis_tethys",
    // },
    // // not work
    // {
    //     networkName: 'heco',
    //     address: "0x9362bbef4b8313a8aa9f0c9808b80577aa26b73b",
    //     dexName: "heco_mdex",
    // }
    // // not work
    // {
    //     networkName: 'iotex',
    //     address: "0xa00744882684c3e4747faefd68d283ea44099d03",
    //     dexName: "iotex_mimo",
    // }
]

it('should test tokenCheckStateless', async function () {
    for (let i = 0; i < config.length; i++) {
        const configElement = config[i];
        let {networkName, address, dexName} = configElement
        let params: TokenParams = {address, dexName}

        let c = hre.config.networks[networkName]
        if (!c) {
            console.error('!hre.config.networks[networkName]', networkName)
            process.exit(1)
        }

        let provider = new ethers.providers.JsonRpcProvider(c.url, c.chainId);
        let r = await tokenCheckStateless(params, hre.ethers.utils.parseEther("1"), hre, provider)
        console.log({networkName})
        console.log(r.r.join('\n')+'\n-----')
    }
});