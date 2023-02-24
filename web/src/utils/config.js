import * as fcl from '@onflow/fcl';

// emulator
// const accessNode = 'http://127.0.0.1:8888';
// const discoveryWallet = 'http://localhost:8701/fcl/authn';

// testnet
const accessNode = 'https://rest-testnet.onflow.org';
const discoveryWallet = 'https://fcl-discovery.onflow.org/testnet/authn';

fcl.config().put('accessNode.api', accessNode).put('discovery.wallet', discoveryWallet);
