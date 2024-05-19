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
  const [activeStep, setActiveStep] = useState(0);
  const [isLastStep, setIsLastStep] = useState(false);
  const [isFirstStep, setIsFirstStep] = useState(false);

  const [formData, setFormData] = useState({
    firstname: '',
    middlename: '',
    lastname: '',
    phonenum: '',
    address: '',
    aadhaar: '',
    pan: '',
    photourl: '',
    docUrl: '',
    bank:'',
  });

  const handleNext = () => {
    if (!isLastStep) {
      setActiveStep((cur) => cur + 1);
    }
  };

  const handlePrev = () => {
    if (!isFirstStep) {
      setActiveStep((cur) => cur - 1);
    }
  };

  const handleSubmit = async (e) => {
    console.log(formData);
    var id;
    e.preventDefault();
    try{
      if(validateForm(formData)){
        const inputArray = [
          formData.firstname + ' ' + (formData.middlename ? formData.middlename + ' ' : '') + formData.lastname,
          formData.phonenum,
          formData.aadhaar,
          formData.address,
          formData.photourl,
          formData.docUrl
        ];
        console.log("Applying for KYC :-\n")
        console.log(inputArray)

        id = toast.loading("Applying for KYC",
        {
          position: "bottom-right",
          autoClose: true,
        }
        )
        await contract.applyForKYC(formData.bank, inputArray);

        toast.update(id, { render: "Application Sent", type: "success", isLoading: false, autoClose: true }, );

      }
    }catch (e){
      if(e.reason)
        toast.update(id, { render: e.reason, type: "error", isLoading: false, autoClose: true });
      else
        toast.update(id, { render: "Nonce too high.", type: "error", isLoading: false, autoClose: true });
      console.log(e);
    }

  };

  useEffect(() => {
    setIsFirstStep(activeStep === 0);
    setIsLastStep(activeStep === 3); 
  }, [activeStep]);

  


  return (
    <>
      <Navbar account={account}  />
      <div className="w-full px-24 pb-4 pt-8 xl:block overflow-hidden" > 
        <CustomStepper 
          activeStep={activeStep} 
          setActiveStep={setActiveStep} 
        /> 

        <div className="absolute top-[11rem] -left-[0rem] w-full h-[23rem] mt-4 px-[6rem] ">
          <StepContent 
            stepIndex={activeStep} 
            formData={formData}
            setFormData={setFormData}
            account={account}
            provider={provider}
            contract={contract}            
          />
        </div>

        <div className="mt-[33rem] sm:mt-[25rem] z-10 flex justify-between">
          <Button onClick={handlePrev} disabled={isFirstStep}>
            Prev
          </Button>
          {
            isLastStep 
            ? <Button onClick={handleSubmit} >
                Submit
              </Button>
            : <Button onClick={handleNext} >
                Next
              </Button>
          }
        </div>


        
      </div>
    </>
  );
}

export default ApplyKYC;