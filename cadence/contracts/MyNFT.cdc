// import NonFungibleToken from "./NonFungibleToken.cdc"
import NonFungibleToken from 0x631e88ae7f1d7c20

pub contract MyNFT: NonFungibleToken {

  pub var totalSupply: UInt64

  pub event ContractInitialized()
  pub event Withdraw(id: UInt64, from: Address?)
  pub event Deposit(id: UInt64, to: Address?)

  pub resource NFT: NonFungibleToken.INFT {
    pub let id: UInt64
    pub let ipfsHash: String
    pub var metadata: {String: String}

    init(ipfsHash: String, metadata: {String: String}){
      self.id = MyNFT.totalSupply

      MyNFT.totalSupply = MyNFT.totalSupply + 1
      self.ipfsHash = ipfsHash
      self.metadata = metadata
    }
  }

  pub resource interface CollectionPublic {
    pub fun borrowEntireNFT(id: UInt64) : &MyNFT.NFT
  }

  pub resource Collection: NonFungibleToken.Provider, NonFungibleToken.Receiver, NonFungibleToken.CollectionPublic, CollectionPublic {
    pub var ownedNFTs: @{UInt64: NonFungibleToken.NFT}

    pub fun deposit(token: @NonFungibleToken.NFT){
      let myToken <- token as! @MyNFT.NFT

      emit Deposit(id: myToken.id, to: self.owner?.address)
      self.ownedNFTs[myToken.id] <-! myToken
    }

    pub fun withdraw(withdrawID: UInt64): @NonFungibleToken.NFT{
      let token <- self.ownedNFTs.remove(key: withdrawID) ?? panic("This NFT doesn't exists")
      emit Withdraw(id: withdrawID, from: self.owner?.address)
      return <- token
    }

    pub fun getIDs(): [UInt64]{
      return self.ownedNFTs.keys
    }

    pub fun borrowNFT(id: UInt64): &NonFungibleToken.NFT {
      return (&self.ownedNFTs[id] as &NonFungibleToken.NFT?)!
    }

    pub fun borrowEntireNFT(id: UInt64): &MyNFT.NFT {
      let reference = (&self.ownedNFTs[id] as auth &NonFungibleToken.NFT?)!
      return reference as! &MyNFT.NFT
    }

    init(){
      self.ownedNFTs <- {}
    }

    destroy () {
      destroy self.ownedNFTs
    }
  }

  pub fun createEmptyCollection(): @Collection {
    return <- create Collection()  
  }

  pub fun createToken(ipfsHash: String, metadata: {String: String}) : @MyNFT.NFT {
    return <- create NFT(ipfsHash: ipfsHash, metadata: metadata)
  }


  init() {
    self.totalSupply = 0
  }
}