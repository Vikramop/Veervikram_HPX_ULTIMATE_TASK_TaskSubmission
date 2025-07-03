// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "./HPXAccessControl.sol";

contract HPXToken is ERC20, ReentrancyGuard {
    HPXAccessControl public accessControl;
    address public feeWallet;
    uint256 public constant FEE_BPS = 1000; // 10% fee (1000 basis points)

    event Minted(address indexed user, uint256 amount, uint256 fee);

    modifier onlyMinter() {
        require(accessControl.hasRole(accessControl.MINTER_ROLE(), msg.sender), "Not minter");
        _;
    }

    constructor(
        string memory name_,
        string memory symbol_,
        address accessControl_,
        address feeWallet_
    ) ERC20(name_, symbol_) {
        require(accessControl_ != address(0), "Invalid access control address");
        require(feeWallet_ != address(0), "Invalid fee wallet");
        accessControl = HPXAccessControl(accessControl_);
        feeWallet = feeWallet_;
    }

    function mint(uint256 amount) external payable nonReentrant {
        require(amount > 0, "Amount must be > 0");
        uint256 fee = (amount * FEE_BPS) / 10000;
        uint256 netAmount = amount - fee;
        _mint(msg.sender, netAmount);
        _mint(feeWallet, fee);
        emit Minted(msg.sender, netAmount, fee);
    }

    function privilegedMint(address to, uint256 amount) external onlyMinter nonReentrant {
        require(to != address(0), "Zero address");
        require(amount > 0, "Amount must be > 0");
        _mint(to, amount);
        emit Minted(to, amount, 0);
    }

    function _transfer(address from, address to, uint256 amount) internal override {
        require(to != address(0), "Transfer to zero address");
        require(balanceOf(from) >= amount, "Insufficient balance");
        super._transfer(from, to, amount);
    }

    function getUserBalance(address user) external view returns (uint256) {
        return balanceOf(user);
    }
}
