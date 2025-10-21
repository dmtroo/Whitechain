import { expect } from "chai";
import { ethers } from "hardhat";


describe("ResourceNFT1155", function () {
    it("forbids public mint/burn (only roles)", async () => {
        const [admin, user] = await ethers.getSigners();
        const C = await ethers.getContractFactory("ResourceNFT1155");
        const c = await C.deploy("uri/{id}.json", admin.address);


        await expect(c.mintBatch(user.address, [0], [1], "0x")).to.be.reverted;
        await expect(c.burnBatch(user.address, [0], [1])).to.be.reverted;
    });

    it("allows mint/burn via roles", async () => {
        const [admin, user] = await ethers.getSigners();
        const C = await ethers.getContractFactory("ResourceNFT1155");
        const c = await C.deploy("uri/{id}.json", admin.address);

        const MINTER = ethers.keccak256(ethers.toUtf8Bytes("MINTER_ROLE"));
        const BURNER = ethers.keccak256(ethers.toUtf8Bytes("BURNER_ROLE"));

        await c.grantRole(MINTER, admin.address);
        await c.grantRole(BURNER, admin.address);

        await c.mintBatch(user.address, [0,1], [2,3], "0x");
        await c.burnBatch(user.address, [1], [1]);
    });

    it("supportsInterface for ERC1155 & AccessControl", async () => {
        const [admin] = await ethers.getSigners();
        const C = await ethers.getContractFactory("ResourceNFT1155");
        const c = await C.deploy("uri/{id}.json", admin.address);

        // ERC165
        expect(await c.supportsInterface("0x01ffc9a7")).to.eq(true);
        // ERC1155
        expect(await c.supportsInterface("0xd9b67a26")).to.eq(true);
        // ERC1155MetadataURI
        expect(await c.supportsInterface("0x0e89341c")).to.eq(true);
        // IAccessControl
        expect(await c.supportsInterface("0x7965db0b")).to.eq(true);
        // Random / unknown
        expect(await c.supportsInterface("0xffffffff")).to.eq(false);
    });

});