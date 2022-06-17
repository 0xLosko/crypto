pragma solidity ^0.8.7;
contract Owner{

    address  owner;

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner{
        require(msg.sender == owner , "you are not the owner");
        _;
    }

}