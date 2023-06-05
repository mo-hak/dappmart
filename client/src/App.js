import abi from "./contracts/ECommerce.json"
import {useState, useEffect} from 'react';
import {ethers} from "ethers";
import './App.css';
import Productadd from "./components/Productadd";
import Productpurchase from "./components/Productpurchase";
import Getallproduct from "./components/Getallproduct";
function App() {
  const [state, setState] = useState({
    provider: null,
    signer: null,
    contract: null,
  });
  useEffect(() => {
    const connectWallet = async () => {
      const contractAddress = "0x02a68c264ba93055d8e2554361f91b353f291870";
      const contractABI = abi.abi;
      try {
        const { ethereum } = window;

        if (ethereum) {
          const account = await ethereum.request({
            method: "eth_requestAccounts",
          });
        }

          const provider = new ethers.providers.Web3Provider(ethereum);
          const signer = provider.getSigner();
          const contract = new ethers.Contract(
            contractAddress,
            contractABI,
            signer
          );
          setState({ provider, signer, contract })
        }
       catch (error) {
        console.log(error);
      }
    };
    connectWallet();
  }, []);
  //console.log(state);// this is template for creating dapp always follow this.
  return (
  <div className="App">
    <header className="App-header">DappMart</header>
    <div className="Content">
      <Productadd className=".Productadd" state={state}></Productadd>
      <Productpurchase  className=".Productpurchase" state={state}></Productpurchase>
    </div>
    <Getallproduct state={state}></Getallproduct>
  </div>
  );
}

export default App;
