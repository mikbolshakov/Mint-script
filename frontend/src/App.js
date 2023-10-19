import Wallet from "./components/wallet/wallet";
import MintNft from "./components/mintNft/mintNft";
import "./App.css";

function App() {


  return (
    <div className="container">
      <div className="section" id="wallet">
        <Wallet />
      </div>
      <div className="section" id="mint">
        <MintNft />
      </div>
    </div>
  );
}

export default App;
