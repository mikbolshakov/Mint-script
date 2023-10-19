import { ethers } from "hardhat";
import { expect } from "chai";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { ScrollNFT } from "../typechain-types";

describe("NFT tests", () => {
  let signers: SignerWithAddress[];
  let developer: SignerWithAddress;
  let user1: SignerWithAddress;
  let user2: SignerWithAddress;
  let nftContract: ScrollNFT;
  before(async () => {
    signers = await ethers.getSigners();
    developer = signers[0];
    user1 = signers[1];
    user2 = signers[2];
  });
  it("Deploys NFT contract", async () => {
    const Factory = await ethers.getContractFactory("ScrollNFT");
    const myNFTToken = await Factory.deploy(developer.address, "not rev base uri");
    expect(myNFTToken.address).to.not.eq(ethers.constants.AddressZero);
    nftContract = myNFTToken as ScrollNFT;
  });

  it("Mint some nfts", async () => {
    expect(await nftContract.balanceOf(user1.address)).to.eq(0)
    expect(await nftContract.getBaseUri()).to.eq("")
    expect(await nftContract.getNotRevealedBaseUri()).to.eq("not rev base uri")

    const mintTx = await nftContract.connect(user1).safeMint();
    await mintTx.wait();

    expect(await nftContract.balanceOf(user1.address)).to.eq(1)
    expect(await nftContract.ownerOf(0)).to.eq(user1.address)
    expect(await nftContract.tokenURI(0)).to.eq("not rev base uri")
  });

  it("Reveal", async () => {
    await nftContract.setBaseURI("ipfs/")
    expect(await nftContract.getBaseUri()).to.eq("ipfs/")
    await nftContract.reveal();
    expect(await nftContract.tokenURI(0)).to.eq("ipfs/0.json")
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
