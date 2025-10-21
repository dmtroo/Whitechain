import { ethers } from "hardhat";


async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deployer:", deployer.address);


    const resourceAddr = process.env.RESOURCE_ADDR!;
    const magicAddr = process.env.MAGIC_ADDR!;
    const sabreAddr = process.env.SABRE_ADDR!;
    const staffAddr = process.env.STAFF_ADDR!;


    const Resource = await ethers.getContractAt("ResourceNFT1155", resourceAddr);
    const Magic = await ethers.getContractAt("MagicToken", magicAddr);
    const Sabre = await ethers.getContractAt("ItemNFT721_Sabre", sabreAddr);
    const Staff = await ethers.getContractAt("ItemNFT721_Staff", staffAddr);


    const Crafting = await ethers.getContractFactory("CraftingSearch");
    const crafting = await Crafting.deploy(deployer.address, resourceAddr, sabreAddr, staffAddr);
    await crafting.waitForDeployment();


    const Market = await ethers.getContractFactory("Marketplace");
    const market = await Market.deploy(deployer.address, magicAddr);
    await market.waitForDeployment();

    const MINTER_ROLE = ethers.keccak256(ethers.toUtf8Bytes("MINTER_ROLE"));
    const BURNER_ROLE = ethers.keccak256(ethers.toUtf8Bytes("BURNER_ROLE"));


    await (await Resource.grantRole(MINTER_ROLE, await crafting.getAddress())).wait();
    await (await Resource.grantRole(BURNER_ROLE, await crafting.getAddress())).wait();


    await (await Sabre.grantRole(MINTER_ROLE, await crafting.getAddress())).wait();
    await (await Sabre.grantRole(BURNER_ROLE, await market.getAddress())).wait();


    await (await Staff.grantRole(MINTER_ROLE, await crafting.getAddress())).wait();
    await (await Staff.grantRole(BURNER_ROLE, await market.getAddress())).wait();
    main().catch((e) => {
        console.error(e);
        process.exit(1);
    });
}