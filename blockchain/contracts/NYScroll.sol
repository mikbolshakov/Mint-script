// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract NYScroll is ERC721 {
    using Strings for uint256;

    uint256 private _nextTokenId;

    string private baseURI;
    string private baseExtension = ".json";
    string private notRevealedBaseUri;
    bool private revealed = false;
    address private owner;

    constructor(
        address _owner,
        string memory _notRevealedBaseUri
    ) ERC721("NYScroll", "NYS") {
        owner = _owner;
        notRevealedBaseUri = _notRevealedBaseUri;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not an owner");
        _;
    }

    function _baseURI() internal view override returns (string memory) {
        return baseURI;
    }

    /* GETTERS */
    function getBaseUri() external view returns (string memory) {
        return baseURI;
    }

    function getNotRevealedBaseUri() external view returns (string memory) {
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

    // The following functions are overrides required by Solidity.

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId,
        uint256 batchSize
    ) internal override {
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }

    function supportsInterface(
        bytes4 interfaceId
    ) public view override(ERC721) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
