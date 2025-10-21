import { expect } from "chai";
import { ethers } from "hardhat";


describe("CraftingSearch", () => {
    it("search cooldown + craft flows", async () => {
        const [admin, user] = await ethers.getSigners();


        const Res = await ethers.getContractFactory("ResourceNFT1155");
        const res = await Res.deploy("uri/{id}.json", admin.address);


        const Sabre = await ethers.getContractFactory("ItemNFT721_Sabre");
        const sabre = await Sabre.deploy(admin.address);


        const Staff = await ethers.getContractFactory("ItemNFT721_Staff");
        const staff = await Staff.deploy(admin.address);


        const C = await ethers.getContractFactory("CraftingSearch");
        const c = await C.deploy(admin.address, await res.getAddress(), await sabre.getAddress(), await staff.getAddress());


        const MINTER = ethers.keccak256(ethers.toUtf8Bytes("MINTER_ROLE"));
        const BURNER = ethers.keccak256(ethers.toUtf8Bytes("BURNER_ROLE"));


        await res.grantRole(MINTER, await c.getAddress());
        await res.grantRole(BURNER, await c.getAddress());
        await sabre.grantRole(MINTER, await c.getAddress());


        await c.connect(user).search();
        await expect(c.connect(user).search()).to.be.revertedWith("Cooldown");
    });

    it("craftSabre / craftStaff: reverts without resources, succeeds with enough resources", async () => {
        const [admin, user] = await ethers.getSigners();

        const Res = await ethers.getContractFactory("ResourceNFT1155");
        const res = await Res.deploy("uri/{id}.json", admin.address);

        const Sabre = await ethers.getContractFactory("ItemNFT721_Sabre");
        const sabre = await Sabre.deploy(admin.address);

        const Staff = await ethers.getContractFactory("ItemNFT721_Staff");
        const staff = await Staff.deploy(admin.address);

        const C = await ethers.getContractFactory("CraftingSearch");
        const c = await C.deploy(
            admin.address,
            await res.getAddress(),
            await sabre.getAddress(),
            await staff.getAddress()
        );

        const MINTER = ethers.keccak256(ethers.toUtf8Bytes("MINTER_ROLE"));
        const BURNER = ethers.keccak256(ethers.toUtf8Bytes("BURNER_ROLE"));

        // Ролі для Crafting
        await res.grantRole(MINTER, await c.getAddress());
        await res.grantRole(BURNER, await c.getAddress());
        await sabre.grantRole(MINTER, await c.getAddress());
        await staff.grantRole(MINTER, await c.getAddress());

        await expect(c.connect(user).craftSabre()).to.be.reverted;
        await expect(c.connect(user).craftStaff()).to.be.reverted;

        await res.grantRole(MINTER, admin.address);

        await res.mintBatch(
            user.address,
            [1, 0, 3],
            [3, 1, 1],
            "0x"
        );

        await c.connect(user).craftSabre();
        expect(await sabre.ownerOf(1)).eq(user.address);

        await res.mintBatch(
            user.address,
            [0, 2, 5],
            [2, 1, 1],
            "0x"
        );

        await c.connect(user).craftStaff();
        expect(await staff.ownerOf(1)).eq(user.address);
    });

});