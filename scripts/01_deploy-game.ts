import { ethers } from "hardhat";

function requireEnv(k: string): string {
    const v = process.env[k];
    if (!v || !v.startsWith("0x") || v.length !== 42) {
        throw new Error(`Missing or invalid ${k} in .env`);
    }
    return v;
}

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deployer:", deployer.address);

    const resourceAddr = requireEnv("RESOURCE_ADDR");
    const magicAddr    = requireEnv("MAGIC_ADDR");
    const sabreAddr    = requireEnv("SABRE_ADDR");
    const staffAddr    = requireEnv("STAFF_ADDR");

    console.log("Using core addresses:");
    console.log("  Resource:", resourceAddr);
    console.log("  Magic   :", magicAddr);
    console.log("  Sabre   :", sabreAddr);
    console.log("  Staff   :", staffAddr);

    const Resource = await ethers.getContractAt("ResourceNFT1155", resourceAddr);
    const Magic    = await ethers.getContractAt("MagicToken",      magicAddr);
    const Sabre    = await ethers.getContractAt("ItemNFT721_Sabre",sabreAddr);
    const Staff    = await ethers.getContractAt("ItemNFT721_Staff",staffAddr);

    console.log("Deploying CraftingSearch...");
    const Crafting = await ethers.getContractFactory("CraftingSearch");
    const crafting = await Crafting.deploy(
        deployer.address,
        resourceAddr,
        sabreAddr,
        staffAddr
    );
    await crafting.waitForDeployment();
    const craftingAddr = await crafting.getAddress();
    console.log("Crafting:", craftingAddr);

    console.log("Deploying Marketplace...");
    const Market = await ethers.getContractFactory("Marketplace");
    const market = await Market.deploy(deployer.address, magicAddr);
    await market.waitForDeployment();
    const marketAddr = await market.getAddress();
    console.log("Marketplace:", marketAddr);

    const MINTER_ROLE = ethers.keccak256(ethers.toUtf8Bytes("MINTER_ROLE"));
    const BURNER_ROLE = ethers.keccak256(ethers.toUtf8Bytes("BURNER_ROLE"));

    console.log("Grant roles on Resource...");
    await (await Resource.grantRole(MINTER_ROLE, craftingAddr)).wait();
    await (await Resource.grantRole(BURNER_ROLE, craftingAddr)).wait();
    console.log("  Resource MINTER & BURNER -> Crafting OK");

    console.log("Grant roles on Items...");
    await (await Sabre.grantRole(MINTER_ROLE, craftingAddr)).wait();
    await (await Sabre.grantRole(BURNER_ROLE, marketAddr)).wait();
    await (await Staff.grantRole(MINTER_ROLE, craftingAddr)).wait();
    await (await Staff.grantRole(BURNER_ROLE, marketAddr)).wait();
    console.log("  Items MINTER -> Crafting, BURNER -> Marketplace OK");

    console.log("Grant MINTER on Magic to Marketplace...");
    await (await Magic.grantRole(MINTER_ROLE, marketAddr)).wait();
    console.log("  Magic MINTER -> Marketplace OK");

    console.log("DONE");
}

main().catch((e) => { console.error(e); process.exit(1); });
