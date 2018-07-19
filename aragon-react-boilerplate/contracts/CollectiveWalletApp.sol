pragma solidity 0.4.18;

import "@aragon/os/contracts/apps/AragonApp.sol";

contract CollectiveWalletApp is AragonApp {
    struct Request {
        string objective;
        string description;
        address requester;
        uint value;
        address recipient;
        bool complete;
        uint approvalCount;
        mapping(address => bool) approvals;
    }

    bytes32 constant public INCREMENT_ROLE = keccak256("INCREMENT_ROLE");
    event CreateRequest(address indexed entity, string objective, string description, uint value, address recipient);
    event GetCurrentOwners(address indexed entity);

    string public groupName;
    address[] public currentOwners;
    mapping(address => bool) public owners;
    address[] public futureOwners;
    Request[] public requests;
    uint public minimumDeposit;

    modifier onlyOwners() {
//        require(owners[msg.sender]);
        _;
    }

    function initialize() public onlyInit {
        minimumDeposit = 100;
        groupName = "Eth Bs. As. collective wallet";
        currentOwners.push(msg.sender);
        owners[msg.sender] = true;
    }


    function deposit() public payable onlyOwners {
        // Check that the transaction value is higher than the
        require(msg.value > 0);
    }

    function createRequest(string objective, string description, uint value, address recipient) public onlyOwners auth(INCREMENT_ROLE) {
        require(compare(objective, "transfer") == 0 || compare(objective, "ownership") == 0);

        Request memory newRequest = Request({
            objective: objective,
            description: description,
            value: value,
            recipient: recipient,
            requester: msg.sender,
            complete: false,
            approvalCount: 0
            });

        requests.push(newRequest);
    }

    function approveRequest(uint index) public onlyOwners {
        Request storage request = requests[index];

        // Check that current Owner do not have a vote registered
        require(!request.approvals[msg.sender]);

        request.approvals[msg.sender] = true;
        request.approvalCount++;
    }

    function finalizeRequest(uint index) public onlyOwners {
        Request storage request = requests[index];

        require(request.approvalCount > (currentOwners.length / 2));
        require(!request.complete);

        if (compare(request.objective, "transfer") == 0) {
            request.recipient.transfer(request.value);
        } else {
            owners[request.recipient] = true;
            currentOwners.push(request.recipient);
        }
        request.complete = true;
    }

    function acceptOwnership(uint index) public payable {
        // Check that is a valid approved owner index
        require(futureOwners.length > index);

        // Check that only the approved address can accept the ownership
        require(futureOwners[index] == msg.sender);

        // Check that the future owner sent the minimum
        require(msg.value >= minimumDeposit);

        address newOwner = futureOwners[index];
        owners[newOwner] = true;
        currentOwners.push(newOwner);
        delete futureOwners[index];
    }

    // Custom Getters
    function getRequestsCount() public onlyOwners view returns (uint) {
        return requests.length;
    }

    function getCurrentOwners() public view returns (address[]) {
        return currentOwners;
    }

    function getFutureOwners() public view returns (address[]) {
        return futureOwners;
    }

    function getRequest(uint index) public view returns (
        string, string, address, uint, address, bool, uint, bool){
        // Check that is a valid aproved owner index
        require(requests.length > index);

        Request storage request = requests[index];

        return (
            request.objective,
            request.description,
            request.requester,
            request.value,
            request.recipient,
            request.complete,
            request.approvalCount,
            request.approvals[msg.sender]);
    }


    // Utility functions
    function compare(string _a, string _b) internal pure returns (int) {
        bytes memory a = bytes(_a);
        bytes memory b = bytes(_b);
        uint minLength = a.length;

        if (b.length < minLength) minLength = b.length;

        for (uint i = 0; i < minLength; i ++)
            if (a[i] < b[i])
                return -1;
            else if (a[i] > b[i])
                return 1;
        if (a.length < b.length)
            return -1;
        else if (a.length > b.length)
            return 1;
        else
            return 0;
    }
}