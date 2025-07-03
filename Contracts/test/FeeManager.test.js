const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("FeeManager", function () {
  let FeeManager, feeManager, owner, feeCollector, user;

  beforeEach(async function () {
    [owner, feeCollector, user] = await ethers.getSigners();
    FeeManager = await ethers.getContractFactory("FeeManager");
    feeManager = await FeeManager.connect(owner).deploy(feeCollector.address);
    await feeManager.waitForDeployment();
  });

  it("sets fee collector and owner", async function () {
    expect(await feeManager.feeCollector()).to.equal(feeCollector.address);
    expect(await feeManager.owner()).to.equal(owner.address);
  });

  it("collects fee and sends to collector", async function () {
    const fee = ethers.parseEther("1");
    await expect(
      feeManager.connect(user).collectFee({ value: fee })
    ).to.emit(feeManager, "FeeCollected").withArgs(user.address, fee);
  });

  it("prevents setting collector to zero address", async function () {
    await expect(
      feeManager.connect(owner).setFeeCollector(ethers.ZeroAddress)
    ).to.be.revertedWith("Invalid collector");
  });

  it("only owner can set fee collector", async function () {
    await expect(
      feeManager.connect(user).setFeeCollector(user.address)
    ).to.be.revertedWith("Not owner");
  });
});
