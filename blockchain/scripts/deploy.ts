import { ethers } from "hardhat";
import hre from "hardhat";
import "hardhat-deploy";

// https://scrollscan.com/
// npx hardhat run scripts/deploy.ts --network chain
async function main() {
  const adminAddress = "0x2c84C3D16AaAC1157919D9210CBC7b8797F5A91a";
  const notRevealedBaseUri = "ipfs://QmcCUMJhEzVkPNAjYKNYvJsD665k4jLZzz4aEpjRKanJk8"
  const NYScroll = await ethers.getContractFactory("NYScroll");
  const nyScroll = await NYScroll.deploy(adminAddress, notRevealedBaseUri);

  await nyScroll.deployed();
  console.log(`NFT deployed to ${nyScroll.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
