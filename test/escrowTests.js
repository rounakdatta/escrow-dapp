const factory = artifacts.require("Factory");
const escrow = artifacts.require("Escrow");

contract(factory, function(accounts) => {
	it("should initiate the factory contract and create a single new Escrow contract", function() {
		return factory.deployed().then(function(factoryInstance) {
			factoryInstance.createContract();
		})
		.then(function() {
			return instance.getAllContracts();
		})
		.then(function(_allEscrowContracts) {
			assert.equal(_allEscrowContracts.length, 1, "incorrect number of Escrows created");
		});
	});
});

contract(escrow, accounts[0], 0, function(accounts) => {
	it("should create a new escrow and return escrowID as 1", function() {
		return escrow.deployed().then(function(instance) {
			instance.initEscrow(accounts[1], accounts[2], 10, 1250001);
		})
		.then(function() {
			assert.equal(instance.escrowID, 1, "escrow ID error");
		});
	});

	it("should give the amount deposited by the buyer in the escrow as 100", function() {
		return escrow.deployed().then(function(instance) {
			instance.initEscrow(accounts[1], accounts[2], 10, 1250001);
		})
		.then(function() {
			instance.depositToEscrow(function(){}, {from: accounts[2], value: web3.utils.toWei('100', 'ether')});
			return instance.totalEscrowBalance.call(accounts[0]);
		})
		.then(function(_totalContractBalance) {
			assert.equal(_totalContractBalance, 100, "incorrect account balance in contract");
		});
	});

	it("should allow the buyer and the seller to approve to the escrow", function() {
		return escrow.deployed().then(function(instance) {
			instance.initEscrow(accounts[1], accounts[2], 10, 1250001);
		})
		.then(function() {
			instance.depositToEscrow(function(){}, {from: accounts[2], value: web3.utils.toWei('100', 'ether')});
			instance.approveEscrow(function(){}, {from: accounts[1]});
			instance.approveEscrow(function(){}, {from: accounts[2]});
			return instance.allEscrows[1];
		})
		.then(function(escrowStatus) {
			assert.equal(escrowStatus, EscrowState.serviceApproved, "escrow approval isn't working");
		})
		.then(function() {
			assert.equal(totalEscrowBalance, 0, "escrow balance should have been equal to 0");
		});
	});

	it("should allow the buyer to cancel the escrow", function() {
		return escrow.deployed().then(function(instance) {
			instance.initEscrow(accounts[1], accounts[2], 10, 1250001);
		})
		.then(function() {
			instance.depositToEscrow(function(){}, {from: accounts[2], value: web3.utils.toWei('100', 'ether')});
			instance.cancelEscrow(function(){}, {from: accounts[1]});
			instance.cancelEscrow(function(){}, {from: accounts[2]});
			return instance.allEscrows[1];
		})
		.then(function(escrowStatus) {
			assert.equal(escrowStatus, EscrowState.escrowCancelled, "escrow cancellation isn't working");
		})
		.then(function() {
			assert.equal(totalEscrowBalance, 0, "escrow balance should have been equal to 0");
		});
	});

	it("should not allow the escrow owner to end the escrow before its approved or cancelled", function() {
		return escrow.deployed().then(function(instance) {
			instance.initEscrow(accounts[1], accounts[2], 10, 1250001);
		})
		.then(function() {
			instance.depositToEscrow(function(){}, {from: accounts[2], value: web3.utils.toWei('100', 'ether')});
			instance.endEscrow(function(){}, {from: accounts[0]});
			return instance.allEscrows[1];
		})
		.then(function(escrowStatus) {
			assert.equal(escrowStatus, EscrowState.escrowComplete, "escrow is working correctly")
		});
	});

	it("should not allow illegal actions", function() {
		return escrow.deployed().then(function(instance) {
			instance.initEscrow(accounts[1], accounts[2], 10, 1250001);
		})
		.then(function() {
			instance.depositToEscrow(function(){}, {from: accounts[2], value: web3.utils.toWei('-100', 'ether')});
		})
		.then(assert.fail)
		.catch((error) => {
			console.log("negative deposits are not allowed");
			assert.equal(error.message,'VM Exception while processing transaction: revert');
		})
		.then(function() {
			instance.killEscrow();
		})
		.then(assert.fail)
		.catch((error) => {
			console.log("killEscrow function call externally isn't allowed");
		});
	});
})