import axios from "axios";
import { showError, showStatus, showSuccess } from "../utils/ToastOptions";

export const uploadImageToPinata = async (file) => {
  try {
    const form = new FormData();
    form.append('file', file);

    const resFile = await axios.post(
        'https://api.pinata.cloud/pinning/pinFileToIPFS',
        form,
        {
          headers: {
            'pinata_api_key': '9e10afd99d33be50cfc6',
            'pinata_secret_api_key':
              '5e4a57061d789b4ee4f14e35f3bbdb0b186f68ea20197e737b8ff9fefd668f51',
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      return `https://gateway.pinata.cloud/ipfs/${resFile.data.IpfsHash}`;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw new Error("Failed to upload image");
  }
};

export const validateForm = (formData) => {
  let isValid = true;
  
  if (!formData.firstname.trim() || !formData.lastname.trim()) {
    showError('First name and last name are required');
    isValid = false;
  }

  if (!formData.phonenum.trim()) {
    showError('Phone number is required');
    isValid = false;
  } else if (!/^\d{10}$/.test(formData.phonenum)) {
    showError('Please enter a valid 10-digit phone number');
    isValid = false;
  }

  if (!formData.address.trim()) {
    showError('Address is required');
    isValid = false;
  }

  if (!formData.aadhaar.trim()) {
    showError('Aadhaar card number is required');
    isValid = false;
  } else if (!/^\d{12}$/.test(formData.aadhaar)) {
    showError('Please enter a valid 12-digit Aadhaar card number');
    isValid = false;
  }

  // if (!formData.pan.trim()) {
  //   showError('Pan card number is required');
  //   isValid = false;
  // } else if (!/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(formData.pan.toUpperCase())) {
  //   showError('Please enter a valid PAN card number');
  //   isValid = false;
  // }

  if (!formData.photourl.trim()) {
    showError('Photo is required');
    isValid = false;
  }

  if (!formData.docUrl.trim()) {
    showError('Document is required');
    isValid = false;
  }

  if (!formData.bank.trim()) {
    showError('Bank selection is required');
    isValid = false;
  }

  return isValid;
};