// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract FeeManager is ReentrancyGuard {
    address public owner;
    address public feeCollector;

    event FeeCollected(address indexed from, uint256 amount);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    constructor(address _feeCollector) {
        require(_feeCollector != address(0), "Invalid collector");
        owner = msg.sender;
        feeCollector = _feeCollector;
    }

    function collectFee() external payable nonReentrant {
        require(msg.value > 0, "No fee sent");
        (bool sent, ) = feeCollector.call{value: msg.value}("");
        require(sent, "Fee transfer failed");
        emit FeeCollected(msg.sender, msg.value);
    }

    function setFeeCollector(address newCollector) external onlyOwner {
        require(newCollector != address(0), "Invalid collector");
        feeCollector = newCollector;
    }
}
