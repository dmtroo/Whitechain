import { expect } from "chai";
import { ethers } from "hardhat";


describe("Items721", () => {
    it("only crafting can mint; only market can burn", async () => {
        const [admin, crafting, market, user] = await ethers.getSigners();
        const Sabre = await ethers.getContractFactory("ItemNFT721_Sabre");
        const sabre = await Sabre.deploy(admin.address);


        const MINTER = ethers.keccak256(ethers.toUtf8Bytes("MINTER_ROLE"));
        const BURNER = ethers.keccak256(ethers.toUtf8Bytes("BURNER_ROLE"));


        await sabre.grantRole(MINTER, crafting.address);
        await sabre.grantRole(BURNER, market.address);


        await expect(sabre.connect(user).mintTo(user.address)).to.be.reverted;
        const tx = await sabre.connect(crafting).mintTo(user.address);
        await tx.wait();


        await expect(sabre.connect(user).burn(1)).to.be.reverted;
        await sabre.connect(market).burn(1);
    });

    it("ItemNFT721_Staff: only crafting can mint; only market can burn", async () => {
        const [admin, crafting, market, user] = await ethers.getSigners();
        const StaffF = await ethers.getContractFactory("ItemNFT721_Staff");
        const staff = await StaffF.deploy(admin.address);

        const MINTER = ethers.keccak256(ethers.toUtf8Bytes("MINTER_ROLE"));
        const BURNER = ethers.keccak256(ethers.toUtf8Bytes("BURNER_ROLE"));

        await staff.grantRole(MINTER, crafting.address);
        await staff.grantRole(BURNER, market.address);

        await expect(staff.connect(user).mintTo(user.address)).to.be.reverted;
        await (await staff.connect(crafting).mintTo(user.address)).wait();

        await expect(staff.connect(user).burn(1)).to.be.reverted;
        await staff.connect(market).burn(1);
    });

    it("Sabre supportsInterface (ERC721 & AccessControl)", async () => {
        const [admin] = await ethers.getSigners();
        const Sabre = await ethers.getContractFactory("ItemNFT721_Sabre");
        const sabre = await Sabre.deploy(admin.address);

        expect(await sabre.supportsInterface("0x01ffc9a7")).to.eq(true);
        expect(await sabre.supportsInterface("0x80ac58cd")).to.eq(true);
        expect(await sabre.supportsInterface("0x7965db0b")).to.eq(true);
        expect(await sabre.supportsInterface("0xffffffff")).to.eq(false);
    });

    it("Staff supportsInterface (ERC721 & AccessControl)", async () => {
        const [admin] = await ethers.getSigners();
        const Staff = await ethers.getContractFactory("ItemNFT721_Staff");
        const staff = await Staff.deploy(admin.address);

        expect(await staff.supportsInterface("0x01ffc9a7")).to.eq(true);
        expect(await staff.supportsInterface("0x80ac58cd")).to.eq(true);
        expect(await staff.supportsInterface("0x7965db0b")).to.eq(true);
        expect(await staff.supportsInterface("0xffffffff")).to.eq(false);
    });

});