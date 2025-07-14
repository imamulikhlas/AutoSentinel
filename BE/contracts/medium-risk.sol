// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Medium {
    address owner;
    uint unusedValue;

    constructor() {
        owner = msg.sender;
    }

    function sensitive() public {
        require(tx.origin == owner, "Not allowed");
        // ...
    }
}
