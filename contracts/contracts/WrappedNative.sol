// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/// @title WrappedNative
/// @notice Wraps native PAS (testnet) or DOT (mainnet) for use in ERC20/ERC4626 contexts
/// @dev Canonical WETH-style contract. Deposit native token, receive wrapped ERC20.
contract WrappedNative is ERC20 {
    error WrappedNativeDepositFailed();
    error WrappedNativeInsufficientBalance();
    error WrappedNativeTransferFailed();

    event Deposit(address indexed account, uint256 amount);
    event Withdrawal(address indexed account, uint256 amount);

    constructor(
        string memory name_,
        string memory symbol_
    ) ERC20(name_, symbol_) {}

    /// @notice Deposit native token and mint wrapped tokens
    receive() external payable {
        if (msg.value == 0) return;
        _mint(msg.sender, msg.value);
        emit Deposit(msg.sender, msg.value);
    }

    /// @notice Deposit native token for a specific account
    function depositFor(address account) external payable {
        if (msg.value == 0) return;
        _mint(account, msg.value);
        emit Deposit(account, msg.value);
    }

    /// @notice Withdraw wrapped tokens and receive native token
    function withdraw(uint256 amount) external {
        if (amount == 0) return;
        if (balanceOf(msg.sender) < amount)
            revert WrappedNativeInsufficientBalance();
        _burn(msg.sender, amount);
        (bool success, ) = payable(msg.sender).call{value: amount}("");
        if (!success) revert WrappedNativeTransferFailed();
        emit Withdrawal(msg.sender, amount);
    }
}
