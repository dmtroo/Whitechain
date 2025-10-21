// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;


import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";


/// @title ItemNFT721_Staff
contract ItemNFT721_Staff is ERC721, AccessControl {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant BURNER_ROLE = keccak256("BURNER_ROLE");
    uint256 private _nextId = 1;


    constructor(address admin) ERC721("Elder Staff", "STAFF") {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
    }


    function mintTo(address to) external onlyRole(MINTER_ROLE) returns (uint256 tokenId) {
        tokenId = _nextId++;
        _mint(to, tokenId);
    }


    function burn(uint256 tokenId) external onlyRole(BURNER_ROLE) {
        _burn(tokenId);
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC721, AccessControl) returns (bool){
        return super.supportsInterface(interfaceId);
    }

}