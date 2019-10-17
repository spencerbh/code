const EthCrypto = require('eth-crypto');

// The client that end-users will use to interact with our central payment processor
class Client {
  // Initializes a public/private key pair for the user
  constructor() {
    this.wallet = EthCrypto.createIdentity();
  }

  // Creates a keccak256/SHA3 hash of some data
  hash(data) {
    const dataStr = JSON.stringify(data);
    return EthCrypto.hash.keccak256(data);
  }

  // Signs a hash of data with the client's private key
  sign(message) {
    const messageHash = this.hash(message);
    return EthCrypto.sign(this.wallet.privateKey, messageHash);
  }

  // Verifies that a messageHash is signed by a certain address
  verify(signature, messageHash, address) {
    const signer = EthCrypto.recover(signature, messageHash);
    return signer === address;
  }

  // Buys tokens from Paypal
  buy(amount) {
    // Let the user know that they just exchanged off-network goods for network tokens
    console.log(`You just traded some wheat grass for ${amount} tokens on juice_net`);
  }

  // Generates new transactions
  generateTx(to, amount, type) {
    // create an unsigned transaction
    const txn_unsigned = {
      type,
      amount,
      from: this.wallet.address,
      to,
    }
    // create a signature of the transaction
    const txn = {
      contents: txn_unsigned,
      sig: this.sign(txn_unsigned)
    }
    // return a Javascript object with the unsigned transaction and transaction signature
    return txn;
  }
}

module.exports = Client;
