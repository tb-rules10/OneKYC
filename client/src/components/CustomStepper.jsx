import { Stepper, Step } from "@material-tailwind/react";
import { UserIcon, FaceSmileIcon, CameraIcon, BuildingLibraryIcon, DocumentArrowUpIcon } from "@heroicons/react/24/outline";

const CustomStepper = ({ activeStep, setActiveStep, contract, account, provider }) => {
  return (
    <Stepper activeStep={activeStep}>
      <Step onClick={() => setActiveStep(0)}>
        <UserIcon className="h-5 w-5" />
      </Step>
      <Step onClick={() => setActiveStep(1)}>
        <FaceSmileIcon className="h-5 w-5" />
      </Step>
      <Step onClick={() => setActiveStep(2)}>
        <DocumentArrowUpIcon className="h-5 w-5" />
      </Step>
      <Step onClick={() => setActiveStep(3)}>
        <BuildingLibraryIcon className="h-5 w-5" />
      </Step>
    </Stepper>
  );
};

export default CustomStepper;