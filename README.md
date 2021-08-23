# merkle-tree

A simple merkle tree implementation

See tests for usage

Warning: be very careful to not allow repeated addresses, otherwise it could be that any address can be validated,
do to the use of xor to combine hashes.

It is sufficient to ensure that keccak256(0) does not appear in the tree.

## tests

run all tests: `npx hardhat test`
