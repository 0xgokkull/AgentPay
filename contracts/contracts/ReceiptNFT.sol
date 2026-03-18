// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract ReceiptNFT is ERC721 {
    uint256 private _nextTokenId;

    struct Receipt {
        address payer;
        address service;
        uint256 amount;
        uint256 timestamp;
    }

    mapping(uint256 => Receipt) public receipts;

    event PaymentReceiptMinted(
        uint256 indexed tokenId,
        address indexed payer,
        address indexed service,
        uint256 amount
    );

    constructor() ERC721("AgentPay Receipt", "RECEIPT") {}

    function mintReceipt(
        address to,
        address payer,
        address service,
        uint256 amount
    ) external returns (uint256) {
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
