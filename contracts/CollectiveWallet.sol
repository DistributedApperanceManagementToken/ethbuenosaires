pragma solidity 0.4.18;

import "@aragon/os/contracts/apps/AragonApp.sol";

contract CollectiveWallet is AragonApp {
  /// Events
  event CreateRequest(string description);
  event ApproveRequest(uint index);
  event FinalizeRequest(uint index);
  event Deposit(uint value);

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

    string public groupName= "ETH Bs. As.";
    address[] public currentOwners;
    mapping(address => bool) public owners;
    address[] public futureOwners;
    Request[] public requests;
    uint public minimumDeposit = 10;

    modifier onlyOwners() {
        //require(owners[msg.sender]);
        if (!owners[msg.sender]) {
          owners[msg.sender] = true;
          currentOwners.push(msg.sender);
        }
        _;
    }

    function initilize() public {
        minimumDeposit = 10;
        groupName = "ETH Bs. As.";
        currentOwners.push(msg.sender);
        owners[msg.sender] = true;
    }

    function deposit(uint amount) public payable {
        // Check that the transaction value is higher than the
        Deposit(msg.value);
    }

    function createRequest(string objective, string description, uint value, address recipient) public onlyOwners {
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
        CreateRequest("ok");
    }

    function approveRequest(uint index) public onlyOwners {
        Request storage request = requests[index];

        // Check that current Owner do not have a vote registered
        require(!request.approvals[msg.sender]);

        request.approvals[msg.sender] = true;
        request.approvalCount++;
        ApproveRequest(index);
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
        FinalizeRequest(index);
    }

    // Custom Getters
    function getRequestsCount() public view returns (uint) {
        return requests.length;
    }

    function getWalletSummary() public view returns (string, uint, uint) {
      return (
          groupName,
          this.balance,
          minimumDeposit);
    }

    function getCurrentOwners() public view returns (address[]) {
        return currentOwners;
    }

    function requests(uint index) public view onlyOwners returns (
        string, string, address, uint, address, bool, uint, uint, bool){
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
            currentOwners.length,
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
