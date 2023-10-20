import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import dotenv from "dotenv";
dotenv.config();

const config: HardhatUserConfig = {
  solidity: "0.8.20",
  networks: {
    scrollSepolia: {
      url: "https://sepolia-rpc.scroll.io" || "",
      accounts:
        process.env.PRIVATE_KEY !== undefined
          ? [<string>process.env.PRIVATE_KEY]
          : [],
    },
  },
  etherscan: {
    apiKey: {
      scrollSepolia: "abc",
    },
    customChains: [
      {
        network: "scrollSepolia",
        chainId: 534351,
        urls: {
          apiURL: "https://sepolia-blockscout.scroll.io/api",
          browserURL: "https://sepolia-blockscout.scroll.io/",
        },
      },
    ],
  },
  //   networks: {
  //     chain: {
  //       url: `${process.env.CHAIN}`,
  //       accounts: [<string>process.env.ADMIN_PRIVATE_KEY],
  //     },
  //   },
  //   etherscan: {
  //     apiKey: process.env.ETHERSCAN_API_KEY,
  //   },
};

export default config;
