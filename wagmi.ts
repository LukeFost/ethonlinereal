"use client";
import { createWeb3Modal, defaultWagmiConfig } from "@web3modal/wagmi/react";
import { arbitrumGoerli, goerli } from "wagmi/chains";

export const walletProjectId = "0d54007e35d27d37baebd43f6459529e";

const moreMetaData = {
  name: "Web3Modal",
  description: "Web3Modal Example",
  url: "https://web3modal.com",
  icons: ["https://avatars.githubusercontent.com/u/37784886"],
};

export const chains = [goerli, arbitrumGoerli];
export const wagmiConfig = defaultWagmiConfig({
  chains: chains,
  projectId: walletProjectId,
  metadata: moreMetaData,
});
