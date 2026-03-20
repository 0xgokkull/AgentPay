// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

/// @title AgentRegistry
/// @notice Soulbound identity NFT for AI agents
/// @dev Non-transferable. Only REGISTRAR_ROLE can mint.
contract AgentRegistry is ERC721, AccessControl {
    bytes32 public constant REGISTRAR_ROLE = keccak256("REGISTRAR_ROLE");

    uint256 private _nextTokenId;

    error AgentRegistrySoulbound();

    event AgentRegistered(address indexed agent, uint256 indexed tokenId);

    constructor() ERC721("AgentPay Agent", "AGENT") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(REGISTRAR_ROLE, msg.sender);
    }

    /// @notice Register a new agent identity
    /// @param to Address to receive the soulbound token
    function mintAgent(
        address to
    ) external onlyRole(REGISTRAR_ROLE) returns (uint256) {
        _nextTokenId++;
        uint256 tokenId = _nextTokenId;
        _safeMint(to, tokenId);
        emit AgentRegistered(to, tokenId);
        return tokenId;
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId,
        uint256 batchSize
    ) internal virtual override {
        if (from != address(0) && to != address(0))
            revert AgentRegistrySoulbound();
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }

    function supportsInterface(
        bytes4 interfaceId
    ) public view override(ERC721, AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
