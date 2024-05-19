import { BsArrowUpRight } from "react-icons/bs";
import { AppName, NavItems } from "../data.js";
import { Link } from "react-router-dom";
import { IoLockClosed, IoLockOpen } from "react-icons/io5";
import { useBlockchain } from "../utils/UseBlockchain";




function Navbar() {

  const { account, contract, provider, loadProvider } = useBlockchain();

  return (
    <div className="flex justify-between items-center h-24 mx-auto md:px-16 px-4 bg-light-primary">
      <h1 className="w-full text-4xl whitespace-nowrap font-bold text-light-secondary">
        <Link to="/">
        {AppName}
        </Link>
      </h1>

      <ul className="items-center hidden md:flex w-[80%] justify-evenly text-light-secondary">
        <Link to="/applyKYC">
          <li className="whitespace-nowrap mx-4 py-1 link">{NavItems[0]}</li>
        </Link>
        <Link to="/shareKYC">
        <li className="whitespace-nowrap mx-4 py-1 link">{NavItems[1]}</li>
        </Link>
        {/* <li className="whitespace-nowrap mx-4 py-1 link">{NavItems[2]}</li> */}
      </ul>

      <div className="flex group">
        {account ? (

          <button className="ml-1 flex justify-between items-center whitespace-nowrap bg-light-secondary transition-all  text-light-primary group-hover:text-light-secondary group-hover:bg-light-primary p-3 rounded-full ease-in-out duration-300 border-transparent border-2 group-hover:border-light-secondary box-border">
            <p className="pr-2">Connected</p>
            <div className="rounded-full bg-light-primary text-light-secondary group-hover:bg-light-secondary group-hover:text-light-primary p-1 transition-all duration-300">
              <IoLockClosed  className="transform group-hover:rotate-45 transition-transform duration-500" />
            </div>
          </button>
          
        ) : (

          <button onClick={loadProvider} className="ml-1 flex justify-between items-center whitespace-nowrap bg-light-secondary transition-all  text-light-primary group-hover:text-light-secondary group-hover:bg-light-primary p-3 rounded-full ease-in-out duration-300 border-transparent border-2 group-hover:border-light-secondary box-border">
            <p className="pr-2">Connect Wallet</p>
            <div className="rounded-full bg-light-primary text-light-secondary group-hover:bg-light-secondary group-hover:text-light-primary p-1 transition-all duration-300">
              <IoLockOpen className="transform group-hover:rotate-45 transition-transform duration-500" />
            </div>
          </button>
        )}
      </div>
    </div>
  );
}

export default Navbar;
