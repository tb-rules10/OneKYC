import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import OneKYC from '../artifacts/contracts/OneKYC.sol/OneKYC.json';
import { showError } from '../utils/ToastOptions';

export function useBlockchain() {
  const [account, setAccount] = useState('');
  const [contract, setContract] = useState(null);
  const [provider, setProvider] = useState(null);

  const loadProvider = async () => {
    // console.log("Connecting to Metamask");
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
  
      if (!provider) {
        console.error("Metamask is not installed");
        return;
      }
  
      window.ethereum.on("chainChanged", () => {
        window.location.reload();
      });
  
      window.ethereum.on("accountsChanged", () => {
        window.location.reload();
      });
  
      await provider.send("eth_accounts", []);
      const signer = await provider.getSigner();
      const address = signer.address;
      setAccount(address);
  
      const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
      // const contractAddress = "";
      const deployedContract = new ethers.Contract(
        contractAddress,
        OneKYC.abi,
        signer
      );
      
      setContract(deployedContract);
      setProvider(provider);
    }  catch (error) {
      if(error.action == undefined)
        showError("Request already pending.");
      else  if(error.action)
        showError("User rejected the request.");
      else  
        showError(error);
    }
  };

  useEffect(() => {
      loadProvider();
  }, []);

  return { account, contract, provider, loadProvider };
}