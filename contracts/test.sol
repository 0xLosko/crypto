pragma solidity ^0.8.7;

import "hardhat/console.sol";
import "./owner.sol";

contract test is Owner {

    struct order{
        uint timestamps;
        uint id;
    }

    struct customer{
        uint totalBalance;
        bool status;
        uint nbOrder;
        mapping (uint => order) orders;
    }

    mapping(address => customer) customers;
    mapping(address => order[]) myOrders;

    function addCustomer(address _customer) public onlyOwner {
        bool status = bool (customers[_customer].status);
        require(status == false , "Account already Create" );
        customers[_customer].status = true;
    }

    function getBalance(address _customer) external view onlyOwner returns(uint){
        return customers[_customer].totalBalance;
    }


    receive() external payable{
        customers[msg.sender].totalBalance += msg.value;
    }

    function addOrder(uint _price) external {
        bool status = bool (customers[msg.sender].status);
        require(status == true , "Create account" );
        uint balanceCustomer = customers[msg.sender].totalBalance;
        balanceCustomer = balanceCustomer / (10**18);
        require(_price <= balanceCustomer ,"You don't have enough money");
        customers[msg.sender].totalBalance -= _price*10**18;
        uint time = block.timestamp;
        customers[msg.sender].nbOrder++;
        customers[msg.sender].orders[customers[msg.sender].nbOrder].timestamps = time;
        customers[msg.sender].orders[customers[msg.sender].nbOrder].id++;
        myOrders[msg.sender].push(order(time, myOrders[msg.sender].length));
    }

    function getOrders() public view returns(order[] memory) {
        return myOrders[msg.sender];
    }

}