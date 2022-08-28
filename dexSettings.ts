export interface TokenParams {
    address: string;
    dexName: string;
}

export interface DexSetting {
    chainId: number,          // https://chainlist.org
    routerAddress: string,    // factory->Visit1stPairPage->CheckLatestTxes->FindTx where "to" is router
    initCodeHash: string,     // dex.router has it "init code hash"
    dexFeeNumerator: number,  // dex.factory.swap() contains
    dexFeeDenominator: number // dex.factory.swap() contains
}

export const dexSettings: {[key: string]: DexSetting} = {
    "eth_uni_v2": {
        chainId: 1,
        routerAddress: "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
        initCodeHash: "96e8ac4277198ff8b6f785478aa9a39f403cb768dd02cbee326c3e7da348845f",
        dexFeeNumerator: 997,
        dexFeeDenominator: 1000,
    },
    "eth_sushi_v2": {
        chainId: 1,
        routerAddress: "0xd9e1cE17f2641f24aE83637ab66a2cca9C378B9F",
        initCodeHash: "e18a34eb0e04b04f7a0ac29a6e80748dca96319b42c54d679cb821dca90c6303",
        dexFeeNumerator: 997,
        dexFeeDenominator: 1000,
    },
    "bsc_psc_v2": {
        chainId: 56,
        routerAddress: "0x10ED43C718714eb63d5aA57B78B54704E256024E",
        initCodeHash: "00fb7f630766e6a796048ea87d01acd3068e8ff67d078148a3fa3f4a84f69bd5",
        dexFeeNumerator: 9975,
        dexFeeDenominator: 10000,
    },
    "bsc_psc_v1": {
        chainId: 56,
        routerAddress: "0x05fF2B0DB69458A0750badebc4f9e13aDd608C7F",
        initCodeHash: "d0d4c4cd0848c93cb4fd1f498d7013ee6bfb25783ea21593d5834f5d250ece66",
        dexFeeNumerator: 998,
        dexFeeDenominator: 1000,
    },
    "bsc_ape": {
        chainId: 56,
        routerAddress: "0xcF0feBd3f17CEf5b47b0cD257aCf6025c5BFf3b7",
        initCodeHash: "f4ccce374816856d11f00e4069e7cada164065686fbef53c6167a63ec2fd8c5b",
        dexFeeNumerator: 998,
        dexFeeDenominator: 1000,
    },
    // uses swapAVAX...
    "avax_joe": {
        chainId: 43114,
        routerAddress: "0x60aE616a2155Ee3d9A68541Ba4544862310933d4",
        initCodeHash: "0bbca9af0511ad1a1da383135cf3a8d2ac620e549ef9f6ae3a4c33c2fed0af91",
        dexFeeNumerator: 997,
        dexFeeDenominator: 1000,
    },
    // uses swapAVAX...
    "avax_pangolin": {
        chainId: 43114,
        routerAddress: "0xE54Ca86531e17Ef3616d22Ca28b0D458b6C89106",
        initCodeHash: "40231f6b438bce0797c9ada29b718a87ea0a5cea3fe9a771abdd76bd41a3e545",
        dexFeeNumerator: 997,
        dexFeeDenominator: 1000,
    },
    // uses swapETH...
    "avax_sushi": {
        chainId: 43114,
        routerAddress: "0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506",
        initCodeHash: "e18a34eb0e04b04f7a0ac29a6e80748dca96319b42c54d679cb821dca90c6303",
        dexFeeNumerator: 997,
        dexFeeDenominator: 1000,
    },
    "polygon_quick": {
        chainId: 137,
        routerAddress: "0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff",
        initCodeHash: "96e8ac4277198ff8b6f785478aa9a39f403cb768dd02cbee326c3e7da348845f",
        dexFeeNumerator: 997,
        dexFeeDenominator: 1000,
    },
    "polygon_sushi_v2": {
        chainId: 137,
        routerAddress: "0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506",
        initCodeHash: "e18a34eb0e04b04f7a0ac29a6e80748dca96319b42c54d679cb821dca90c6303",
        dexFeeNumerator: 997,
        dexFeeDenominator: 1000,
    },
    "ftm_spooky": {
        chainId: 250,
        routerAddress: "0xF491e7B69E4244ad4002BC14e878a34207E38c29",
        initCodeHash: "cdf2deca40a0bd56de8e3ce5c7df6727e5b1bf2ac96f283fa9c4b3e6b42ea9d2",
        dexFeeNumerator: 998,
        dexFeeDenominator: 1000,
    },
    "ftm_spirit": {
        chainId: 250,
        routerAddress: "0x16327E3FbDaCA3bcF7E38F5Af2599D2DDc33aE52",
        initCodeHash: "e242e798f6cee26a9cb0bbf24653bf066e5356ffeac160907fe2cc108e238617",
        dexFeeNumerator: 997,
        dexFeeDenominator: 1000,
    },
    "ftm_sushi": {
        chainId: 250,
        routerAddress: "0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506",
        initCodeHash: "e18a34eb0e04b04f7a0ac29a6e80748dca96319b42c54d679cb821dca90c6303",
        dexFeeNumerator: 997,
        dexFeeDenominator: 1000,
    },
    "arb_sushi": {
        chainId: 42161,
        routerAddress: "0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506",
        initCodeHash: "e18a34eb0e04b04f7a0ac29a6e80748dca96319b42c54d679cb821dca90c6303",
        dexFeeNumerator: 997,
        dexFeeDenominator: 1000,
    },
    "heco_mdex": {
        chainId: 128,
        // f 0xb0b670fc1F7724119963018DB0BfA86aDb22d941
        routerAddress: "0xED7d5F38C79115ca12fe6C0041abb22F0A06C300",
        initCodeHash: "2ad889f82040abccb2649ea6a874796c1601fb67f91a747a80e08860c73ddf24",
        dexFeeNumerator: 997,
        dexFeeDenominator: 1000,
    },
    "heco_pipi": {
        chainId: 128,
        // f 0x979efE7cA072b72d6388f415d042951dDF13036e
        routerAddress: "0xED7d5F38C79115ca12fe6C0041abb22F0A06C300",
        initCodeHash: "2ad889f82040abccb2649ea6a874796c1601fb67f91a747a80e08860c73ddf24",
        dexFeeNumerator: 997,
        dexFeeDenominator: 1000,
    },
    "movr_solarbeam": {
        chainId: 1285,
        // f 0x049581aEB6Fe262727f290165C29BDAB065a1B68
        routerAddress: "0xAA30eF758139ae4a7f798112902Bf6d65612045f",
        initCodeHash: "9a100ded5f254443fbd264cb7e87831e398a8b642e061670a9bc35ba27293dbf",
        dexFeeNumerator: 9975,
        dexFeeDenominator: 10000,
    },
    "optimism_dex1": {
        chainId: 10,
        // f 0xedfad3a0F42A8920B011bb0332aDe632e552d846
        routerAddress: "0xeadE97aFC8f79A8E5Ba85d57C4a4E629b1160C6A",
        initCodeHash: "84845e7ccb283dec564acfcd3d9287a491dec6d675705545a2ab8be22ad78f31",
        dexFeeNumerator: 997,
        dexFeeDenominator: 1000,
    },
    "gnosis_dex1": {
        chainId: 100,
        // f 0xA818b4F111Ccac7AA31D0BCc0806d64F2E0737D7
        routerAddress: "0x1C232F01118CB8B424793ae03F870aa7D0ac7f77",
        initCodeHash: "3f88503e8580ab941773b59034fb4b2a63e86dbc031b3633a925533ad3ed2b93",
        dexFeeNumerator: 997,
        dexFeeDenominator: 1000,
    },
    "metis_tethys": {
        chainId: 1088,
        // f 0x2CdFB20205701FF01689461610C9F321D1d00F80
        routerAddress: "0x81b9FA50D5f5155Ee17817C21702C3AE4780AD09",
        initCodeHash: "ef3f1aabf6b944a53c06890783ddef260a21995d1eaea6d52f980cfe082a877d",
        dexFeeNumerator: 998,
        dexFeeDenominator: 1000,
    },
    "iotex_mimo": {
        chainId: 4689,
        // f 0xda257cBe968202Dea212bBB65aB49f174Da58b9D
        routerAddress: "0x81b9FA50D5f5155Ee17817C21702C3AE4780AD09",
        initCodeHash: "ef3f1aabf6b944a53c06890783ddef260a21995d1eaea6d52f980cfe082a877d",
        dexFeeNumerator: 997,
        dexFeeDenominator: 1000,
    },
    "okc_jswap": {
        chainId: 66,
        // f ex16e2vh7vl9yrlqmyg8xdwzgmqvysjgl2uf4g8gv
        routerAddress: "0x069A306A638ac9d3a68a6BD8BE898774C073DCb3",
        initCodeHash: "f6608394468275c0df88a8568e9fbf7295a0aebddd5ae966ce6dbf5bb4ee68a0",
        dexFeeNumerator: 997,
        dexFeeDenominator: 1000,
    },
    "boba_oolong": {
        chainId: 288,
        // f 0x7DDaF116889D655D1c486bEB95017a8211265d29
        routerAddress: "0x17C83E2B96ACfb5190d63F5E46d93c107eC0b514",
        initCodeHash: "1db9efb13a1398e31bb71895c392fa1217130f78dc65080174491adcec5da9b9",
        dexFeeNumerator: 997, // flexible fee
        dexFeeDenominator: 1000,
    },
    "cronos_mmfinance": {
        chainId: 25,
        // f 0xd590cC180601AEcD6eeADD9B7f2B7611519544f4
        routerAddress: "0x145677FC4d9b8F19B5D56d1820c48e0443049a30",
        initCodeHash: "7ae6954210575e79ea2402d23bc6a59c4146a6e6296118aa8b99c747afec8acf",
        dexFeeNumerator: 9983, // flexible fee
        dexFeeDenominator: 10000,
    }
}