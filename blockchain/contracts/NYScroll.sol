// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract NYScroll is ERC721, ERC721Pausable, Ownable {
    using Strings for uint256;

    uint256 private _nextTokenId;

    string private baseURI;
    string private baseExtension = ".json";
    string private notRevealedBaseUri;
    bool private revealed = false;

    constructor(
        address initialOwner, string memory _notRevealedBaseUri
    ) ERC721("NYScroll", "NYS") Ownable(initialOwner) {
        notRevealedBaseUri = _notRevealedBaseUri;
    }

    function _baseURI() internal view override returns (string memory) {
        return baseURI;
    }

    /* GETTERS */
    function getBaseUri() external view returns(string memory) {
        return baseURI;
    }

    function getNotRevealedBaseUri() external view returns(string memory) {
        return notRevealedBaseUri;
    }

    function tokenURI(
        uint256 tokenId
    ) public view virtual override returns (string memory) {
        require(
            _ownerOf(tokenId) != address(0),
            "ERC721Metadata: URI query for nonexistent token"
        );

        if (revealed == false) {
            return notRevealedBaseUri;
        }

        string memory currentBaseURI = _baseURI();
        return
            bytes(currentBaseURI).length > 0
                ? string(
                    abi.encodePacked(
                        currentBaseURI,
                        tokenId.toString(),
                        baseExtension
                    )
                )
                : "";
    }

    /* MINT */
    function safeMint() external {
        uint256 tokenId = _nextTokenId++;
        _safeMint(msg.sender, tokenId);
    }

    /* ONLY OWNER */
    function setBaseURI(string memory _newBaseURI) external onlyOwner {
        baseURI = _newBaseURI;
    }

    function reveal() external onlyOwner {
        revealed = true;
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    function withdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "Zero balance");

        (bool success, ) = address(owner()).call{value: balance}("");
        require(success, "Transfer failed.");
    }

    // The following functions are overrides required by Solidity.

    function _update(
        address to,
        uint256 tokenId,
        address auth
    ) internal override(ERC721, ERC721Pausable) returns (address) {
        return super._update(to, tokenId, auth);
    }
}
