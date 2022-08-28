import { HardhatUserConfig, task } from "hardhat/config";
import "@nomiclabs/hardhat-waffle";

import tokenOverrideCmd from "./scripts/tokenOverrideCmd";
import tokenBulkOverrideCmd from "./scripts/tokenBulkOverrideCmd";
import tokenStateless from "./scripts/tokenStateless";
import tokenCheckStatelessBulk from "./scripts/tokenStatelessBulk";

task("tokenCheck", "Checks that token available for swap in both directions from smartContract")
    .addPositionalParam("dexName", "from dexSettings.ts")
    .addPositionalParam("address", "Address of token")
    .setAction(tokenOverrideCmd);

task("tokenCheckFromFile", "Checks that bulk tokens available for swap in both directions from smartContract")
    .addPositionalParam("dexName", "from dexSettings.ts")
    .addPositionalParam("tokensFilePath", ".txt list of tokens")
    .setAction(tokenBulkOverrideCmd);

// npx hardhat --network avax tokenCheckStateless avax_joe 0xde3A24028580884448a5397872046a019649b084
task("tokenCheckStateless", "Token validity checks without state_override")
    .addPositionalParam("dexName", "from dexSettings.ts")
    .addPositionalParam("address", "Address of token")
    .setAction(tokenStateless);

// !! be careful with wavax cuz it wrong token kf shows
// npx hardhat --network bsc tokenCheckStatelessBulk bsc_psc_v2 ./bscTokensForCheck.txt
// npx hardhat --network avax tokenCheckStatelessBulk avax_joe ./_joeTokens.txt
// npx hardhat --network avax tokenCheckStatelessBulk avax_pangolin ./_pangolinTokens.txt
task("tokenCheckStatelessBulk", "Token validity checks without state_override")
    .addPositionalParam("dexName", "from dexSettings.ts")
    .addPositionalParam("tokensFilePath", ".txt list of tokens")
    .setAction(tokenCheckStatelessBulk);

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (args, hre) => {
    const accounts = await hre.ethers.getSigners();

    for (const account of accounts) {
        console.log(account.address);
    }
});

const config: HardhatUserConfig = {
    // solidity: "0.8.10",

    // defaultNetwork: "localhost",
    // defaultNetwork: "avax",
    // defaultNetwork: "bsc",
    defaultNetwork: "eth",

    solidity: {
        compilers: [
            {
                version: "0.8.10",
                settings: {
                    optimizer: {
                        enabled: true,
                        // Lower values will optimize more for initial deployment cost, higher values will optimize more for high-frequency usage.
                        runs: 9999999  // max 2147483647
                    }
                }
            },
            {
                version: "0.7.6",
                settings: {
                    optimizer: {
                        enabled: true,
                        // Lower values will optimize more for initial deployment cost, higher values will optimize more for high-frequency usage.
                        runs: 9999999  // max 2147483647
                    }
                }
            },
            {
                version: "0.5.16"
            },
            {
                version: "0.6.2"
            },
            {
                version: "0.6.4"
            },
        ]
    },

    networks: { // npx hardhat node --port 1337
        localhost: {
            url: "http://127.0.0.1:1337",
            gasPrice: 5000000000,
        },
        eth: {
            url: 'https://eth.public-rpc.com',
            // url: 'https://rpc.ankr.com/eth/aacfc30b07312baf2e5a513a358460e58e7a110365559ea5bf442dab0d05eac7',
            chainId: 1,
            blockGasLimit: 1000000000,
        },
        bsc: {
            url: 'https://bscrpc.com',
            // url: 'https://rpc.ankr.com/bsc/aacfc30b07312baf2e5a513a358460e58e7a110365559ea5bf442dab0d05eac7',
            chainId: 56,
        },
        polygon: {
            url: 'https://rpc.ankr.com/polygon',
            chainId: 137,
        },
        avax: {
            url: 'https://rpc.ankr.com/avalanche',
            // url: 'https://api.avax.network/ext/bc/C/rpc',
            // url: 'http://127.0.0.1:9650/ext/bc/C/rpc',
            gasPrice: 225000000000,
            chainId: 43114,
            accounts: []
        },
        optimism: {
            url: 'https://rpc.ankr.com/optimism',
            chainId: 10,
        },
        gnosis: {
            url: 'https://rpc.ankr.com/gnosis',
            chainId: 100,
        },
        ftm: {
            url: 'https://rpc.ankr.com/fantom/aacfc30b07312baf2e5a513a358460e58e7a110365559ea5bf442dab0d05eac7',
            chainId: 250,
        },
        arb: { // arbitrum
            url: 'https://arb1.arbitrum.io/rpc',
            chainId: 42161,
        },
        heco: { // huobi eco chain
            url: 'https://http-mainnet.hecochain.com',
            chainId: 128,
        },
        movr: { // moonriver
            url: 'https://rpc.api.moonriver.moonbeam.network',
            chainId: 1285,
            gasPrice: 2000000000,
        },
        metis: {
            url: 'https://andromeda.metis.io/?owner=1088',
            chainId: 1088,
        },
        okc: {
            url: 'https://exchainrpc.okex.org/',
            chainId: 66,
        },
        boba: {
            url: 'https://mainnet.boba.network',
            chainId: 288,
        },
        cronos: { // cronos
            url: 'https://evm.cronos.org',
            chainId: 25,
        },
        iotex: {
            url: 'https://rpc.ankr.com/iotex',
            chainId: 4689,
        },
        // aurora - cant look at fees and init hash
        // klaytn - cant look at fees and init hash
        // optimism - cant look at fees and init hash, low popularity
        // gnosis hard to find scan
        // moonbeam havent SC code
        // harmony.one havent active DEXes
        // kcc havent SC code, but ~200 pairs

    },

    paths: {
        sources: "./contracts",
        tests: "./test",
        cache: "./cache",
        artifacts: "./artifacts"
    },
    mocha: {
        timeout: 20000
    }
}
export default config;
