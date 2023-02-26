import * as fcl from '@onflow/fcl';
import './config';

// emulator
// const accessNode = 'http://127.0.0.1:8888';
// const discoveryWallet = 'http://localhost:8701/fcl/authn';

// testnet
// const accessNode = 'https://rest-testnet.onflow.org';
// const discoveryWallet = 'https://fcl-discovery.onflow.org/testnet/authn';

// fcl.config().put('accessNode.api', accessNode).put('discovery.wallet', discoveryWallet)

export const authenticate = async () => {
    await fcl.authenticate();
};

export const unauthenticate = async () => {
    await fcl.unauthenticate();
};

export const sayHello = async () => {
    const response = await fcl.query({
        cadence: `
            import HelloWorld from 0xa6acb8c2a3d23fef
            pub fun main(): String {
                return HelloWorld.greeting
            }
        `,
    });
    console.log(response);
    // return await fcl.decode(response);
};

// export const sayHello = async () => {
//     const response = await fcl.send([
//         fcl.script`
//             pub fun main(): String {
//                 return "Hello, World!"
//             }
//         `
//     ]);
//     console.log(response);
//     return await fcl.decode(response);
// }

export const createEmptyCollection = async () => {
    const transactionId = await fcl.mutate({
        cadence: `
                import NonFungibleToken from 0x631e88ae7f1d7c20
                import MyNFT from 0xa6acb8c2a3d23fef

                transaction {
                    prepare(acct: AuthAccount) {
                        acct.save(<- MyNFT.createEmptyCollection(), to: /storage/MyNFTCollection)
                        acct.link<&MyNFT.Collection{MyNFT.CollectionPublic, NonFungibleToken.CollectionPublic}>(/public/MyNFTCollection, target: /storage/MyNFTCollection)
                    }
                    
                    execute {
                        log("User Created the collection")
                    }
                }
                `,
        args: (arg, t) => [],
        proposer: fcl.authz,
        payer: fcl.authz,
        authorizations: [fcl.authz],
    });

    fcl.tx(transactionId).subscribe((transaction) => {
        console.log(transaction);
    });

    console.log(transactionId);
};

export const mintNFT = async () => {
    const transactionId = await fcl.mutate({
        cadence: `
                import NonFungibleToken from 0x631e88ae7f1d7c20
                import LandNFT from 0xa6acb8c2a3d23fef
                
                transaction(ipfsHash: String, metadata: {String: String}) {
                
                let minter: &LandNFT.NFTMinter
                
                prepare(acct: AuthAccount) {
                    self.minter = acct.borrow<&LandNFT.NFTMinter>(from: LandNFT.MinterStoragePath)
                            ?? panic("Could not borrow a reference to the NFT minter")
                    
                    log(acct)
                
                    let receiver = acct
                            .getCapability(LandNFT.CollectionPublicPath)
                            .borrow<&{NonFungibleToken.CollectionPublic}>()
                            ?? panic("Could not get receiver reference to the NFT Collection")
                
                        // Mint the NFT and deposit it to the recipient's collection
                        self.minter.mintNFT(recipient: receiver,ipfsHash: ipfsHash, metadata: metadata)
                }
                
                execute {
                    log("User Created the collection")
                }
                }        
                `,
        args: (arg, t) => [
            arg('woah', t.String),
            arg([{ key: 'first', value: 'nft on flow' }], t.Dictionary({ key: t.String, value: t.String })),
        ],
        proposer: fcl.authz,
        payer: fcl.authz,
        authorizations: [fcl.authz],
    });
    fcl.tx(transactionId).subscribe((transaction) => {
        console.log(transaction);
    });

    console.log(transactionId);
};

export const getNFTs = async (addr="0xa6acb8c2a3d23fef") => {
    const response = await fcl.query({
        cadence: `
                import NonFungibleToken from 0x631e88ae7f1d7c20
                import LandNFT from 0xa6acb8c2a3d23fef
                
                pub fun main(account: Address): [&LandNFT.NFT] {
                let collection = getAccount(account).getCapability(/public/LandNFTCollection)
                                    .borrow<&LandNFT.Collection{NonFungibleToken.CollectionPublic, LandNFT.CollectionPublic}>()
                                    ?? panic("Can't get the User's collection.")
                                
                // log(collection.borrowEntireNFT(id: 0))
                let returnVals: [&LandNFT.NFT] = []
                            let ids = collection.getIDs()
                            for id in ids {
                                returnVals.append(collection.borrowEntireNFT(id: id))
                            }
                            log(returnVals)
                            return returnVals
                }
        `,
        args: (arg, t) => [arg(addr, t.Address)],
    });
    console.log(response)
    return response;
    // return await fcl.decode(response);
};

// export const getNFTs = async (addr) => {
//     console.log(addr)
//     const response = await fcl.query({
//         cadence: `
//             import MyNFT from 0xa6acb8c2a3d23fef
//             import NonFungibleToken from 0x631e88ae7f1d7c20
//             pub fun main(account: Address): [&MyNFT.NFT] {
//             let collection = getAccount(account).getCapability(/public/MyNFTCollection)
//                                 .borrow<&MyNFT.Collection{NonFungibleToken.CollectionPublic, MyNFT.CollectionPublic}>()
//                                 ?? panic("Can't get the User's collection.")
//             let returnVals: [&MyNFT.NFT] = []
//             let ids = collection.getIDs()
//             for id in ids {
//                 returnVals.append(collection.borrowEntireNFT(id: id))
//             }
//             return returnVals
//             }
//         `,
//         args: (arg, t) => [arg(addr, t.Address)]
//     });

//     console.log(response);
//     // return await fcl.decode(response);
// };


export const setIPFS = async (id, ipfsHash) => {
    const transactionId = await fcl.mutate({
        cadence: `
                import LandNFT from 0xa6acb8c2a3d23fef

                transaction(id: UInt64, ipfsHash: String) {

                prepare(acct: AuthAccount) {
                    let collection = acct.borrow<&LandNFT.Collection>(from: LandNFT.CollectionStoragePath)
                    ?? panic("Could not borrow a reference to the owner's collection")

                    collection.updateIPFS(id: id, ipfsHash: ipfsHash)
                    
                }
                execute {
                    log("User Updated The Hash")
                }
                }
                `,
        args: (arg, t) => [arg(id, t.UInt64), arg(ipfsHash, t.String)],
        proposer: fcl.authz,
        payer: fcl.authz,
        authorizations: [fcl.authz],
    });
    fcl.tx(transactionId).subscribe((transaction) => {
        console.log(transaction);
    });

    return fcl.tx(transactionId).onceSealed();

}