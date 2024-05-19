import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: '0.8.9',
  networks: {
    hardhat: {
      chainId: 31337,
    },
  },
  paths: {
    artifacts: './client/src/artifacts',
  },
};

export default config;
