import { ethers } from 'ethers'
import { task } from 'hardhat/config'
import { hashAddress, getHashes } from '../utils'

task('accounts', 'Prints the list of accounts', async (args, hre) => {
  const accounts = await hre.ethers.getSigners()

  for (const account of accounts) {
    console.log(await account.address)
  }
})

task('zeroHash', 'computes the hash of zero', async (args, { ethers }) => {
  console.log(ethers.utils.keccak256(ethers.constants.HashZero))
})

task(
  'merkleRoot',
  'computes a particular merkle root',
  async (args, { ethers }) => {
    const accounts = await ethers.getSigners()
    console.log(accounts.length)
    // there are 20 accounts, so lets make a merkle tree of depth 3, 2^3 = 8
    const computeHash = (value: number, depth: number): Uint8Array => {
      if (depth == 3)
        return ethers.utils.arrayify(
          ethers.utils.keccak256(accounts[value].address)
        )
      return ethers.utils.arrayify(
        ethers.utils.keccak256([
          ...computeHash(value * 2, depth + 1),
          ...computeHash(value * 2 + 1, depth + 1)
        ])
      )
    }
    const hash = ethers.utils.hexlify(computeHash(0, 0))
    console.log(hash)
  }
)
