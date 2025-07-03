const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('HPXAccessControl', function () {
  let HPXAccessControl, accessControl, admin, user;

  beforeEach(async function () {
    [admin, user] = await ethers.getSigners();
    HPXAccessControl = await ethers.getContractFactory('HPXAccessControl');
    accessControl = await HPXAccessControl.deploy(admin.address);
    await accessControl.waitForDeployment();
  });

  it('sets admin as DEFAULT_ADMIN_ROLE and ADMIN_ROLE', async function () {
    expect(
      await accessControl.hasRole(
        await accessControl.DEFAULT_ADMIN_ROLE(),
        admin.address
      )
    ).to.be.true;
    expect(
      await accessControl.hasRole(
        await accessControl.ADMIN_ROLE(),
        admin.address
      )
    ).to.be.true;
  });

  it('allows admin to grant and revoke MINTER_ROLE', async function () {
    await (await accessControl.connect(admin).grantMinter(user.address)).wait();
    expect(
      await accessControl.hasRole(
        await accessControl.MINTER_ROLE(),
        user.address
      )
    ).to.be.true;
    await (
      await accessControl.connect(admin).revokeMinter(user.address)
    ).wait();
    expect(
      await accessControl.hasRole(
        await accessControl.MINTER_ROLE(),
        user.address
      )
    ).to.be.false;
  });

  it('prevents non-admin from granting roles', async function () {
    const expectedRevert = `AccessControl: account ${user.address.toLowerCase()} is missing role ${await accessControl.ADMIN_ROLE()}`;
    await expect(
      accessControl
        .connect(user)
        .grantMinter(user.address)
        .to.be.revertedWith(expectedRevert)
    );
  });
});
