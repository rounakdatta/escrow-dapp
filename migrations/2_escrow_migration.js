const Factory = artifacts.require('Factory');
const Escrow = artifacts.require('Escrow');

module.exports = function(deployer) {
  deployer.deploy(Factory);
  deployer.deploy(Escrow);
};