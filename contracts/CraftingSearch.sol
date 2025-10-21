// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {IResource1155} from "../interfaces/IResource1155.sol";
import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {IResource1155} from "../interfaces/IResource1155.sol";
import {IItem721} from "../interfaces/IItem721.sol";


/// @title CraftingSearch
contract CraftingSearch is AccessControl {
    IResource1155 public immutable resource;
    IItem721 public immutable sabre;
    IItem721 public immutable staff;

    uint256 public constant COOLDOWN = 60;
    mapping(address => uint256) public lastSearchAt;
    uint256 private nonce;

    constructor(
        address admin,
        IResource1155 _resource,
        IItem721 _sabre,
        IItem721 _staff
    ) {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        resource = _resource;
        sabre = _sabre;
        staff = _staff;
    }

    /// @notice Раз на 60с гравець отримує 3 випадкові ресурси.
    function search() external {
        require(block.timestamp >= lastSearchAt[msg.sender] + COOLDOWN, "Cooldown");
        lastSearchAt[msg.sender] = block.timestamp;

        uint256 r1 = _rand() % 6;
        uint256 r2 = _rand() % 6;
        uint256 r3 = _rand() % 6;

        uint256[] memory ids = new uint256[](3);
        ids[0] = r1;
        ids[1] = r2;
        ids[2] = r3;

        uint256[] memory amts = new uint256[](3);
        amts[0] = 1;
        amts[1] = 1;
        amts[2] = 1;

        resource.mintBatch(msg.sender, ids, amts, "");
    }

    /// @notice 3×Iron, 1×Wood, 1×Leather → Sabre
    function craftSabre() external {

        uint256[] memory ids = new uint256[](3);
        ids[0] = 1; // IRON
        ids[1] = 0; // WOOD
        ids[2] = 3; // LEATHER

        uint256[] memory amts = new uint256[](3);
        amts[0] = 3;
        amts[1] = 1;
        amts[2] = 1;

        resource.burnBatch(msg.sender, ids, amts);
        sabre.mintTo(msg.sender);
    }

    /// @notice 2×Wood, 1×Gold, 1×Diamond → Staff
    function craftStaff() external {
        uint256[] memory ids = new uint256[](3);
        ids[0] = 0; // WOOD
        ids[1] = 2; // GOLD
        ids[2] = 5; // DIAMOND

        uint256[] memory amts = new uint256[](3);
        amts[0] = 2;
        amts[1] = 1;
        amts[2] = 1;

        resource.burnBatch(msg.sender, ids, amts);
        staff.mintTo(msg.sender);
    }

    function _rand() private returns (uint256) {
        return uint256(keccak256(abi.encodePacked(block.timestamp, msg.sender, nonce++)));
    }
}
