import { useState } from "react";
import { uploadImageToPinata } from "../utils/Pinata";
import { Button } from "@material-tailwind/react";
import { showError, showStatus, showSuccess } from "../utils/ToastOptions";
import { DocumentCheckIcon } from "@heroicons/react/24/outline";

export default function FileUpload({ formData, setFormData }) {

  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('No image selected');


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (file) {
      showStatus("Uploading...")
      try {
        const ImgHash = await uploadImageToPinata(file);
        console.log(ImgHash);

        setFormData({
          ...formData,
          docUrl: ImgHash,
        });
        showSuccess('Image Uploaded Successfully');
        setFileName('No image selected');
        setFile(null);
      } catch (error) {
        console.log(error);
        // showError("Nonce too high.");
      }
    }
    
  };

  const retrieveFile = (e) => {
    const selectedFile = e.target.files[0];

    if (selectedFile) {
      const reader = new FileReader();
      reader.readAsArrayBuffer(selectedFile);

      reader.onloadend = () => {
        setFile(selectedFile);
      };

      setFileName(selectedFile.name);
    }
  };

  return (
    <>
      <div className="mt-3">
        <form className="form" onSubmit={handleSubmit}>
          <div className="flex items-center justify-center">
            <label
              htmlFor="dropzone-file"
              className="flex flex-col items-center justify-center w-full h-44 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
            >
              
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg
                  className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 16"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                  />
                </svg>
                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-semibold">Click to upload files</span> or drag
                  and drop
                </p>
              </div>
              <input
                id="dropzone-file"
                type="file"
                className="hidden"
                onChange={retrieveFile}
              />
            </label>
            { 
              <span className="text-gray-600">
                {/* helo */}
                <DocumentCheckIcon className={`h-16 pl-5 ${formData.docUrl ? "text-green-600" : ""}`} />
             </span>}
          </div>
          

          {file && <span className="text-gray-600">Image: {fileName}</span>}

          <Button
            type="submit"
            variant="gradient"
            className="flex justify-center bg-[#5F61F2] items-center gap-3 mt-4 "
            disabled={!file}
            fullWidth
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"
              />
            </svg>
            Upload Files
          </Button>
        </form>


      </div>
    </>
  );
}
