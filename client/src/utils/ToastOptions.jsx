import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const toastOptions = {
  position: "bottom-right",
  autoClose: 2000,
  pauseOnHover: true,
  draggable: true,
  theme: "light",
};

export const showError = (message) => {
  toast.error(message, toastOptions);
};

export const showStatus = (message) => {
  toast.info(message, toastOptions);
};

export const showSuccess = (message) => {
  toast.success(message, toastOptions);
};

export const showWarning = (message) => {
  toast.warn(message, toastOptions);
};

export const showPromise = (msg1, msg2, msg3, func) => {
    toast.promise(
      func,
      {
        pending: msg1,
        success: msg2,
        error: {
          render({data}){
            // When the promise reject, data will contains the error
            return <MyErrorComponent message={data.message} />
          }
        }
      }
  )
};