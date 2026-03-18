// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract SplitPayRouter is ReentrancyGuard {
    address public treasury;
    address public xcmYieldRecipient;
    uint32 public constant SERVICE_BPS = 7000;
    uint32 public constant YIELD_BPS = 2000;
    uint32 public constant TREASURY_BPS = 1000;

    event PaymentSplit(
        address indexed payer,
        address indexed service,
        uint256 amount,
        uint256 serviceShare,
        uint256 yieldShare,
        uint256 treasuryShare
    );
    event XCMTransferQueued(uint256 amount, uint32 targetParaId);

    constructor(address _treasury, address _xcmYieldRecipient) {
        treasury = _treasury;
        xcmYieldRecipient = _xcmYieldRecipient;
    }

    function pay(address service) external payable nonReentrant {
        uint256 amount = msg.value;
        require(amount > 0, "SplitPayRouter: no payment");
        require(service != address(0), "SplitPayRouter: zero service");

        uint256 serviceShare = (amount * SERVICE_BPS) / 10_000;
        uint256 yieldShare = (amount * YIELD_BPS) / 10_000;
        uint256 treasuryShare = (amount * TREASURY_BPS) / 10_000;

        payable(service).transfer(serviceShare);
        payable(treasury).transfer(treasuryShare);

        if (yieldShare > 0 && xcmYieldRecipient != address(0)) {
            payable(xcmYieldRecipient).transfer(yieldShare);
        }

        emit PaymentSplit(
            msg.sender,
            service,
            amount,
            serviceShare,
            yieldShare,
            treasuryShare
        );
        emit XCMTransferQueued(yieldShare, 2034);
    }
}
