// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;


import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {IItem721} from "../interfaces/IItem721.sol";
import {MagicToken} from "./MagicToken.sol";


/// @title Marketplace
contract Marketplace is AccessControl {
    struct Listing {
        address nft;
        uint256 tokenId;
        address seller;
        uint256 price; // у MAGIC (18 decimals)
        bool active;
    }


    bytes32 public constant OPERATOR_ROLE = keccak256("OPERATOR_ROLE");


    MagicToken public immutable magic;
    Listing[] public listings;


    constructor(address admin, MagicToken _magic) {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        magic = _magic;
    }

    /// @notice Створити лістинг. Власник предмета додає його в маркет (без escrow). Require: msg.sender = власник.
    function list(address nft, uint256 tokenId, uint256 price) external returns (uint256 listingId) {
        require(price > 0, "price=0");
        require(_ownerOf(nft, tokenId) == msg.sender, "not owner");


        listings.push(Listing({nft: nft, tokenId: tokenId, seller: msg.sender, price: price, active: true}));
        listingId = listings.length - 1;
    }

    /// @notice Купити предмет. NFT спалюється, продавець отримує MAGIC (мінт із Marketplace).
    function buy(uint256 listingId) external {
        Listing storage L = listings[listingId];
        require(L.active, "inactive");

        IItem721(L.nft).burn(L.tokenId);

        magic.mint(L.seller, L.price);


        L.active = false;
    }


    function _ownerOf(address nft, uint256 tokenId) internal view returns (address) {
        (bool ok, bytes memory data) = nft.staticcall(abi.encodeWithSignature("ownerOf(uint256)", tokenId));
        require(ok && data.length >= 32, "ownerOf failed");
        return abi.decode(data, (address));
    }
}