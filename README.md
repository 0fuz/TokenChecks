# Token Checks for MEV and bots

On-chain checks of smart contract ERC20 tradable tokens. Shows:
- Token is tradable in both directions (buy and sell allowed)
- Token have such buyFee and sellFee
- Token have flexible fees. (need pass different swap amounts)

Thanks to:
- [TokenProvidence](https://github.com/0xV19/TokenProvidence)
- [OxV19's](https://twitter.com/0xV19)
- [DrGorilla](https://twitter.com/DrGorilla_md)
- [libevm's tweet](https://twitter.com/libevm/status/1476791869585588224)
- [Devan Non](https://twitter.com/devan_non)

I added measure number of token buy/sell kfs.

I added support of various networks with simple setup. ETH, BSC tested. Any EVM-like supported.

# Setup
- `npm i`

# New blockchain setup
1. `hardhat.config.ts` - append new **network**: url, chainId
2. `dexSettings.ts` - append new dex by sample.

# Usage
- `npx hardhat --network <networkName> tokenCheck <dexSettingName> <tokenAddress>`
- `npx hardhat --network <networkName> tokenCheckFromFile <dexSettingName> <fileWithTokens>`


- ETH chain, uniswap v2, UNI token
    ```shell
    npx hardhat --network eth tokenCheck eth_uni_v2 0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984
    ```
  
    ```shell
    Check token 0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984 with name Uniswap
    in: 1.0 out: 0.994010024370934618 | ok
    kfBuy: 1.0 kfSell: 1.0
    delta: 0
    minKf: 1
    ```

- BSC chain, pancakeswap v2, CAKE token
  ```shell
  npx hardhat --network bsc tokenCheck bsc_psc_v2 0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82
  ```
  
  ```shell
  Check token 0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82 with name PancakeSwap Token
  in: 1.0 out: 0.995006266890376909 | ok
  kfBuy: 1.0 kfSell: 1.0
  delta: 0
  minKf: 1
  ```

- BSC chain, pancakeswap v2, SAFEMOON token
  ```shell
  npx hardhat --network bsc tokenCheck bsc_psc_v2 0x42981d0bfbAf196529376EE702F2a9Eb9092fcB5
  ```

  ```shell
  Check token 0x42981d0bfbAf196529376EE702F2a9Eb9092fcB5 with name SafeMoon
  in: 1.0 out: 0.806570187162258922 | !!!!
  kfBuy: 0.900000018 kfSell: 0.900319766
  delta: 0.0003197480000000086
  minKf: 0.900000018
  ```
  
- BSC chain, pancakeswap v2, scam token
  ```shell
  npx hardhat --network bsc tokenCheck bsc_psc_v2 0x8159b2f490f4d606C6B9bbB724fb7d001da6f153
  ```
  ```shell
  FAILED ToleranceCheck 0x8159b2f490f4d606C6B9bbB724fb7d001da6f153 Kishu Father
  ```
  
- For bulk token checks use this:
  ```shell
  npx hardhat --network bsc tokenCheckFromFile bsc_psc_v2 ./bscTokensForCheck.txt
  ```
