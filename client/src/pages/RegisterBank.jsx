import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { Link, useNavigate } from "react-router-dom";
import { Input, Button } from "@material-tailwind/react";
import { showError, showStatus, showSuccess, showPromise } from "../utils/ToastOptions";
import { useBlockchainContext } from '../context/BlockchainContext';
import SyncLoader from 'react-spinners/SyncLoader';
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';


function RegisterBank() {
  const { account, contract, provider } = useBlockchainContext();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    username: '',
    agentKEY: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const validateKey = async (key) => {
    return key === 'key@1234';
  };

  const handleSubmit = async (e) => {
    var id;
    e.preventDefault();
    try{
      const isValidKey = await validateKey(formData.agentKEY);
      if (!isValidKey) {
        id = toast.loading("Registering new KYC agent",
        {
          position: "bottom-right",
          autoClose: true,
        }
        )
        await contract.registerBank(formData.username);
        // console.log(await contract.getEntity());

        toast.update(id, { render: "Agent Registered", type: "success", isLoading: false, autoClose: true }, );
        // navigate('/');
      } else {
        showError("Invalid Key");
      }
    }
    catch (e){
      if(e.reason)
        toast.update(id, { render: e.reason, type: "error", isLoading: false, autoClose: true });
      else
        toast.update(id, { render: "Nonce too high.", type: "error", isLoading: false, autoClose: true });
      console.log(e);
    }
  };

  // if(loading){
  //   console.log("loading");
  //   return(
  //     <>
  //     <div className="flex h-[100vh] w-full justify-center items-center">
  //       <SyncLoader color="#000000" />
  //     </div>  
  //     </>
  //   );
  // }

  return (
    <>
      {/* <Navbar /> */}
      <Navbar />
      
      <div className=" w-[100vw] h-[60vh] flex justify-center items-center">
  <div>
    <h1 className="text-black text-[1.8rem]">KYC Agent</h1>
    <p className="text-sm text-gray-500 mb-5">
      Enter username and agent key.
    </p>
    <form onSubmit={(e) => handleSubmit(e)}>
      <div className="space-y-5 w-[30vw]">
        <div className="sm:flex [&>*]:my-4 sm:[&>*]:my-0 gap-3 [&>*]:min-w-0">
          <Input
            label="Username"
            name="username"
            onChange={(e) => handleChange(e)}
          />
          {/* <Input label="Pan Card No." name="lastname" onChange={(e) => handleChange(e)} /> */}
        </div>
        <Input
          label="Ageny Key"
          name="agentKEY"
          onChange={(e) => handleChange(e)}
          type="password"
        />
        <Button variant="filled" fullWidth type="submit">
            Register
        </Button>
      </div>


    </form>
  </div>
</div>


    </>
  );
}

export default RegisterBank;
