Escrow ÐApp - A sample Ethereum ÐApp over Node.js to get started for beginners

## Introduction

Escrow technically means a bond of trust between two parties making a service deal with each other by involving a mediator in-between. Traditionally, escrows are conducted by the involvement of a third-party which is responsible of making sure neither of the parties involved in the service deal is defaulting. The service-demander (or buyer) deposits a negotiated amount of money in the escrow and demands the service to be done in a given time. The serviceman (or seller) is notified of the deal and and the time period in which the service needs to be complete. Thus, the serviceman is responsible for completing the service within the negotiated time for the negotiated charge at an acceptable quality. During the entire service period, it is the responsibility of the third-party to ensure the security of the money. Once the service is completely done by the serviceman, the serviceman lets the escrow know of the status of the deal. Next, it is the responsibility of the service-demander to approve / disapprove the service done by the serviceman before the contract period ends. If the service done is approved by the service-demander, the escrow will pay out the deposited money to the serviceman keeping a pre-decided percentage of the money as an escrow fee charge. If the service done is disapproved by the service-demander, the escrow will hold the money unless a decision is taken by either of the party (the serviceman improves the quality of service / both the parties decide not to go forward with the deal). Otherwise, at a time when an ongoing escrow has not ended, there might be a case that the serviceman doesn’t want to go further with the contract; then the serviceman requests a cancellation of the escrow. This awaits cancellation confirmation from the service-demander upon whose positive response the escrow contract is cancelled and the money deposited in the escrow is returned back to the service-demander keeping the pre-decided percentage of the money as the escrow fee charge. If the serviceman is unable to complete the service in the given time period, the deposited money is transferred back to the service-demander with the escrow fee being charged.

## Issues

* Either / both of the parties might not be honest in making the deal - and this might result in locking up of one’s money in the escrow until the issue is resolved by involvement of legal authorities.

* The third-party entrusted for the escrow might not be honest - and this might result in cases of contract manipulations, collusions, theft, unwanted troubles. Third-party involvements are always security-holes.

* In case the escrow is a physical one, there might be general problems faced by a non-electronic system. There might also be the case of currency disagreements.

## Decentralised Escrow

Decentralised escrow would refer to an escrow whose operations aren’t controlled by anyone, rather being transparent enough to be visible to everyone (or as intended). Ethereum is such a decentralised network (blockchain) which allows transactions to be carried out between any two transacting parties without the need of a centralised go-through intermediary (or so-called banks). Not only that, unlike Bitcoin blockchain, Ethereum network allows execution of code powered by gas. There comes the concept of smart contracts which are task-specific codes written to guarantee the particular task to be carried out in a decentralised way without the intervention of an intermediary.

So, escrows fall into this fitting use-case of decentralised network to perform transaction. The core idea is to have the smart contract to take care of the security deposit and prevent the transacting parties to default. Escrow over Ethereum makes sure the service-demander’s money isn’t fiddled with, the serviceman gets the service charge he demands, and the service-demander gets the service he demands.

### Core Functionality

1. There’s a escrowOwner who is the one who creates the contract. There’s a variable eState tracking the current status of the escrow which will be set to **unInitialized** after this step.

2. The escrowOwner will initialize the contract for the two parties by calling the initEscrow() passing seller address, buyer address, fee percentage and the final block number (which is the final block number denoting the service time). eState is set to **initialized** at this step. It’s ensured that none of the addresses of the buyer or seller is equal to that of the escrowOwner.

3. Once the escrow is initialized, the buyer can make any number of deposits to the contract using depositToEscrow(); and events are also emitted for the same. This must be noted that the money deposited is owned by the contract and the escrowOwner has no control over it. eState will now hold a status of **buyerDeposited**.

4. As transactions take place after this and the latest block number increases (i.e. service time passes).

5. Once the service is complete by the seller (before the latest block number exceeds the given block number limit), the seller approves the escrow (i.e. marks the service by him to be complete).

6. The buyer next reviews the service by the seller and

    1. In case the service quality is acceptable,

        1. Approves the escrow.

        2. Since both the seller and buyer have approved the escrow, eState now changes to **serviceApproved**.

        3. Next, the smart contract automatically initiates payment of fee charges to the escrowOwner - value of which is decided by the pre-decided fee percentage.

        4. Next, the smart contract automatically initiates the payment of the remaining balance amount to the seller address. eState is now changed to **escrowComplete**.

    2. In case the service quality is not acceptable,

        5. The buyer does not approve the service.

        6. After further negotiation, the seller can re-service or decide to cancel the escrow.

        7. If the buyer too cancels the escrow, the entire amount of money deposited into the escrow will be refunded back the buyer with the escrowOwner keeping the pre-decided amount of sum as escrow fee charge. eState is now changed to **escowCancelled**.

7. The escrow is now in steady state and is ready to conduct another escrow.

8. Otherwise, the escrow can be ended only by escrowOwner so that the contract is destructed.

Escrow Decentralised Application

## Application Flow

![dapp flow](https://i.imgur.com/0DT48Nk.png)

1. Landing page provides with the options of **creating a new Escrow contract** or **loading an Escrow contract** from the given set of already created contracts. Escrow contract creation is managed through a **Factory contract** which is created as a genesis by the application owner. 

2. The user of the dapp may:

    1. Create a new contract using the button. The latest created contract will appear at the end of the list group. The user who creates this contract becomes the owner of this contract.

    2. Load an already created contract. A contract can be loaded by any user, but the owner remains the owner.

3. Once a contract is loaded, the user may:

    3. Initiate the contract. But this can only be done by the owner of the contract. To initialize the contract, the addresses of the seller, buyer, the fee percent charged by the owner and the return date must be specified. Once initiated, the buyer and seller of the escrow are confirmed and cannot be changed.

    4. Deposit the negotiated amount into the escrow. This can only be done by the buyer. The buyer can deposit any number of times into the contract. All the deposit installments will be shown in the deposits section.

    5. Approve the contract. Once a contract is initialized, the contract is ready to be approved by the buyer and the seller. The approval of the contract signifies the consent of the buyer as well as the seller to agree with the terms and conditions of the escrow.

        1. The completion of the contract requires the approval of both the seller and the buyer. Once both of the parties approve, the contract will pay out. The pay out process of the contract involves the charging of the specified percentage of key being transferred to the contract owner, and the remaining part of the deposit to the deserving seller.

        2. The contract won’t pay out unless both of the parties approve.

    6. Cancel the contract. The buyer / seller or both might not want to go forward with the escrow at any point of time, and they might then want to cancel the contract. Cancelling the contract requires the action of both the buyer and the seller. Once the contract is cancelled, the entire deposit will be transferred back to the buyer.

4. An escrow is said to be complete if either the contract has been approved by both and the service by the seller is received by the buyer or if the escrow has been cancelled by both. In this state, the contract is unusable and cannot be interacted with furthur.

## Technology Stack

* Node.js for powering the backend of the application. Node.js helps in delivering the dynamically generated HTML as well as receiving POST requests and making GET requests.

* Web3.js for retrieving all information from Ethereum. All the functions in web3.js are asynchronous functions retrieving data from the contract deployed currently on the Ropsten Testnet.

* MetaMask as an easy interface for interacting with the smart contract using web3.js and making transactions.

