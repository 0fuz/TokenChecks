// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import "../lib/UniswapV2Library08.sol";
import "./ERC20.sol";
import "../interfaces/IUniswapV2Router02.sol";

// An ERC20 token which can only be bought but not sold
contract BadERC20 is ERC20 {
    address private immutable uniPair;
    address private immutable haxor;

    constructor(address router) ERC20("Bad", "BAD", 18) {
        IUniswapV2Router02 uniRouter = IUniswapV2Router02(router);
        uniPair = UniswapV2Library08.pairFor(uniRouter.factory(), uniRouter.WETH(), address(this));

        _mint(msg.sender, 1000e18);
        haxor = msg.sender;
    }

    function transfer(address to, uint256 amount) public override returns (bool) {
        if (to == uniPair && msg.sender != haxor) {
            // Sorry babe, this is a honey pot
            return false;
        }

        return super.transfer(to, amount);
    }

    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) public override returns (bool) {
        if (to == uniPair && from != haxor) {
            // Sorry babe, this is a honey pot
            return false;
        }

        return super.transferFrom(from, to, amount);
    }
}
