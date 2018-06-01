"use strict"

const Web3 = require('web3')
const express = require('express')
const http = require('http');
const fs = require('fs');
const coder = require('web3/lib/solidity/coder');  
const CryptoJS = require('crypto-js');

const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.json());
app.use(express.urlencoded());

const abiArray = [
  {
    "constant": true,
    "inputs": [],
    "name": "seller",
    "outputs": [
      {
        "name": "",
        "type": "address"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "buyerApproval",
    "outputs": [
      {
        "name": "",
        "type": "bool"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "sellerApproval",
    "outputs": [
      {
        "name": "",
        "type": "bool"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "allEscrows",
    "outputs": [
      {
        "name": "serviceman",
        "type": "address"
      },
      {
        "name": "client",
        "type": "address"
      },
      {
        "name": "charge",
        "type": "uint256"
      },
      {
        "name": "escrowFeePercent",
        "type": "uint256"
      },
      {
        "name": "escrowStatus",
        "type": "uint8"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_seller",
        "type": "address"
      },
      {
        "name": "_buyer",
        "type": "address"
      },
      {
        "name": "_feePercent",
        "type": "uint256"
      },
      {
        "name": "_blockNum",
        "type": "uint256"
      }
    ],
    "name": "initEscrow",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [],
    "name": "depositToEscrow",
    "outputs": [],
    "payable": true,
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "getBlockNumber",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "getEscrowContractAddress",
    "outputs": [
      {
        "name": "",
        "type": "address"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "sellerAmount",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "blockNumber",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "id",
        "type": "uint256"
      }
    ],
    "name": "getEscrowRecord",
    "outputs": [
      {
        "components": [
          {
            "name": "serviceman",
            "type": "address"
          },
          {
            "name": "client",
            "type": "address"
          },
          {
            "name": "charge",
            "type": "uint256"
          },
          {
            "name": "escrowFeePercent",
            "type": "uint256"
          },
          {
            "name": "escrowStatus",
            "type": "uint8"
          }
        ],
        "name": "",
        "type": "tuple"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "escrowCharge",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "feeAmount",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "eState",
    "outputs": [
      {
        "name": "",
        "type": "uint8"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "buyer",
    "outputs": [
      {
        "name": "",
        "type": "address"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "feePercent",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [],
    "name": "endEscrow",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "deposits",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "escrowID",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "hasBuyerApproved",
    "outputs": [
      {
        "name": "",
        "type": "bool"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "getAllDeposits",
    "outputs": [
      {
        "name": "",
        "type": "uint256[]"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [],
    "name": "cancelEscrow",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [],
    "name": "approveEscrow",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "escrowOwner",
    "outputs": [
      {
        "name": "",
        "type": "address"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "hasEscrowExpired",
    "outputs": [
      {
        "name": "",
        "type": "bool"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "hasSellerApproved",
    "outputs": [
      {
        "name": "",
        "type": "bool"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "checkEscrowStatus",
    "outputs": [
      {
        "name": "",
        "type": "uint8"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "totalEscrowBalance",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "fallback"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "name": "depositor",
        "type": "address"
      },
      {
        "indexed": false,
        "name": "deposited",
        "type": "uint256"
      }
    ],
    "name": "Deposit",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "name": "blockNo",
        "type": "uint256"
      },
      {
        "indexed": false,
        "name": "contractBalance",
        "type": "uint256"
      }
    ],
    "name": "ServicePayment",
    "type": "event"
  }
];

const web3 = new Web3(web3.currentProvider);
const escrowContract =  web3.eth.contract(abiArray).at('0x1ebedfba89d3a809da22721cade6b0261966accd');

app.post('/init', function(req, res) {
	var sellerAddress = req.body.selleraddress;
	var buyerAddress = req.body.buyeraddress;
	var ownerFee = req.body.ownerfee;
	var returnDate = req.body.returndate;

	escrowContract.initEscrow(sellerAddress, buyerAddress, ownerFee, returnDate, (error, result) => (res.send(result)));
});

app.post('/deposit', function(req, res) {
	var amount = req.body.depositamount;

	escrowContract.depositToEscrow.sendTransaction({value: amount}, (error, result) => (res.send(result)));
});

app.post('/buyer_approve', function(req, res) {
	escrowContract.approveEscrow((error,result) => (res.send(result)));
});

app.post('/seller_approve', function(req, res) {
	escrowContract.approveEscrow((error,result) => (res.send(result)));
});

app.post('/seller_approve', function(req, res) {
	escrowContract.endEscrow((error,result) => (res.send(result)));
});

app.get('/getEscrowBalance', function(req, res) {
	escrowContract.totalEscrowBalance(function(error, result) {
		res.send(result);
	});
});

app.get('/getEscrowStatus', function(req, res) {
	escrowContract.checkEscrowStatus(function(error, result) {
		res.send(result);
	});	
});

app.get('/', function (req, res) {
  res.send('Escrow dapp API');
});

var server = http.createServer(app);

server.listen(3000, function () {
  console.log('Escrow dapp listening on port 3000')
});