import { useEffect } from 'react'
import Navbar from './../components/Navbar';
import { Button } from "@material-tailwind/react";
import { Link, useNavigate } from "react-router-dom";
import { useBlockchainContext } from '../context/BlockchainContext';

function SelectEntity() {

  const { account, contract, provider } = useBlockchainContext();
  const navigate = useNavigate();

  
  useEffect(() => {
    const fetchEntity = async () => {
      try {
        const entity = await contract.getEntity();
        console.log("Entity (C) - ", entity);
        if (entity != null) 
          navigate("/");
      } catch (error) {
        // console.log(error);
      }
    };
    fetchEntity();
  }, [contract]);

  useEffect(() => {
    if(!account){
      navigate("/");
    }
  }, [account]);


  const handleBankClick = () => {
    localStorage.setItem('entity', "Bank");     
    navigate('/agentKYC');
  };

  const handleCustomerClick = async () => {
    localStorage.setItem('entity', "Customer");      
    navigate('/applyKYC');
  };

  
  return (
    <>
      <Navbar />
      <div className='h-[30rem] flex justify-evenly items-center'>
        <Button onClick={handleBankClick}>Continue as KYC Agent</Button>
        <Button onClick={handleCustomerClick}>Continue as Customer</Button>
      </div>
    </>
  )
}

export default SelectEntity
