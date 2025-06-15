const fs = require('fs');
const path = require('path');
const { Wallets } = require('fabric-network');

const mspId = 'Org1MSP';
const walletPath = path.join(__dirname, '../wallet');

async function main() {
  const wallet = await Wallets.newFileSystemWallet(walletPath);

  const cert = fs.readFileSync(path.join(walletPath, 'admin-cert.pem'), 'utf8');
  const key = fs.readFileSync(path.join(walletPath, 'admin-key.pem'), 'utf8');

  const identity = {
    credentials: { certificate: cert, privateKey: key },
    mspId,
    type: 'X.509'
  };

  await wallet.put('admin', identity);
  console.log('✔️ Admin identity added to wallet');
}

main().catch((err) => {
  console.error('❌ Eroare la adăugarea identității:', err);
});
