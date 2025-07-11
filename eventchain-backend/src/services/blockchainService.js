const { Gateway, Wallets } = require('fabric-network');
const path = require('path');
const fs = require('fs');

const ccpPath = process.env.CCP_PATH || path.resolve(__dirname, '../gateway/connection-org1.json');
const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

const identityName = 'admin';
const channelName = 'eventchain';
const chaincodeName = 'ticketContract';

async function connect() {
  const wallet = await Wallets.newFileSystemWallet(process.env.WALLET_PATH || path.join(__dirname, '../../wallet'));
  const identity = await wallet.get(identityName);
  if (!identity) throw new Error(`Identity '${identityName}' not found in wallet`);

  const gateway = new Gateway();
  await gateway.connect(ccp, {
    wallet,
    identity: identityName,
    discovery: { enabled: true, asLocalhost: true }
  });

  const network = await gateway.getNetwork(channelName);
  const contract = network.getContract(chaincodeName);

  return { gateway, contract };
}

const getTicket = async (ticketId) => {
  if (!ticketId || typeof ticketId !== 'string' || ticketId.trim() === '') {
    throw new Error('ID-ul biletului este invalid');
  }

  const { contract, gateway } = await connect();

  try {
    const result = await contract.evaluateTransaction('getTicket', ticketId);
    await gateway.disconnect();

    if (!result || result.length === 0) {
      return null;
    }

    try {
      return JSON.parse(result.toString());
    } catch (parseErr) {
      console.error('Eroare la parsarea biletului:', parseErr.message);
      throw new Error('Biletul nu a putut fi interpretat');
    }

  } catch (error) {
    await gateway.disconnect();
    console.error('Eroare în getTicket din blockchainService:', error.message);
    throw error;
  }
};

module.exports = { connect, getTicket };
