import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

module.exports = buildModule("OneKYC", (m) => {
  const OneKYC = m.contract("OneKYC", []);
  return { OneKYC };
});

// npx hardhat ignition deploy .\ignition\modules\OneKYC.ts --network localhost --deployment-id one-kyc 