import { HardhatUserConfig, task } from "hardhat/config";
import "@nomiclabs/hardhat-waffle";

import tokenOverrideCmd from "./scripts/tokenOverrideCmd";
import tokenBulkOverrideCmd from "./scripts/tokenBulkOverrideCmd";

task("tokenCheck", "Checks that token available for swap in both directions from smartContract")
    .addPositionalParam("dexName", "from src/helpers.ts")
    .addPositionalParam("address", "Address of token")
    .setAction(tokenOverrideCmd);

task("tokenCheckFromFile", "Checks that bulk tokens available for swap in both directions from smartContract")
    .addPositionalParam("dexName", "from src/helpers.ts")
    .addPositionalParam("tokensFilePath", ".txt list of tokens")
    .setAction(tokenBulkOverrideCmd);

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (args, hre) => {
    const accounts = await hre.ethers.getSigners();

    for (const account of accounts) {
        console.log(account.address);
    }
});

const config: HardhatUserConfig = {
    solidity: "0.8.10",

    defaultNetwork: "localhost",

    networks: { // npx hardhat node --port 1337
        localhost: {
            url: "http://127.0.0.1:1337",
            gasPrice: 5000000000,
        },
        eth: {
            url: 'https://eth.public-rpc.com',
            chainId: 1,
            blockGasLimit: 1000000000,
        },
        bsc: {
            url: 'https://bscrpc.com',
            chainId: 56,
        },
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
