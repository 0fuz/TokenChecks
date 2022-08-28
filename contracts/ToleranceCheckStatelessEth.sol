// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import "./interfaces/IERC20.sol";
import "./lib/UniswapV2Library082.sol";
import "./interfaces/IUniswapV2Router02.sol";

// - token is tradable in both directions (buy and sell)
// - measure, if present, token swap additional fees for buy and sell
// - if token not tradable from SC, fails
// - not depends from eth_call.state_override feature
// Eth-specific router interfaces used (WETH(), swapETH...)

// funds sent from 0x0000000000000000000000000000000000000000 address, so max 7 avax available
contract ToleranceCheckStatelessEth {
    constructor(
        address routerAddress,
        address tokenAddress,
        uint dexFeeNumerator,
        uint dexFeeDenominator,
        bytes memory initCodeHash
    ) payable {
        // result[0] = initialEth
        // result[1] = ethOut
        // result[2] = buyTokenAmount
        // result[3] = tokenAmountOutGot
        // result[4] = ethExpectingBack
        uint[] memory result =  new uint[](5);

        IUniswapV2Router02 router = IUniswapV2Router02(routerAddress);

        //Get tokenAmount estimate (can be skipped to save gas in a lot of cases)
        uint256[] memory amounts;
        address[] memory path = new address[](2);

        path[0] = router.WETH();
        path[1] = tokenAddress;
        IERC20 token = IERC20(tokenAddress);

        result[0] = address(this).balance;

        amounts = UniswapV2Library082.getAmountsOut(router.factory(), result[0], path, dexFeeNumerator, dexFeeDenominator, initCodeHash);
        result[2] = amounts[amounts.length - 1]; // expecting to get this TokenB

        //Buy tokens
        uint256 scrapTokenBalance = token.balanceOf(address(this));
        {
            router.swapETHForExactTokens{value: result[0]}(result[2], path, address(this), block.timestamp);
        }
        result[3] = token.balanceOf(address(this)) - scrapTokenBalance; // got TokenB

        //Sell token
        require(result[3] > 0, "Can't sell this.");
        path[0] = tokenAddress;
        path[1] = router.WETH();

        amounts = UniswapV2Library082.getAmountsOut(router.factory(), result[3], path, dexFeeNumerator, dexFeeDenominator, initCodeHash);
        result[4] = amounts[amounts.length - 1]; // expecting to get this TokenA

        uint256 ethBefore = address(this).balance;
        token.approve(routerAddress, result[3]);
        router.swapExactTokensForETHSupportingFeeOnTransferTokens(
            result[3],
            0,
            path,
            address(this),
            block.timestamp
        );

        uint256 ethAfter = address(this).balance;
        result[1] = ethAfter - ethBefore;

        assembly {
            mstore(0x0, result)
            return(448, 160) // return bytes from position 448, 160len, its our 'result' stack space
        }
    }
    fallback() external payable {}
}
