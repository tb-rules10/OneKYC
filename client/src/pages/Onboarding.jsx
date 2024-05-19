import React from "react";
// import Image from "../assets/image2.gif";
import { TypeAnimation } from 'react-type-animation';
import { Link } from 'react-router-dom';
import { Button } from "@material-tailwind/react";
import Navbar from "../components/Navbar";

function Onboarding() {
  return (
    <>
    <Navbar />
    <div className="mx-auto md:px-28 px-10 flex items-center justify-between h-[80vh]">
      <div className="font-sans">
        <h1 className="font-bold text-[#291528] text-5xl py-2 typewriter">
          {/* Explore, Code, Collaborate: */}
          <TypeAnimation
      sequence={[
        'Verify, Secure, Share:',
        3000,
      ]}
      repeat={Infinity}
    />


        </h1>
        <h1 className=" text-5xl py-2 text-[#3A3E3B]">Your one stop</h1>
        <h1 className="text-5xl text-[#3A3E3B] py-2">
          <b className="text-[#291528]">KYC</b> Solution
        </h1>

        

        <div className="flex my-4 gap-3">
        <Button className="w-28 my-4 bg-light-secondary hover:bg-[#000300] normal-case font-normal text-md" >
          <Link to="/register" >Register</Link>
        </Button>
        <Button variant="outlined" className="w-28 mr-2 my-4 normal-case font-normal text-md" >
          <Link to="/login" >Sign In</Link>
        </Button>
          {/* <button className="w-28 mr-2 my-4 whitespace-nowrap bg-light-secondary text-light-primary p-3 rounded-xl ease-in-out duration-300  hover:bg-[#000300]">
            <Link to="/register" >Register</Link>
          </button>
          <button className="w-28 ml-2 my-4 whitespace-nowrap border-light-secondary text-light-secondary p-3 rounded-xl ease-in-out duration-300 border-2 box-border transform hover:scale-x-110 hover:bg-white">
            <p>Sign In</p>
          </button> */}
        </div>
      </div>
      <div>
        <img src="https://private-user-images.githubusercontent.com/58645688/328815116-b2220136-3bf5-4234-9263-09736802c762.gif?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3MTUxNTczNjMsIm5iZiI6MTcxNTE1NzA2MywicGF0aCI6Ii81ODY0NTY4OC8zMjg4MTUxMTYtYjIyMjAxMzYtM2JmNS00MjM0LTkyNjMtMDk3MzY4MDJjNzYyLmdpZj9YLUFtei1BbGdvcml0aG09QVdTNC1ITUFDLVNIQTI1NiZYLUFtei1DcmVkZW50aWFsPUFLSUFWQ09EWUxTQTUzUFFLNFpBJTJGMjAyNDA1MDglMkZ1cy1lYXN0LTElMkZzMyUyRmF3czRfcmVxdWVzdCZYLUFtei1EYXRlPTIwMjQwNTA4VDA4MzEwM1omWC1BbXotRXhwaXJlcz0zMDAmWC1BbXotU2lnbmF0dXJlPTY0MmJmMmM3OGQ0MDFjNDNlNTMxOTRjN2U2YzY0MDIwN2E5MWI1ZmYwNTk4ZDhmODdlYjk1ODNmYjdlMTdlNGEmWC1BbXotU2lnbmVkSGVhZGVycz1ob3N0JmFjdG9yX2lkPTAma2V5X2lkPTAmcmVwb19pZD0wIn0.cVh40V1cZr1U96q7IhU58gUvSOPe_I6rFHEeWu6082Y" alt="not-again" className="h-[60vh]" />
      </div>
    </div>
    </>
  );
}

export default Onboarding;