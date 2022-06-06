// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import "./interfaces/IERC20.sol";
import "./lib/UniswapV2Library082.sol";
import "./interfaces/IUniswapV2Router02.sol";

// Adapted from https://github.com/0xV19/TokenProvidence/blob/master/contracts/TokenProvidence.sol
// Buy and sell token. Keep track of ETH before and after.
// Can catch the following:
// 1. Honeypots
// 2. Internal Fee Scams
// 3. Buy diversions
// Available from any uni-forks in any EVM chains. Tested ETH,BSC
contract ToleranceCheckOverride3 {

    function checkToken(
        address routerAddress,
        address tokenAddress,
        uint dexFeeNumerator,
        uint dexFeeDenominator,
        bytes memory initCodeHash
    ) external returns (uint[5] memory result) {
        // result[0] = initialEth
        // result[1] = ethOut
        // result[2] = buyTokenAmount
        // result[3] = tokenAmountOutGot
        // result[4] = ethExpectingBack

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
    }

    fallback() external payable {}
}
