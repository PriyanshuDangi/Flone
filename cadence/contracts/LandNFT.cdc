 import NonFungibleToken from 0x01

pub contract MyNFT: NonFungibleToken {

  pub var totalSupply: UInt64

  pub event ContractInitialized()
  pub event Withdraw(id: UInt64, from: Address?)
  pub event Deposit(id: UInt64, to: Address?)

  pub let CollectionStoragePath: StoragePath
  pub let CollectionPublicPath: PublicPath
  pub let MinterStoragePath: StoragePath

  pub resource NFT: NonFungibleToken.INFT {
    pub let id: UInt64
    pub var ipfsHash: String
    pub var land_ipfs: String
    pub var atlas_ipfs: String
    pub let metadata: {String: String}

    pub fun setIPFS(ipfsHash: String){
      self.ipfsHash = ipfsHash
    }

    pub fun setLandIPFS(land_ipfs: String){
      self.land_ipfs = land_ipfs
    }

    pub fun setAtlasIPFS(atlas_ipfs: String){
      self.atlas_ipfs = atlas_ipfs
    }

    init(ipfsHash: String, metadata: {String: String}){
      self.id = MyNFT.totalSupply

      MyNFT.totalSupply = MyNFT.totalSupply + 1
      self.ipfsHash = ipfsHash
      self.land_ipfs = ""
      self.atlas_ipfs = ""
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

    pub fun updateIPFS(id: UInt64, ipfsHash: String){
      let nft = self.borrowEntireNFT(id: id)
      nft.setIPFS(ipfsHash: ipfsHash)
    }

    pub fun updateLandIPFS(id: UInt64, land_ipfs: String){
      let nft = self.borrowEntireNFT(id: id)
      nft.setLandIPFS(land_ipfs: land_ipfs)
    }

    pub fun updateAtlasIPFS(id: UInt64, atlas_ipfs: String){
      let nft = self.borrowEntireNFT(id: id)
      nft.setAtlasIPFS(atlas_ipfs: atlas_ipfs)
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

  pub resource NFTMinter {

        // mintNFT mints a new NFT with a new ID
        // and deposit it in the recipients collection using their collection reference
        pub fun mintNFT(
            recipient: &{NonFungibleToken.CollectionPublic},
            ipfsHash: String, metadata: {String: String}
        ) {

            // create a new NFT
            var newNFT <- create NFT(
                ipfsHash: ipfsHash, metadata: metadata
            )

            // deposit it in the recipient's account using their reference
            recipient.deposit(token: <-newNFT)
        }
    }


  init() {
    self.totalSupply = 0

    self.CollectionStoragePath = /storage/MyNFTCollection
    self.CollectionPublicPath = /public/MyNFTCollection
    self.MinterStoragePath = /storage/MyNFTMinter

    let collection <- create Collection()
    self.account.save(<-collection, to: self.CollectionStoragePath)

    self.account.link<&MyNFT.Collection{MyNFT.CollectionPublic, NonFungibleToken.CollectionPublic}>(self.CollectionPublicPath, target: self.CollectionStoragePath)

    // Create a Minter resource and save it to storage
    let minter <- create NFTMinter()
    self.account.save(<-minter, to: self.MinterStoragePath)

  }
}