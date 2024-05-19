import { createContext, useContext, useState } from 'react';
import { useBlockchain } from "../utils/UseBlockchain";

const BlockchainContext = createContext();

export const useBlockchainContext = () => useContext(BlockchainContext);

export const BlockchainProvider = ({ children }) => {
    const blockchain = useBlockchain();
  
    return (
      <BlockchainContext.Provider value={blockchain}>
        {children}
      </BlockchainContext.Provider>
    );
  };
  