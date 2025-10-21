import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";
import "solidity-coverage";


dotenv.config();


const config: HardhatUserConfig = {
    solidity: {
        version: "0.8.24",
        settings: {
            optimizer: { enabled: true, runs: 200 }
        }
    },
    networks: {
        whitechainTestnet: {
            url: process.env.RPC_WHITECHAIN_TESTNET || "https://rpc-testnet.whitechain.io",
            chainId: 2625,
            accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : []
        }
    }
};


export default config;