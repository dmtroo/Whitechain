// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;


interface IItem721 {
    function mintTo(address to) external returns (uint256 tokenId);
    function burn(uint256 tokenId) external;
}