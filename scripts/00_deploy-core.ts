import { ethers } from "hardhat";


async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deployer:", deployer.address);


    const Resource = await ethers.getContractFactory("ResourceNFT1155");
    const resource = await Resource.deploy("https://example.com/{id}.json", deployer.address);
    await resource.waitForDeployment();


    const Magic = await ethers.getContractFactory("MagicToken");
    const magic = await Magic.deploy(deployer.address);
    await magic.waitForDeployment();


    const Sabre = await ethers.getContractFactory("ItemNFT721_Sabre");
    const sabre = await Sabre.deploy(deployer.address);
    await sabre.waitForDeployment();


    const Staff = await ethers.getContractFactory("ItemNFT721_Staff");
    const staff = await Staff.deploy(deployer.address);
    await staff.waitForDeployment();


    console.log("Resource:", await resource.getAddress());
    console.log("Magic:", await magic.getAddress());
    console.log("Sabre:", await sabre.getAddress());
    console.log("Staff:", await staff.getAddress());
}


main().catch((e) => { console.error(e); process.exit(1); });