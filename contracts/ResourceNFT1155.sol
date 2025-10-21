// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;


import {ERC1155} from "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";


/// @title ResourceNFT1155
contract ResourceNFT1155 is ERC1155, AccessControl {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant BURNER_ROLE = keccak256("BURNER_ROLE");

    // ID ресурсів
    uint256 public constant WOOD = 0;
    uint256 public constant IRON = 1;
    uint256 public constant GOLD = 2;
    uint256 public constant LEATHER = 3;
    uint256 public constant STONE = 4;
    uint256 public constant DIAMOND = 5;

    constructor(string memory baseURI, address admin) ERC1155(baseURI) {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
    }


    /// @notice Мінтить пакет ресурсів на адресу гравця. Доступно лише контракту з роллю MINTER_ROLE (Search/Craft).
    function mintBatch(address to, uint256[] calldata ids, uint256[] calldata amounts, bytes calldata data) external onlyRole(MINTER_ROLE) {
        _mintBatch(to, ids, amounts, data);
    }


    /// @notice Спалює пакет ресурсів з адреси гравця. Доступно лише контракту з роллю BURNER_ROLE (Crafting).
    function burnBatch(address from, uint256[] calldata ids, uint256[] calldata amounts) external onlyRole(BURNER_ROLE) {
        _burnBatch(from, ids, amounts);
    }


    function supportsInterface(bytes4 interfaceId) public view override(ERC1155, AccessControl) returns (bool){
        return super.supportsInterface(interfaceId);
    }

}