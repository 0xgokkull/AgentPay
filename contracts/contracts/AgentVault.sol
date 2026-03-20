// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC4626.sol";

/// @title AgentVault
/// @notice ERC4626 treasury vault for agent funds
/// @dev Uses WrappedNative (WPAS/WDOT) as asset. Supports deposit/withdraw and share accounting.
contract AgentVault is ERC4626 {
    constructor(
        IERC20 asset
    ) ERC20("AgentPay Vault Shares", "aVault") ERC4626(asset) {}
}
