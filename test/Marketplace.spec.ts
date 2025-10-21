import { expect } from "chai";
import { ethers } from "hardhat";


describe("Marketplace", () => {
    it("buy burns NFT and mints MAGIC to seller", async () => {
        const [admin, seller, buyer] = await ethers.getSigners();


        const Magic = await ethers.getContractFactory("MagicToken");
        const magic = await Magic.deploy(admin.address);


        const Sabre = await ethers.getContractFactory("ItemNFT721_Sabre");
        const sabre = await Sabre.deploy(admin.address);


        const Market = await ethers.getContractFactory("Marketplace");
        const market = await Market.deploy(admin.address, await magic.getAddress());


        const MINTER = ethers.keccak256(ethers.toUtf8Bytes("MINTER_ROLE"));
        const BURNER = ethers.keccak256(ethers.toUtf8Bytes("BURNER_ROLE"));


        await magic.grantRole(MINTER, await market.getAddress());
        await sabre.grantRole(BURNER, await market.getAddress());

        await sabre.grantRole(MINTER, seller.address);
        await sabre.connect(seller).mintTo(seller.address);


        await market.connect(seller).list(await sabre.getAddress(), 1, 100n);
        await market.connect(buyer).buy(0);


        expect(await magic.balanceOf(seller.address)).eq(100n);
    });

    it("reverts on price=0; cannot buy twice (inactive listing)", async () => {
        const [admin, seller, buyer] = await ethers.getSigners();

        const Magic = await ethers.getContractFactory("MagicToken");
        const magic = await Magic.deploy(admin.address);

        const Sabre = await ethers.getContractFactory("ItemNFT721_Sabre");
        const sabre = await Sabre.deploy(admin.address);

        const Market = await ethers.getContractFactory("Marketplace");
        const market = await Market.deploy(admin.address, await magic.getAddress());

        const MINTER = ethers.keccak256(ethers.toUtf8Bytes("MINTER_ROLE"));
        const BURNER = ethers.keccak256(ethers.toUtf8Bytes("BURNER_ROLE"));

        await magic.grantRole(MINTER, await market.getAddress());
        await sabre.grantRole(BURNER, await market.getAddress());

        await sabre.grantRole(MINTER, seller.address);
        await sabre.connect(seller).mintTo(seller.address);

        await expect(market.connect(seller).list(await sabre.getAddress(), 1, 0)).to.be.revertedWith("price=0");

        await market.connect(seller).list(await sabre.getAddress(), 1, 100n);

        await market.connect(buyer).buy(0);

        await expect(market.connect(buyer).buy(0)).to.be.revertedWith("inactive");
    });

    it("reverts list() if caller is not owner", async () => {
        const [admin, seller, attacker] = await ethers.getSigners();

        const Magic = await ethers.getContractFactory("MagicToken");
        const magic = await Magic.deploy(admin.address);

        const Sabre = await ethers.getContractFactory("ItemNFT721_Sabre");
        const sabre = await Sabre.deploy(admin.address);

        const Market = await ethers.getContractFactory("Marketplace");
        const market = await Market.deploy(admin.address, await magic.getAddress());

        const MINTER = ethers.keccak256(ethers.toUtf8Bytes("MINTER_ROLE"));
        await sabre.grantRole(MINTER, seller.address);

        await sabre.connect(seller).mintTo(seller.address);

        await expect(
            market.connect(attacker).list(await sabre.getAddress(), 1, 123n)
        ).to.be.revertedWith("not owner");
    });


});