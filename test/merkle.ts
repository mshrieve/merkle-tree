import { ethers } from 'hardhat'
import { Contract } from 'ethers'
import { expect } from 'chai'
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'
import { Interface } from 'ethers/lib/utils'
import { computeHash, getHashes } from '../utils'

describe('Merkle', function () {
  let Merkle: Contract
  let owner: SignerWithAddress
  let accounts: SignerWithAddress[]
  let iface: Interface

  before(async () => {
    accounts = await ethers.getSigners()
    owner = accounts[0]
    const MerkleFactory = await ethers.getContractFactory('Merkle')
    // accounts has 20, we use 2^4 = 16
    // compute the root hash with an array of address of length >= 16
    // and depth 4
    const rootHash = computeHash(
      accounts.map((account: SignerWithAddress) => account.address),
      4
    )
    Merkle = await MerkleFactory.deploy(rootHash, 4)
    const MerkleInterface = MerkleFactory.interface
    await Merkle.deployed()

    iface = MerkleInterface
  })

  it('should verify included address', async function () {
    for (let i = 0; i < 16; i++) {
      // get the intermediate hashes used to verify the address
      const hashes = getHashes(
        accounts.map((account) => account.address),
        //   depth of 4
        4,
        //   i-th address
        i
      )
      //   get the result
      let result = await Merkle.verify(accounts[i].address, hashes)
      expect(result).to.be.true
    }
  })

  it('should not verify arbitrary address', async function () {
    const hashes = getHashes(
      accounts.map((account) => account.address),
      //   depth of 4
      4,
      //   12th address
      12
    )

    // we can't even run getHashes with this address, so this is just a sanity check
    const result = await Merkle.verify(accounts[17].address, hashes)
    expect(result).to.be.false
  })
})
