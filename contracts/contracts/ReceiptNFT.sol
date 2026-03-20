// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @title ReceiptNFT
/// @notice Immutable payment receipt NFTs minted by SplitPayRouter
/// @dev Only MINTER (SplitPayRouter) can mint
contract ReceiptNFT is ERC721, Ownable {
    address public minter;

    uint256 private _nextTokenId;

    struct Receipt {
        address payer;
        address service;
        uint256 amount;
        uint256 timestamp;
    }

    mapping(uint256 => Receipt) public receipts;

    error ReceiptNFTUnauthorized();
    error ReceiptNFTZeroAddress();

    event PaymentReceiptMinted(
        uint256 indexed tokenId,
        address indexed payer,
        address indexed service,
        uint256 amount
    );
    event MinterUpdated(address indexed oldMinter, address indexed newMinter);

    constructor() ERC721("AgentPay Receipt", "RECEIPT") Ownable() {}

    function setMinter(address _minter) external onlyOwner {
        if (_minter == address(0)) revert ReceiptNFTZeroAddress();
        emit MinterUpdated(minter, _minter);
        minter = _minter;
    }

    function mintReceipt(
        address to,
        address payer,
        address service,
        uint256 amount
    ) external returns (uint256) {
        if (msg.sender != minter) revert ReceiptNFTUnauthorized();
        _nextTokenId++;
        uint256 tokenId = _nextTokenId;
        _safeMint(to, tokenId);
        receipts[tokenId] = Receipt({
            payer: payer,
            service: service,
            amount: amount,
            timestamp: block.timestamp
        });
        emit PaymentReceiptMinted(tokenId, payer, service, amount);
        return tokenId;
    }
}
