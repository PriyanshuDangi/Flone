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

export const runTransaction = async () => {
    const transactionId = await fcl.mutate({
        cadence: `
            import HelloWorld from 0xa6acb8c2a3d23fef
            transaction {
                prepare(signer: AuthAccount) {
                }
                execute {
                    HelloWorld.changeGreeting(newGreeting: "Hello, Priyanshu Dangi!")
                    log("Hello, World!")
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
