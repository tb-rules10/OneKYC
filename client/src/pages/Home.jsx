import Navbar from "../components/Navbar";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { showError, showStatus, showSuccess } from "../utils/ToastOptions";
import { ethers } from "ethers";
import OneKYC from "../artifacts/contracts/OneKYC.sol/OneKYC.json";
import Onboarding from "./Onboarding";
import ApplyKYC from "./ApplyKYC";
import { useBlockchain } from "../utils/UseBlockchain";
import CustomerDashboard from "./CustomerDashboard";
import AgentDashboard from "./AgentDashboard";

function Home() {
  const navigate = useNavigate();
  const { account, contract, provider, loadProvider } = useBlockchain();
  const [entity,  setEntity] = useState(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchEntity = async () => {
      localStorage.clear();
      try {
        // console.log("************");
        const entity = await contract.getEntity();
        setError(false);
        // console.log("Entity (C) - ", entity);
        setEntity(entity);
        if (entity === null) {
          navigate("/selectEntity");
        } 
      } catch (error) {
        if (error.reason === "User not registered.") {
          navigate("/selectEntity");
        }         
        else{
          console.log(error);
          setError(true);
          showError("An error occurred");
          showError("Try again later");
        }
      }
    };
    if (account) {
      fetchEntity();
    } else {
      setLoading(false);
    }
  }, [account]);


  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="flex items-center justify-center h-[80vh] overflow-hidden">
          <img src="https://media1.tenor.com/m/U0pUukn1-YYAAAAC/error.gif" alt="" />
        </div>
      </>
    );
    
  }

  return (
    <>
    {/* <button onClick={() => {console.log(localStorage.getItem("entity"));}}>button</button> */}
      {account ? 
          entity == "Customer" 
          ? <CustomerDashboard />
          : <AgentDashboard />
        : <Onboarding />
      }
    </>
  );
}

export default Home;
