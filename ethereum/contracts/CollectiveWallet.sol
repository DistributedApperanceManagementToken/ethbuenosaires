pragma solidity ^0.4.24;

contract CollectWalletFactory {
    address[] public deployedCollectiveWallet;

    function createCollectiveWallet(uint minimum, string name) public {
        address newCollectiveWallet = new CollectiveWallet(minimum, name);
        deployedCollectiveWallet.push(newCollectiveWallet);
    }

    function getDeployedCollectiveWallet() public view returns (address[]) {
        return deployedCollectiveWallet;
    }
}

contract CollectiveWallet {
    struct Request {
        string description;
        uint value;
        address recipient;
        bool complete;
        uint approvalCount;
        mapping(address => bool) approvals;
    }

    struct OwnershipRequest {
        address newOwner;
        string description;
        address requester;
        bool complete;
        uint approvalCount;
        mapping(address => bool) approvals;
    }

    Request[] public requests;
    OwnershipRequest[] public ownersRequest;
    uint public minimumContribution;
    string public groupName;
    mapping(address => bool) public owners;
    mapping(address => bool) public requestedOwners;
    address[] public ownerList;

    modifier onlyOwners() {
        require(owners[msg.sender]);
        _;
    }

    constructor (uint minimum, string name) public {
        require(minimum > 0);

        minimumContribution = minimum;
        groupName = name;
        ownerList.push(msg.sender);
        owners[msg.sender] = true;
    }

    function addOwnerRequest(string description, address newOwner) public onlyOwners {
        require(!owners[newOwner]);
        require(!requestedOwners[newOwner]);

        OwnershipRequest memory ownershipRequest = OwnershipRequest({
           description: description,
           newOwner: newOwner,
           requester: msg.sender,
           complete: false,
           approvalCount: 0
        });

        ownersRequest.push(ownershipRequest);
        requestedOwners[newOwner] = true;
    }

    function approveOwnershipRequest(uint index) public onlyOwners {
        OwnershipRequest storage ownerRequest = ownersRequest[index];

        require(!ownerRequest.approvals[msg.sender]);
        require(!ownerRequest.complete);

        ownerRequest.approvals[msg.sender] = true;
        ownerRequest.approvalCount++;

        if (ownerRequest.approvalCount > (ownerList.length / 2)){
            ownerRequest.complete = true;
            owners[ownerRequest.newOwner] = true;
            ownerList.push(ownerRequest.newOwner);
        }
    }

    function getOwnerList() public view returns (address[]) {
        return ownerList;
    }


    function contribute() public payable {
        require(msg.value > minimumContribution);
    }

    function createRequest(string description, uint value, address recipient) public onlyOwners {
        Request memory newRequest = Request({
           description: description,
           value: value,
           recipient: recipient,
           complete: false,
           approvalCount: 0
        });

        requests.push(newRequest);
    }

    function approveRequest(uint index) public {
        Request storage request = requests[index];

        require(owners[msg.sender]);
        require(!request.approvals[msg.sender]);

        request.approvals[msg.sender] = true;
        request.approvalCount++;
    }

    function finalizeRequest(uint index) public onlyOwners {
        Request storage request = requests[index];

        require(request.approvalCount > (ownerList.length / 2));
        require(!request.complete);

        request.recipient.transfer(request.value);
        request.complete = true;
    }

    function getRequestsCount() public view returns (uint) {
        return requests.length;
    }
}
