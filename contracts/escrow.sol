pragma solidity 0.4.21;
pragma experimental ABIEncoderV2;

import "../math/SafeMath.sol";


contract Escrow {
    mapping (address => uint256) private balances;

    address public seller;
    address public buyer;
    address public escrowOwner;
    uint256 public blockNumber;
    uint public feePercent;
    uint public escrowID;
    uint256 public escrowCharge;

    bool private sellerApproval;
    bool private buyerApproval;

    enum EscrowState { unInitialized, initialized, buyerDeposited, serviceApproved, escrowComplete, escrowCancelled }
    EscrowState public eState = EscrowState.unInitialized;

    struct EscrowRecord {
        address serviceman;
        address client;
        uint256 charge;
        uint256 escrowFeePercent;
        EscrowState escrowStatus;
    }

    mapping (uint => EscrowRecord) public allEscrows;

    event Deposit(address depositor, uint256 deposited);
    event ServicePayment(uint256 blockNo, uint256 contractBalance);

    modifier onlyBuyer() {
        if (msg.sender == buyer) {
            _;
        } else {
            revert();
        }
    }

    modifier onlyEscrowOwner() {
        if (msg.sender == escrowOwner) {
            _;
        } else {
            revert();
        }
    }    

    modifier checkBlockNumber() {
        if (blockNumber > block.number) {
            _;
        } else {
            revert();
        }
    }

    modifier ifApprovedOrCancelled() {
        if ((eState == EscrowState.serviceApproved) || (eState == EscrowState.escrowCancelled)) {
            _;
        } else {
            revert();
        }
    }

    function Escrow() public {
        escrowOwner = msg.sender;
        escrowID = 0;
        escrowCharge = 0;
    }

    function () public { // solhint-disable-line
        // fallback function to disallow any other deposits to the contract
        revert();
    }

    function initEscrow(address _seller, address _buyer, uint _feePercent, uint256 _blockNum) public onlyEscrowOwner {
        require((_seller != msg.sender) && (_buyer != msg.sender));
        escrowID += 1;
        seller = _seller;
        buyer = _buyer;
        feePercent = _feePercent;
        blockNumber = _blockNum;
        eState = EscrowState.initialized;

        balances[seller] = 0;
        balances[buyer] = 0;
    }

    function depositToEscrow() public payable checkBlockNumber onlyBuyer {
        balances[buyer] = SafeMath.add(balances[buyer], msg.value);
        escrowCharge += msg.value;
        eState = EscrowState.buyerDeposited;
        emit Deposit(msg.sender, msg.value); // solhint-disable-line
    }

    function approveEscrow() public {
        if (msg.sender == seller) {
            sellerApproval = true;
        } else if (msg.sender == buyer) {
            buyerApproval = true;
        }
        if (sellerApproval && buyerApproval) {
            eState = EscrowState.serviceApproved;
            fee();
            payOutFromEscrow();
            emit ServicePayment(block.number, address(this).balance); // solhint-disable-line

            allEscrows[escrowID] = EscrowRecord({serviceman: seller, client: buyer, charge: escrowCharge, escrowFeePercent: feePercent, escrowStatus: EscrowState.serviceApproved}); // solhint-disable-line
        }
    }

    function cancelEscrow() public checkBlockNumber {
        if (msg.sender == seller) {
            sellerApproval = false;
        } else if (msg.sender == buyer) {
            buyerApproval = false;
        }
        if (!sellerApproval && !buyerApproval) {
            eState = EscrowState.escrowCancelled;
            refund();
        }
    }

    function endEscrow() public ifApprovedOrCancelled onlyEscrowOwner {
        killEscrow();
    }

    function checkEscrowStatus() public view returns (EscrowState) {
        return eState;
    }
    
    function totalEscrowBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function hasEscrowExpired() public view returns (bool) {
        if (blockNumber > block.number) {
            return false;
        } else {
            return true;
        }
    }
    
    function getBlockNumber() public view returns (uint256) {
        return block.number;
    }

    function getEscrowRecord(uint id) public view returns (EscrowRecord) {
        return allEscrows[id];
    }

    function killEscrow() internal {
        selfdestruct(escrowOwner);
    }

    function payOutFromEscrow() private {
        balances[buyer] = SafeMath.sub(balances[buyer], address(this).balance);
        balances[seller] = SafeMath.add(balances[seller], address(this).balance);
        eState = EscrowState.escrowComplete;
        seller.transfer(address(this).balance);
    }

    function fee() private {
        uint totalFee = address(this).balance * (feePercent / 100);
        escrowOwner.transfer(totalFee);
    }

    function refund() private {
        selfdestruct(buyer);
    }
}
