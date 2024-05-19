// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

contract OneKYC{

    enum Entity { None, Bank, Customer }
    enum Status { Pending, Approved, Rejected }

    struct Bank{
        address id;
        string bankName;
    }
    
    struct Customer {
        Status status;
        KYC details;
        
    }

    struct Access {
        address user;
        address bank;
    }

    struct KYC{
        string name;
        string phoneNum;
        string aadhaarNum;
        string location;
        string photoUrl;
        string docUrl;
    }

    mapping(address => Entity) userType;

    //--Customer
    mapping(address => Customer) customerData;
    mapping (address => mapping(address=>bool)) accessList;

    //--Bank
    address[] banks;
    mapping(address => Bank) bankData;
    mapping(address => address[]) bankApplications;
    mapping(address => Access[]) bankAccessRequests;
    mapping(address => mapping(address => bool)) bankApplicationExists;
    

    //--Modifiers
    
    modifier onlyBank() {
        require(userType[msg.sender] == Entity.Bank, "Only banks can call this function");
        _;
    }

    modifier onlyCustomer() {
        require(userType[msg.sender] == Entity.Customer, "Only customers can call this function");
        _;
    }
    
    modifier oldUser(){
        require(userType[msg.sender] != Entity(0), "User not registered.");
        _;
    }

    modifier ifExists(address _bank, address _user){
        require(
            bankApplicationExists[_bank][_user],
            "KYC Application does not exist."
        );
        _;
    }

    modifier ifNotExists(address _bank, address _user){
        require(
            !bankApplicationExists[_bank][_user],
            "KYC Application already exist."
        );
        _;
    }

    // --Main Functions--

    function applyForKYC(address _bank, string[] memory input) external ifNotExists(_bank, msg.sender) {
        address _user = msg.sender;
        userType[_user] = Entity.Customer;
        Customer memory newCustomer;
        newCustomer.status = Status.Pending;
        newCustomer.details = initKYCFromStrings(input);
        customerData[_user] = newCustomer;
        bankApplications[_bank].push(_user);
        accessList[_user][_bank] = true;
        bankApplicationExists[_bank][_user] = true;
    }

    function registerBank(string memory bankName) external {
        require(bytes(bankName).length > 0, "Bank name must not be empty");
        require(userType[msg.sender] == Entity(0), "User already exists.");
        address _user = msg.sender;
        userType[_user] = Entity.Bank;
        Bank memory newBank = Bank(_user, bankName);
        banks.push(_user);
        bankData[_user] = newBank;
    }
    
    function getEntity() external view oldUser returns (string memory) {
        if (userType[msg.sender] == Entity.Bank) 
            return "Bank";
        else 
            return "Customer";
    }

    function checkKYCStatus(address _user) external view onlyCustomer returns (string memory) {
        require(_user == msg.sender, "You don't have access.");
        Status _status = customerData[_user].status;
        if (_status == Status.Pending) 
            return "Pending";
        else if (_status == Status.Approved) 
            return "Approved";
        else 
            return "Rejected";
    }

    function viewKYC(address _user) external view returns (Customer memory) {
        require(
            msg.sender == _user ||
            accessList[_user][msg.sender],
            "You don't have access"
        );
        // if (!checkInternalStatus(_user)) 
        //     revert("Application Not Approved Yet.");
        return customerData[_user];
    }

    function requestAccess(address _user, address _bank, address _newBank) external {
        require(
            msg.sender == _user &&
            accessList[_user][_bank] &&
            userType[_newBank] == Entity.Bank,
            "You don't have access"
        );
        bankAccessRequests[_bank].push(Access({
            user: _user,
            bank: _newBank
        }));
    }
    
    function viewKYCApplications() external view onlyBank returns (address[] memory){
        return bankApplications[msg.sender];
    }

    function viewShareRequests() external view onlyBank returns (Access[] memory){
        return bankAccessRequests[msg.sender];
    }

    function approveKYC(address _user) external onlyBank ifExists(msg.sender, _user) {
        require(
            customerData[_user].status == Status.Pending,
            "KYC Application is not pending."
        );
        customerData[_user].status = Status.Approved;
        bankApplicationExists[msg.sender][_user] = false;
    }

    function rejectKYC(address _user) external onlyBank ifExists(msg.sender, _user) {
        require(
            customerData[_user].status == Status.Pending,
            "KYC Application is not pending."
        );
        customerData[_user].status = Status.Rejected;
        bankApplicationExists[msg.sender][_user] = false;
    }

    function approveShareRequest(address _user) external onlyBank {
        require(
            accessList[_user][msg.sender],
            "You don't have access"
        );

        for (uint i = 0; i < bankAccessRequests[msg.sender].length; i++) {
            if(bankAccessRequests[msg.sender][i].user == _user){
                accessList[_user][bankAccessRequests[msg.sender][i].bank] = true;
                delete bankAccessRequests[msg.sender][i];
                return;
            }
        }
        
        revert("No request found"); 
    }

    function rejectShareRequest(address _user) external onlyBank {
        require(
            accessList[_user][msg.sender],
            "You don't have access"
        );

        for (uint i = 0; i < bankAccessRequests[msg.sender].length; i++) {
            if(bankAccessRequests[msg.sender][i].user == _user){
                delete bankAccessRequests[msg.sender][i];
                return;
            }
        }
        
        revert("No request found"); 
    }

    function viewBanks() external view returns (Bank[] memory) {
        uint n = banks.length;
        Bank[] memory result = new Bank[](n);

        for (uint i = 0; i < n; i++) {
            result[i] = bankData[banks[i]];
        }

        return result;
    }


    //--Helper Functions

    function checkInternalStatus(address _user) internal view returns (bool) {
        Status _status = customerData[_user].status;
        if (_status == Status.Approved) 
            return true;
        else 
            return false;
    }

    function initKYCFromStrings(string[] memory data) internal pure returns (KYC memory) {
        require(data.length == 6, "Invalid data length");
        return KYC({
            name: data[0],
            phoneNum: data[1],
            aadhaarNum: data[2],
            location: data[3],
            photoUrl: data[4],
            docUrl: data[5]
        });
    }

    function test() external pure returns (string memory) {
        return "HELLO - Success";
    }

}