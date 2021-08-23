// SPDX-License-Identifier: UNLICENSED

import 'hardhat/console.sol';

pragma solidity ^0.8.0;

contract Merkle {
    bytes32 immutable root;
    uint256 immutable depth;

    constructor(bytes32 _root, uint256 _depth) {
        root = _root;
        depth = _depth;
    }

    function verify(address account, bytes32[] memory hashes)
        public
        view
        returns (bool)
    {
        require(hashes.length == depth);
        // first hash the account
        bytes32 hash = keccak256(abi.encode(account));
        for (uint8 h = 0; h < depth; h++)
            // use xor for symmetric hashing
            hash = keccak256(abi.encode(hash ^ hashes[h]));
        // check to see if resultant hash matches the root
        return (hash == root);
    }
}
