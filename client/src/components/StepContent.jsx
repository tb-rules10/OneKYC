import { useState, useEffect } from 'react';
import { Input } from "@material-tailwind/react";
import CustomWebcam from './CustomWebcam';
import FileUpload from "./FileUpload";
import { validateForm } from "../utils/Pinata";

const StepContent = ({ stepIndex, formData, setFormData, contract, account, provider }) => {
  const [processedBankList, setProcessedBankList] = useState([]);
  const [selectedBank, setSelectedBank] = useState(null);

  const handleBankClick = (bankId) => {
    setSelectedBank(bankId);
    setFormData({
      ...formData,
      bank: bankId,
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log(validateForm(formData));
    
    const mergedData = {
      name: `${formData.firstname} ${formData.middlename ? formData.middlename + " " : ""}${formData.lastname ?? formData.firstname}`.trim(),
      phoneNum: formData.phonenum,
      location: formData.address,
      photoUrl: formData.photourl,
      docUrl: formData.docUrl,
      aadhaarPan: `${formData.aadhaar} ${formData.pan}`.trim()
    };
    console.log('Merged form data:', mergedData);
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

  let content;
  switch (stepIndex) {
    case 0:
      content = (
        <>
          <h1 className="text-black text-[1.8rem] ">Personal Information</h1>
          <p className="text-sm text-gray-500 mb-5 ">Provide your personal information below.</p>
          <form onSubmit={handleSubmit}>
            <div className="space-y-5">
            <div className="sm:flex [&>*]:my-4 sm:[&>*]:my-0 gap-3 [&>*]:min-w-0 ">
              <Input label="First Name" name="firstname" value={formData.firstname} onChange={(e) => handleChange(e)} />
              <Input label="Middle Name" name="middlename" value={formData.middlename} onChange={(e) => handleChange(e)} />
              <Input label="Last Name" name="lastname" value={formData.lastname} onChange={(e) => handleChange(e)} />
            </div>
            <div className="sm:flex [&>*]:my-4 sm:[&>*]:my-0 gap-3 [&>*]:min-w-0">
              <Input label="Phone Number" name="phonenum" value={formData.phonenum} onChange={(e) => handleChange(e)} />
            </div>
            <Input label="Full Address" name="address" value={formData.address} onChange={(e) => handleChange(e)} />
            <div className="sm:flex [&>*]:my-4 sm:[&>*]:my-0 gap-3 [&>*]:min-w-0">
              <Input label="Aadhaar Card No." name="aadhaar" value={formData.aadhaar} onChange={(e) => handleChange(e)} />
              <Input className='hidden' label="" name="pan" value={formData.pan} onChange={(e) => handleChange(e)} />
            </div>
            </div>
          </form>
        </>
      );
      break;
    case 1:
      content = (
        <>
          <h1 className="text-black text-[1.8rem] ">Face Verification</h1>
          <p className="text-sm text-gray-500 mb-5">Look into the camera and click a photo for face verification.</p>
          <div>
            <CustomWebcam 
              formData={formData}
              setFormData={setFormData}        
            />
          </div>
        </>
      );
      break;
    case 2:
      content = (
        <>
          <h1 className="text-black text-[1.8rem] ">ID Verification</h1>
          <p className="text-sm text-gray-500 mb-5">Upload the required documents.</p>
          <div>
          <FileUpload
                formData={formData}
                setFormData={setFormData}  
          ></FileUpload>
          </div>
        </>
      );
      break;
    case 3:
      content = (
        <>
          <h1 className="text-black text-[1.8rem] ">Select Bank</h1>
          <p className="text-sm text-gray-500 mb-2">Select your bank to apply for KYC.</p>
          
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

        </>
      );
      break;
    default:
      content = null;
  }

  return (
  <div className=" h-[22rem]">
    {content}
  </div>
    );
};

export default StepContent;
