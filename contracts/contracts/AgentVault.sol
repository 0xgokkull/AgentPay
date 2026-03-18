// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC4626.sol";

contract AgentVault is ERC4626 {
    constructor(IERC20 asset)
        ERC20("AgentPay Vault Shares", "aVault")
        ERC4626(asset)
    {}
}
