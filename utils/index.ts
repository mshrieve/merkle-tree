import { ethers } from 'ethers'

const computeHash = (accounts: string[], depth: number) => {
  const computeHash = (_value: number, _depth: number): string => {
    if (_depth == depth) return hashAddress(accounts[_value])
    return ethers.utils.keccak256(
      xor(
        computeHash(2 * _value, _depth + 1),
        computeHash(2 * _value + 1, _depth + 1)
      )
    )
  }
  const hash = ethers.utils.hexlify(computeHash(0, 0))
  return hash
}

const xor = (string1: string, string2: string) => {
  return ethers.BigNumber.from(string1).xor(string2).toHexString()
}

const hashAddress = (address: string) => {
  return ethers.utils.keccak256(ethers.utils.hexZeroPad(address, 32))
}

const getHashes = (accounts: string[], depth: number, value: number) => {
  const computeHash = (_value: number, _depth: number): string => {
    if (_depth == depth) return hashAddress(accounts[_value])
    return ethers.utils.keccak256(
      xor(
        computeHash(2 * _value, _depth + 1),
        computeHash(2 * _value + 1, _depth + 1)
      )
    )
  }
  let hashes: string[] = []
  for (let _h = 1; _h <= depth; _h++) {
    // get value
    const _value = Math.floor(value / 2 ** (depth - _h))
    // add _delta to get the sibling's value
    const _delta = _value % 2 ? -1 : 1
    // get the opposite hash
    const hash = computeHash(_value + _delta, _h)

    hashes = [hash, ...hashes]
  }

  return hashes
}

export { computeHash, getHashes, hashAddress, xor }
