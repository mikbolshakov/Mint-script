import "./App.css";
import React, { useState } from "react";
import { ethers } from "ethers";
import contractAbi from "./contractAbi.json";
import NYS from "./images/Logo.png";
import Gift from "./images/Gift.png";
import Elki from "./images/elki.png";

const contractAddress = "0xa4d2e7Bf238916CD0677D5C8D328b713114d8b94";
const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();
const contract = new ethers.Contract(contractAddress, contractAbi, signer);

function App() {
  const [metaMaskConnected, setMetaMaskConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [mintButtonDisabled, setMintButtonDisabled] = useState(true);

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
          setMintButtonDisabled(false);
        }

        const currentChainId = await window.ethereum.request({
          method: "eth_chainId",
        });

        if (currentChainId !== "0x82750") {
          try {
            await window.ethereum.request({
              method: "wallet_switchEthereumChain",
              params: [{ chainId: "0x82750" }],
            });
          } catch (switchError) {
            if (switchError.code === 4902) {
              try {
                await window.ethereum.request({
                  method: "wallet_addEthereumChain",
                  params: [
                    {
                      chainId: "0x82750",
                      chainName: "Scroll",
                      rpcUrls: ["https://rpc.scroll.io/"],
                      nativeCurrency: {
                        name: "ETH",
                        symbol: "ETH",
                        decimals: 18,
                      },
                      blockExplorerUrls: ["https://scrollscan.com/"],
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

  const shortAddress = (address) => {
    return address ? address.substr(0, 6) + "..." + address.substr(-5) : "";
  };

  const disconnectWalletHandler = () => {
    if (window.ethereum) {
      try {
        if (typeof window.ethereum.disconnect === "function") {
          window.ethereum.disconnect();
        }

        setMetaMaskConnected(false);
        setWalletAddress("");
      } catch (error) {
        console.log(error);
      }
    }
  };

  const mintFunc = async () => {
    try {
      let tx = await contract.safeMint();
      await tx.wait();
      alert(`Minted successfully! https://scrollscan.com/tx/${tx.hash}`);
    } catch (error) {
      alert("Limitation in a smart contract");
      console.error("Failed to mint NFT on the smart contract: ", error);
    }
  };

  return (
    <>
      <div className="container">
        <div>
          {metaMaskConnected ? (
            <button
              className="button-connect"
              onClick={disconnectWalletHandler}
            >
              {shortAddress(walletAddress)}
            </button>
          ) : (
            <button className="button-connect" onClick={connectMetamaskHandler}>
              Connect wallet
            </button>
          )}
        </div>
        <img
          src={NYS}
          alt="New Year's Scroll"
          className="centered-image"
          style={{ marginTop: "30px", width: "347px", height: "241px" }}
        />
        <img
          src={Gift}
          alt="Gift"
          className="centered-image"
          style={{ marginTop: "60px", width: "90px", height: "90px" }}
        />
        <div className="button-container">
          <button
            className="button-mint"
            onClick={mintFunc}
            disabled={mintButtonDisabled}
          >
            Mint NFT
          </button>
        </div>
        <img src={Elki} alt="Elki" className="centered-image" />
      </div>
    </>
  );
}

export default App;
