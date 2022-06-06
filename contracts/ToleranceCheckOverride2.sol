// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import "./interfaces/IERC20.sol";
import "./lib/UniswapV2Library08.sol";
import "./interfaces/IUniswapV2Router02.sol";

// Adapted from https://github.com/0xV19/TokenProvidence/blob/master/contracts/TokenProvidence.sol
// Buy and sell token. Keep track of ETH before and after.
// Can catch the following:
// 1. Honeypots
// 2. Internal Fee Scams
// 3. Buy diversions
contract ToleranceCheckOverride2 {
    function checkToken(
        address routerAddress,
        address tokenAddress
    ) external returns (uint initialEth, uint ethOut, uint buyTokenAmount, uint tokenAmountOutGot, uint ethExpectingBack) {
        IUniswapV2Router02 router = IUniswapV2Router02(routerAddress);

        //Get tokenAmount estimate (can be skipped to save gas in a lot of cases)
        uint256[] memory amounts;
        address[] memory path = new address[](2);

        path[0] = router.WETH();
        path[1] = tokenAddress;
        IERC20 token = IERC20(tokenAddress);

        initialEth = address(this).balance;

        amounts = UniswapV2Library08.getAmountsOut(router.factory(), initialEth, path);
        buyTokenAmount = amounts[amounts.length - 1]; // expecting to get this TokenB

        //Buy tokens
        uint256 scrapTokenBalance = token.balanceOf(address(this));
        {
            router.swapETHForExactTokens{value: initialEth}(buyTokenAmount, path, address(this), block.timestamp);

        }
        tokenAmountOutGot = token.balanceOf(address(this)) - scrapTokenBalance; // got TokenB

        //Sell token
        require(tokenAmountOutGot > 0, "Can't sell this.");
//        address[] memory pathSell = new address[](2);
        path[0] = tokenAddress;
        path[1] = router.WETH();

        amounts = UniswapV2Library08.getAmountsOut(router.factory(), tokenAmountOutGot, path);
        ethExpectingBack = amounts[amounts.length - 1]; // expecting to get this TokenA

        uint256 ethBefore = address(this).balance;
        token.approve(routerAddress, tokenAmountOutGot);
        router.swapExactTokensForETHSupportingFeeOnTransferTokens(
            tokenAmountOutGot,
            0,
                path,
            address(this),
            block.timestamp
        );

        uint256 ethAfter = address(this).balance;
        ethOut = ethAfter - ethBefore;
    }

    fallback() external payable {}
}
