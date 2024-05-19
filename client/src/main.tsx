import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ThemeProvider } from "@material-tailwind/react";
import { ToastContainer } from 'react-toastify';
import { BlockchainProvider } from './context/BlockchainContext';



ReactDOM.createRoot(document.getElementById('root')!).render(
  <ThemeProvider>
    <BlockchainProvider  >
      <App />
      <ToastContainer autoClose={3000}/>
    </BlockchainProvider >
  </ThemeProvider>
)
