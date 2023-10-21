import "./App.css";
import React, { useState } from "react";
import { ethers } from "ethers";
import contractAbi from "./contractAbi.json";

const contractAddress = "0x501eb33bBFe6564Fc2d69D69Da234e4BC88949ba";
const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();
const contract = new ethers.Contract(contractAddress, contractAbi, signer);

function App() {
  const [metaMaskConnected, setMetaMaskConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");

  const connectMetamaskHandler = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum
          .request({ method: "eth_requestAccounts" })
          .then((res) => {
            console.log(res);
            return res;
          });

        if (accounts.length > 0) {
          setWalletAddress(accounts[0]);
        }

        const currentChainId = await window.ethereum.request({
          method: "eth_chainId",
        });

        if (currentChainId !== "0x8274F") {
          try {
            await window.ethereum.request({
              method: "wallet_switchEthereumChain",
              params: [{ chainId: "0x8274F" }],
            });
          } catch (switchError) {
            if (switchError.code === 4902) {
              try {
                await window.ethereum.request({
                  method: "wallet_addEthereumChain",
                  params: [
                    {
                      chainId: "0x8274F",
                      chainName: "Scroll Sepolia",
                      rpcUrls: ["https://sepolia-rpc.scroll.io/"],
                      nativeCurrency: {
                        name: "ETH",
                        symbol: "ETH",
                        decimals: 18,
                      },
                      blockExplorerUrls: ["https://sepolia.scrollscan.com"],
                    },
                  ],
                });
              } catch (addError) {
                console.log(addError);
                return;
              }
            } else {
              console.log(switchError);
              return;
            }
          }
        }

        setMetaMaskConnected(true);
      } catch (error) {
        console.log(error);
      }
    } else {
      alert("Install MetaMask extension!");
    }
  };

  const mintFunc = async () => {
    try {
      let tx = await contract.safeMint();
      await tx.wait();
      alert("Minted successfully!");
    } catch (error) {
      alert("Limitation in a smart contract");
      console.error("Failed to mint NFT on the smart contract: ", error);
    }
  };

  return (
    <div className="button-container">
      {metaMaskConnected ? (
        <button className="button" onClick={mintFunc}>
          Mint NFT
        </button>
      ) : (
        <button className="button" onClick={connectMetamaskHandler}>
          Connect MetaMask
        </button>
      )}
    </div>
  );
}

export default App;
