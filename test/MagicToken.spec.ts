import { expect } from "chai";
import { ethers } from "hardhat";


describe("MagicToken", () => {
    it("only market can mint", async () => {
        const [admin, market, user] = await ethers.getSigners();
        const M = await ethers.getContractFactory("MagicToken");
        const m = await M.deploy(admin.address);
        const MINTER = ethers.keccak256(ethers.toUtf8Bytes("MINTER_ROLE"));
        await m.grantRole(MINTER, market.address);
        await expect(m.connect(user).mint(user.address, 100)).to.be.reverted;
        await m.connect(market).mint(user.address, 100);
        expect(await m.balanceOf(user.address)).eq(100n);
    });
});