const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("HPXToken", function () {
  let HPXAccessControl, HPXToken, accessControl, token, admin, user, feeWallet;

  beforeEach(async function () {
    [admin, user, feeWallet] = await ethers.getSigners();
    HPXAccessControl = await ethers.getContractFactory("HPXAccessControl");
    accessControl = await HPXAccessControl.deploy(admin.address);
    await accessControl.waitForDeployment();

    HPXToken = await ethers.getContractFactory("HPXToken");
    token = await HPXToken.deploy("HPX", "HPX", accessControl.target, feeWallet.address);
    await token.waitForDeployment();
  });

  it("mints tokens with 10% fee", async function () {
    const amount = ethers.parseEther("100");
    const tx = await token.connect(user).mint(amount);
    await tx.wait();

    expect(await token.balanceOf(user.address)).to.equal(ethers.parseEther("90"));
    expect(await token.balanceOf(feeWallet.address)).to.equal(ethers.parseEther("10"));
  });

  it("allows privileged minting without fee", async function () {
    await (await accessControl.connect(admin).grantMinter(admin.address)).wait();
    const amount = ethers.parseEther("50");
    await (await token.connect(admin).privilegedMint(user.address, amount)).wait();

    expect(await token.balanceOf(user.address)).to.equal(amount);
  });

  it("prevents non-minter from privileged mint", async function () {
    await expect(
      token.connect(user).privilegedMint(user.address, 10)
    ).to.be.revertedWith("Not minter");
  });

  it("returns correct user balance", async function () {
    const amount = ethers.parseEther("20");
    await (await token.connect(user).mint(amount)).wait();
    expect(await token.getUserBalance(user.address)).to.equal(ethers.parseEther("18"));
  });

  it("prevents transfer to zero address", async function () {
    const amount = ethers.parseEther("10");
    await (await token.connect(user).mint(amount)).wait();
    await expect(
      token.connect(user).transfer(ethers.ZeroAddress, 1)
    ).to.be.revertedWith("Transfer to zero address");
  });
});
