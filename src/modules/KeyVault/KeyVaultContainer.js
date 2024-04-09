import React from "react";
import KeyVault from "./KeyVault";

const KeyVaultContainer = ({ setheaderTitle }) => {
  setheaderTitle("Key Vault");
  return <KeyVault />;
};

export default KeyVaultContainer;
