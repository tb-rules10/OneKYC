import axios from "axios";
import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { Input } from "@material-tailwind/react";
import { Button } from "@material-tailwind/react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useBlockchainContext } from "../context/BlockchainContext";
import { showError, showStatus, showSuccess } from "../utils/ToastOptions";

function AgentDashboard({ handleSubmit }) {
  const { account, contract, provider } = useBlockchainContext();
  const [kycApplicaitons, setKYCList] = useState([]);
  const [listShow, setListShow] = useState(false);
  const [kycShow, setKYCShow] = useState(false);
  const [verifyShow, setVerifyShow] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [shareFlag, setShareFlag] = useState(false);
  const [verify, setVerify] = useState(false );
  const [userData, setUserData] = useState({
    status: "",
    name: "",
    phonenum: "",
    aadhaar: "",
    location: "",
    photoUrl: "",
    docUrl: "",
  });

  const fetchApplications = async () => {
    try {
      const list = Object.values(await contract.viewKYCApplications());
      // console.log(list);
      if (list.length === 0) throw new Error("No pending applications");
      setKYCList(list);
      setListShow(true);
      setKYCShow(false);
      setShareFlag(false);
    } catch (error) {
      showError(error.message);
      // console.log(error);
    }
  };

  const fetchShareRequests = async () => {
    try {
      const list = await contract.viewShareRequests();
      console.log(list);
      if (list.length === 0) throw new Error("No pending applications");
      setShareFlag(true);
      setKYCList(list);
      setVerify(false);
      setListShow(true);
      setKYCShow(false);
      setVerify(false);
    } catch (error) {
      showError();
      // console.log(error);
    }
  };

  // useEffect(() => {
  //   console.log("User--------");
  //   console.log(userData);
  // }, [userData]);

  const getStatus = async (selectedUser) => {
    try {
      const list = await contract.viewKYC(selectedUser);
      const status =
        list[0] == 0 ? "Pending" : list[0] == 1 ? "Approved" : "Rejected";
      return status;
    } catch (error) {
      showError(error.reason);
      console.log(error);
      return "Unknown";
    }
  };

  const view = async () => {
    setVerify(false);
    if (selectedUser == null) {
      let value = await prompt("Enter Public Address:");
      console.log(value);
      setSelectedUser(value);
    }
    try {
      const list = await contract.viewKYC(selectedUser);
      console.log(list);
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
      setListShow(false);
      setKYCShow(true);
    } catch (error) {
      showError(error.reason);
      console.log(error);
    }
  };

  const share = async () => {
    try {
      await contract.approveShareRequest(selectedUser[0]);
      showSuccess("Shared Sueccessfully");
    } catch (error) {
      showError(error.reason);
      console.log(error);
    }
  };

  const rejectShare = async () => {
    try {
      await contract.rejectShareRequest(selectedUser[0]);
      showSuccess("Rejected Share Request");
    } catch (error) {
      showError(error.reason);
      console.log(error);
    }
  };

  const approveKYC = async () => {
    try {
      await contract.approveKYC(selectedUser);
      showSuccess("KYC Application Approved");
    } catch (error) {
      showError(error.reason);
      console.log(error);
    }
  };

  const rejectKYC = async () => {
    try {
      await contract.rejectKYC(selectedUser);
      showSuccess("KYC Application Rejected");
    } catch (error) {
      showError(error.reason);
      console.log(error);
    }
  };

  const handleSelect = (address) => {
    setSelectedUser(address);
  };

  const verifyApplication = async () => {
    var id;
    try {
      console.log("Verifying application");
      id = toast.loading("Verifying application");
      const response = await axios.post(
        "http://localhost:8000/verify",
        userData
      );
      console.log(response.data);
      // if (response.data.status) {
        toast.update(id, {
          render: `Face Match -  ${response.data.face_match_percentage}%`,
          type: "info",
          isLoading: false,
          closeButton: true,
          autoClose: false,
        });
        toast.success("Documents Verified");
        setVerify(true);
      // } else
      //   toast.update(id, {
      //     render: response.data.reason,
      //     type: "info",
      //     isLoading: false,
      //     closeButton: true,
      //     autoClose: false,
      //   });
    } catch (e) {
      toast.update(id, {
        render: e.reason,
        type: "error",
        isLoading: false,
        closeButton: true,
        autoClose: false,
      });
      console.log(e);
    }
  };

  const StatusComponent = ({ address }) => {
    const [status, setStatus] = useState(null);
    const [statusColor, setStatusColor] = useState("");

    useEffect(() => {
      const getStatus = async () => {
        try {
          const list = await contract.viewKYC(address);
          const status =
            list[0] == 0 ? "Pending" : list[0] == 1 ? "Approved" : "Rejected";
          setStatus(status);
          setStatusColor(getStatusColor(status));
        } catch (error) {
          setStatus("Unknown");
          setStatusColor("text-black"); // Default color
          console.error(error);
        }
      };

      getStatus();
    }, [address]);

    const getStatusColor = (status) => {
      switch (status) {
        case "Approved":
          return "text-green-500";
        case "Pending":
          return "text-yellow-500";
        case "Rejected":
          return "text-red-500";
        default:
          return "text-black"; // Default color
      }
    };

    return (
      <div
        className={`flex items-center justify-between hover:bg-black hover:cursor-pointer hover:scale-105 transition duration-300 hover:bg-opacity-50 h-full p-2 my-4 ${
          selectedUser === address
            ? "bg-black bg-opacity-50"
            : "bg-black bg-opacity-10"
        }`}
        onClick={() => handleSelect(address)}
      >
        <div>{address}</div>
        <div className={`font-bold uppercase ${statusColor}`}>{status}</div>
      </div>
    );
  };

  return (
    <>
      <Navbar />
      <div className="w-full px-16 py-4 overflow-hidden space-4 ">
        <div>
          <h1 className="text-black text-[1.8rem] py-4">Agent Dashboard</h1>
        </div>

        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center  gap-2">
            <Button
              onClick={fetchApplications}
              className="flex items-center gap-3"
            >
              Fetch Applications
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
                  d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
                />
              </svg>
            </Button>

            <Button className="ml-4" onClick={view}>
              View
            </Button>
          </div>

          <div className="flex items-center  gap-2">
            <Button
              onClick={fetchShareRequests}
              className="flex items-center gap-3"
            >
              Fetch Share Requests
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
                  d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
                />
              </svg>
            </Button>

            <Button
              className="ml-4"
              onClick={share}
              disabled={shareFlag == false || selectedUser == null}
            >
              Share
            </Button>

            <Button
              className="ml-4"
              onClick={rejectShare}
              disabled={shareFlag == false || selectedUser == null}
            >
              Reject
            </Button>
          </div>
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
            <h1 className="text-black text-[1.2rem] font-bold">User Data</h1>
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

            <div className="flex justify-between items-center">
              <Button
                onClick={verifyApplication}
                className="flex items-center gap-3"
              >
                Verify
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
                    d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
                  />
                </svg>
              </Button>
              <div className="flex items-center gap-2 mt-4">
                <Button onClick={approveKYC} color="green" disabled={!verify ||userData.status == "Approved"}>
                  Approve
                </Button>
                <Button onClick={rejectKYC} color="red" disabled={userData.status == "Approved"}>
                  Reject
                </Button>
              </div>
            </div>
          </div>
        )}

        {listShow && (
          <div className="my-4 h-full">
            {kycApplicaitons.map((address, index) => (
              <StatusComponent key={index} address={address} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default AgentDashboard;
