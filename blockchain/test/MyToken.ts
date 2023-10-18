import { ethers } from "hardhat";
import { expect } from "chai";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { MyToken } from "../typechain-types";

describe("NFT tests", () => {
  let signers: SignerWithAddress[];
  let developer: SignerWithAddress;
  let user1: SignerWithAddress;
  let user2: SignerWithAddress;
  let nftContract: MyToken;
  before(async () => {
    signers = await ethers.getSigners();
    developer = signers[0];
    user1 = signers[1];
    user2 = signers[2];
  });
  it("Deploys NFT contract", async () => {
    const Factory = await ethers.getContractFactory("MyToken");
    const myNFTToken = await Factory.deploy(developer.address);
    expect(myNFTToken.address).to.not.eq(ethers.constants.AddressZero);
    nftContract = myNFTToken as MyToken;
  });

  it("Mint some nfts", async () => {
    const mintTx = await nftContract.connect(user1).safeMint();
    await mintTx.wait();
    const mintTx2 = await nftContract.connect(user2).safeMint();
    await mintTx2.wait();
  });

  it("Check all possible requires", async () => {
    expect(nftContract.withdraw()).to.be.revertedWith("Zero balance");

    expect(
      nftContract
        .connect(user2)
        .setBaseURI("https://gateway.pinata.cloud/ipfs/2")
    ).to.be.reverted;

    expect(nftContract.connect(user2).pause()).to.be.reverted;

    expect(nftContract.connect(user2).unpause()).to.be.reverted;

    expect(nftContract.connect(user2).withdraw()).to.be.reverted;
  });
});
