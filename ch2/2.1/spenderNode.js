const EthCrypto = require('eth-crypto');
const NetworkSimulator = require('../networkSim');
const { Node, getTxHash } = require('../nodeAgent');
// Spender is a Node that sends a random transaction at every tick()
// Spender extends the Node class in nodeAgent.js
// - this means that everything that is available to the Node class is imported and
// available to the Spender class as well
class Spender extends Node {
  // initialize the Spender class
  constructor(wallet, gensis, network, nodes) {
    super(wallet, gensis, network); // calls parent class's constructor, in this case `Node`
    // tell the Spender Node about the other nodes on the network
    this.nodes = nodes;
  }
  // returns a random wallet address (excluding the Spender)
  getRandomReceiver() {
    // create array of Node addresses that does not include this Node
    const otherNodes = this.nodes.filter(
      n => n.wallet.address !== this.wallet.address
    );
    // pick a node at random from the nodes that are not this node
    const randomNode = otherNodes[Math.floor(Math.random() * otherNodes.length)];
    // return the address of that random node
    return randomNode.wallet.address;
  }

  // tick() makes stuff happen
  // in this case we're simulating agents performing actions on a network
  // available options are
  // - do nothing
  // - send a transaction
  tick() {
    // TODO
    // check if we have money
    if (this.state[this.wallet.address].balance > 0) {
      console.log('We have ',this.state[this.wallet.address].balance, ' in the wallet');
    }

    // if we have no money, don't do anything
    if (this.state[this.wallet.address].balance < 10) {
      // print a fun message to the console stating that we're not doing anything
      console.log('We only have ', this.state[this.wallet.address].balance, ' in the wallet',
    'so we cant send anything');
    // return to exit the function
    return;
    }

    // if we do have money
    // Generate a random transaction
    const tx = this.generateTx(this.getRandomReceiver(), 10);
    // add the transaction to our historical transaction list
    this.transactions.push(tx);
    // process the transaction
    this.applyTransaction(tx);
    // broadcast the transaction to the network
    this.network.broadcast(this.pid, tx);
  }
}

module.exports = Spender;
