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
    "bsc_psc_v2": {
        chainId: 56,
        routerAddress: "0x10ED43C718714eb63d5aA57B78B54704E256024E",
        initCodeHash: "00fb7f630766e6a796048ea87d01acd3068e8ff67d078148a3fa3f4a84f69bd5",
        dexFeeNumerator: 9975,
        dexFeeDenominator: 10000,
    }
}