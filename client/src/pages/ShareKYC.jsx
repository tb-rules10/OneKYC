import { useState, useEffect } from "react";
import { Button } from "@material-tailwind/react";
import CustomStepper from '../components/CustomStepper';
import StepContent from '../components/StepContent';
import Navbar from "../components/Navbar";
import { useBlockchainContext } from '../context/BlockchainContext';
import { validateForm } from "../utils/Pinata";
import { showError, showStatus, showSuccess,  showPromise } from "../utils/ToastOptions";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

function ApplyKYC() {
  const { account, contract, provider } = useBlockchainContext();

  const [processedBankList, setProcessedBankList] = useState([]);
  const [selectedBank, setSelectedBank] = useState(null);

  const handleBankClick = (bankId) => {
    setSelectedBank(bankId);
  };

  const shareKYC = async () => {
    try {

      showStatus("Sharing");

      await contract.requestAccess(
        account,
        "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
        selectedBank
      );
      
      showSuccess("Request Sent");
    } catch (error) {
      showError(error.message);
      // console.log(error);
    }
  };

  useEffect(() => {
    const fetchBankList = async () => {
      try {
        let bankList = await contract.viewBanks();
        let processedList = bankList.map((bank) => ({
          id: bank[0],
          bankName: bank[1],
        }));
        setProcessedBankList(processedList);
      } catch (error) {
        console.log("Error fetching bank list:", error);
      }
    };
    if(account){
      fetchBankList();
    }
  }, [account, contract]);

  


  return (
    <>
      <Navbar account={account}  />
      <div className="w-full px-24 pb-4 pt-8 xl:block overflow-hidden" > 
      <div>
          <h1 className="text-black text-[1.8rem] py-4">Share KYC</h1>
          <p className="text-sm text-gray-500 mb-2">Select the bank with which you want to share your KYC.</p>
        </div>
        <div className='flex w-full'>
            {processedBankList.map((bank) => (
              <div 
                className={`hover:bg-black hover:cursor-pointer hover:scale-110 transition duration-300 hover:bg-opacity-50 h-full p-2 w-32 m-5 flex flex-col justify-between items-center ${
                  selectedBank === bank.id ? "bg-black bg-opacity-50" : ""
                }`}  
                onClick={() => handleBankClick(bank.id)}
                key={bank.id}>
                  <img 
                    className='rounded-full mb-2'
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSaN8BT_E1jZNWT1lkaTg-dBXrd7Igy2dHg5qndshrdEw&s" alt="not-again" 
                  />
                    {bank.bankName}
                  </div>
            ))}
          </div>
          <Button
          className="mt-4"
          onClick={shareKYC}
          >
            Share
            </Button>
      </div>
    </>
  );
}

export default ApplyKYC;