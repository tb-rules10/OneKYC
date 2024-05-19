
import Webcam from "react-webcam";
import { uploadImageToPinata } from "../utils/Pinata";
import { useState } from 'react';
import { useRef, useCallback } from "react";
import { IconButton } from "@material-tailwind/react";
import { CameraIcon, ArrowPathIcon, CheckCircleIcon } from "@heroicons/react/24/outline";
import { showError, showStatus, showSuccess, showPromise } from "../utils/ToastOptions";

const CustomWebcam = ({ formData, setFormData }) => {
  const webcamRef = useRef(null);
  const [imageSrc, setImageSrc] = useState("");

  
  const capture = useCallback(() => {
    try{
      const newImageSrc = webcamRef.current.getScreenshot();
      setImageSrc(newImageSrc);
      showStatus("Make sure to remove your spectacles.");
    }catch (e){
      showError("Reset camera and try again.");
    }
  }, [setImageSrc]);

  
  const uploadImage = async () => {
    if (imageSrc) {
      showStatus("Uploading...");
      try {        
        const blob = await fetch(imageSrc).then((res) => res.blob());
        const file = new File([blob], `${formData.firstname || "image"}.png`, { type: 'application/octet-stream' });
        const imgHash = await uploadImageToPinata(file);
        setFormData({
          ...formData,
          photourl: imgHash,
        });
        showSuccess('Image Uploaded Successfully');
      } catch (error) {
        showError('Failed to upload image');
      }
    } else {
      showError('No image to upload');
    }
  };


  

  return (
    <div className="flex gap-6 justify-center items-center">
      {imageSrc || formData.photourl ? (
        <img src={imageSrc || formData.photourl} alt="webcam" />
      ) : (
        <Webcam width={350} ref={webcamRef} />
      )}

      <div className="flex flex-col gap-4">
        <IconButton variant="outlined" onClick={capture}>
          <CameraIcon className="h-5 w-5" />
        </IconButton>

        <IconButton variant="text" onClick={() => setImageSrc("")}>
          <ArrowPathIcon className="h-5 w-5" />
        </IconButton>

        <IconButton color={formData.photourl ? "green" : "black"}  onClick={uploadImage}>
          <CheckCircleIcon className="h-5 w-5" />
        </IconButton>
      </div>
    </div>
  );
};

export default CustomWebcam;
