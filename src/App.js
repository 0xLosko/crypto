import './App.css';
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import test from './artifacts/contracts/test.sol/test.json';

const contractAddress = '0x17C8b71E5eE01A726766c99d397D619219C8CAF3';

function App() {
  const [balance, setBalance] = useState(0);
  const [walletAddress, setWalletAddress] = useState("");
  const [statut, setStatut] = useState('');

  useEffect(() =>{
    getBalance();
  } ,[])

  async function requestAccount(){
    console.log("Request ....")

    //check if mm exist
    if(window.ethereum){
      console.log("MM detect");
      try{
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        
        setWalletAddress(accounts[0]);
      } catch (error){
        console.log("Error connecting...");
      }
    } 
    else 
    {
      console.log("MM Not detected");
    }
  }
  const price = '100';

  async function newOrder(){
    setStatut('');
    if(typeof window.ethereum !== 'undefined'){
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, test.abi, signer)
      try {
        try{
          const transInc = await contract.addCustomer(accounts[0]);
          await transInc.wait();
        } catch {
          console.log('compte create already');
        }
        try{
          const transInc = await contract.addOrder(10);
          await transInc.wait();
        }catch{
          const tx = {
            from : accounts[0],
            to : contractAddress,
            value : ethers.utils.parseEther(price)
          }
          const trans = await signer.sendTransaction(tx);
          await trans.wait();
          const transInc = await contract.addOrder(10);
          await transInc.wait();
          setStatut('Commande confirmé');
        } 
      } catch (error) {
        setStatut('Une erreur est survenue qql part');
      }
    }
  }
  async function getBalance(){
    setStatut('');
    if(typeof window.ethereum !== 'undefined'){
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const provider = new ethers.providers.Web3Provider(window.ethereum);

      const contract = new ethers.Contract(contractAddress, test.abi, provider)
      try {
        let overrides = {
          from: accounts[0]
        }
        const data = await contract.getBalance(overrides);
        setBalance(String(data));
      } catch (error) {
        setStatut('');
      }
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <button

        onClick={requestAccount}

        >Connect Wallet</button>
        <h3>Wallet Address : {walletAddress}</h3>
        <h2>{balance / 10**18} eth</h2>
        <h2>{statut}</h2>
        <button

        onClick={newOrder}

        >Buy</button>
      </header>
    </div>
  );
}

export default App;