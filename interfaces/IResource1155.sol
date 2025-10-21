// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;


interface IResource1155 {
    function mintBatch(address to, uint256[] calldata ids, uint256[] calldata amounts, bytes calldata data) external;
    function burnBatch(address from, uint256[] calldata ids, uint256[] calldata amounts) external;
}