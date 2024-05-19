import axios from "axios";
import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { Input } from "@material-tailwind/react";
import { Button } from "@material-tailwind/react";
import { useBlockchainContext } from "../context/BlockchainContext";
import { showError, showStatus, showSuccess } from "../utils/ToastOptions";

function CustomerDashboard() {
  const { account, contract, provider } = useBlockchainContext();
  const [kycShow, setKYCShow] = useState(false);
  const [userData, setUserData] = useState({
    status: "",
    name: "",
    phonenum: "",
    aadhaar: "",
    location: "",
    photoUrl: "",
    docUrl: "",
  });

  useEffect(() => {
    const view = async () => {
      try {
        const list = await contract.viewKYC(account);
        setUserData({
          status:
            (list[0] == 0 ? "Pending" : list[0] == 1 ? "Approved" : "Rejected") ||
            "Unknown",
          name: list[1][0],
          phonenum: list[1][1],
          aadhaar: list[1][2],
          location: list[1][3],
          photoUrl: list[1][4],
          docUrl: list[1][5],
        });
        setKYCShow(true);
      } catch (error) {
        showError(error.reason);
        console.log(error);
      }
    };
    view();
  }, [account]);

  return (
    <>
    <Navbar />
      <div className="w-full px-16 py-4 overflow-hidden space-4 ">
        <div>
          <h1 className="text-black text-[1.8rem] py-4">Customer Dashboard</h1>
        </div>

        {kycShow && (
          // <div className='h-[70vh] bg-black bg-opacity-50 '>
          //   <div className='flex justify-between'>
          //     <div className='rounded-lg ml-16'>
          //     <img src={userData.photoUrl} alt="User Photo" />
          //     </div>
          //     <div className='rounded-lg'>
          //     <img src={userData.photoUrl} alt="User Photo" />

          //     </div>
          //   </div>
          // </div>
          <div className="my-4">
            <hr className="bg-black h-0.5" />

            <div className="flex items-center justify-between py-4">
              <div className="flex flex-col justify-evenly items-start h-[40vh]">
                <p>Status: {userData.status}</p>
                <p>Name: {userData.name}</p>
                <p>Phone Number: {userData.phonenum}</p>
                <p>Aadhaar Number: {userData.aadhaar}</p>
                <p>Location: {userData.location}</p>
              </div>
              <div className="flex flex-col items-center">
                <img src={userData.photoUrl} alt="User Photo" />
                {/* <img src={userData.docUrl} alt="User Photo" /> */}
                <hr className="bg-black h-0.5 mt-2 w-full" />
                <a
                  href={userData.docUrl}
                  className="underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View Document
                </a>
              </div>
            </div>

            <hr className="bg-black h-0.5" />

          </div>
        )}

      </div>
    </>
  )
}

export default CustomerDashboard
