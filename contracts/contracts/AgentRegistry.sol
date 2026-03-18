// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract AgentRegistry is ERC721 {
    uint256 private _nextTokenId;

    error SoulboundToken();

    constructor() ERC721("AgentPay Agent", "AGENT") {}

    function mintAgent(address to) external returns (uint256) {
        _nextTokenId++;
        _safeMint(to, _nextTokenId);
        return _nextTokenId;
    }

    function _update(
        address to,
        uint256 tokenId,
        address auth
    ) internal virtual override returns (address) {
        address from = _ownerOf(tokenId);
        if (from != address(0) && to != address(0)) {
            revert SoulboundToken();
        }
        return super._update(to, tokenId, auth);
    }
}
