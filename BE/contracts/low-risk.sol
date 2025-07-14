// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SimpleStorage {
    uint public data;

    function store(uint x) public {
        data = x;
    }

    function retrieve() public view returns (uint) {
        return data;
    }
}
