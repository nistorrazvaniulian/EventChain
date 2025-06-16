const { Gateway, Wallets } = require('fabric-network');
const path = require('path');
const fs = require('fs');

const ccpPath = path.resolve(__dirname, '../gateway/connection-org1.json');
const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

async function connect() {
  const wallet = await Wallets.newFileSystemWallet(path.join(__dirname, '../../wallet'));
  const identity = await wallet.get('admin');
  if (!identity) throw new Error('Admin identity not found in wallet');

  const gateway = new Gateway();
  await gateway.connect(ccp, {
    wallet,
    identity: 'admin',
    discovery: { enabled: true, asLocalhost: true }
  });

  const network = await gateway.getNetwork('eventchain');
  const contract = network.getContract('ticketcontract');

  return { gateway, contract };
}

const getTicket = async (ticketId) => {
  const { contract, gateway } = await connect();
  try {
    const result = await contract.evaluateTransaction('getTicket', ticketId);
    await gateway.disconnect();

    if (!result || result.length === 0) {
      return null;
    }

    return JSON.parse(result.toString());
  } catch (error) {
    await gateway.disconnect();
    console.error('Eroare în getTicket din blockchainService:', error.message);
    throw error;
  }
};

module.exports = { connect, getTicket };
