// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

interface IReceiptNFT {
    function mintReceipt(
        address to,
        address payer,
        address service,
        uint256 amount
    ) external returns (uint256);
}

/// @title SplitPayRouter
/// @notice Routes native token payments with 70/20/10 split (service/treasury/yield)
/// @dev Uses native PAS (testnet) or DOT (mainnet). Reentrancy-safe, pausable.
contract SplitPayRouter is ReentrancyGuard, Pausable, Ownable {
    IReceiptNFT public receiptNFT;

    address public treasury;
    address public xcmYieldRecipient;

    uint32 public constant SERVICE_BPS = 7000;
    uint32 public constant YIELD_BPS = 2000;
    uint32 public constant TREASURY_BPS = 1000;
    uint32 public constant BPS_DENOMINATOR = 10_000;

    error SplitPayRouterZeroAmount();
    error SplitPayRouterZeroService();
    error SplitPayRouterZeroAddress();
    error SplitPayRouterTransferFailed();

    event PaymentSplit(
        address indexed payer,
        address indexed service,
        uint256 amount,
        uint256 serviceShare,
        uint256 yieldShare,
        uint256 treasuryShare,
        uint256 receiptTokenId
    );
    event XCMTransferQueued(uint256 amount, uint32 targetParaId);
    event TreasuryUpdated(
        address indexed oldTreasury,
        address indexed newTreasury
    );
    event YieldRecipientUpdated(
        address indexed oldRecipient,
        address indexed newRecipient
    );
    event ReceiptNFTUpdated(
        address indexed oldReceipt,
        address indexed newReceipt
    );

    constructor(address _treasury, address _xcmYieldRecipient) Ownable() {
        if (_treasury == address(0) || _xcmYieldRecipient == address(0))
            revert SplitPayRouterZeroAddress();
        treasury = _treasury;
        xcmYieldRecipient = _xcmYieldRecipient;
    }

    function setReceiptNFT(address _receiptNFT) external onlyOwner {
        emit ReceiptNFTUpdated(address(receiptNFT), _receiptNFT);
        receiptNFT = IReceiptNFT(_receiptNFT);
    }

    function setTreasury(address _treasury) external onlyOwner {
        if (_treasury == address(0)) revert SplitPayRouterZeroAddress();
        emit TreasuryUpdated(treasury, _treasury);
        treasury = _treasury;
    }

    function setYieldRecipient(address _recipient) external onlyOwner {
        if (_recipient == address(0)) revert SplitPayRouterZeroAddress();
        emit YieldRecipientUpdated(xcmYieldRecipient, _recipient);
        xcmYieldRecipient = _recipient;
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    /// @notice Execute payment with atomic split. Mints receipt NFT on success.
    /// @param service Recipient of 70% (service provider)
    function pay(
        address service
    )
        external
        payable
        nonReentrant
        whenNotPaused
        returns (uint256 receiptTokenId)
    {
        uint256 amount = msg.value;
        if (amount == 0) revert SplitPayRouterZeroAmount();
        if (service == address(0)) revert SplitPayRouterZeroService();

        uint256 serviceShare = (amount * SERVICE_BPS) / BPS_DENOMINATOR;
        uint256 yieldShare = (amount * YIELD_BPS) / BPS_DENOMINATOR;
        uint256 treasuryShare = (amount * TREASURY_BPS) / BPS_DENOMINATOR;

        _safeTransferNative(service, serviceShare);
        _safeTransferNative(treasury, treasuryShare);

        if (yieldShare > 0) {
            _safeTransferNative(xcmYieldRecipient, yieldShare);
            emit XCMTransferQueued(yieldShare, 2034);
        }

        receiptTokenId = 0;
        if (address(receiptNFT) != address(0)) {
            receiptTokenId = receiptNFT.mintReceipt(
                msg.sender,
                msg.sender,
                service,
                amount
            );
        }

        emit PaymentSplit(
            msg.sender,
            service,
            amount,
            serviceShare,
            yieldShare,
            treasuryShare,
            receiptTokenId
        );
        return receiptTokenId;
    }

    function _safeTransferNative(address to, uint256 amount) internal {
        if (amount == 0) return;
        (bool success, ) = payable(to).call{value: amount}("");
        if (!success) revert SplitPayRouterTransferFailed();
    }
}
