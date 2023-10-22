"use client";
import React, { useEffect, useState } from "react";
import { createWeb3Modal } from "@web3modal/wagmi/react";
import { WagmiConfig } from "wagmi";
import { chains, wagmiConfig, walletProjectId } from "../wagmi";
import { ThemeProvider } from "@/components/theme-provider";
import { RecoilRoot } from "recoil";

createWeb3Modal({ wagmiConfig, projectId: walletProjectId, chains });

export default function Providers({ children }: { children: React.ReactNode }) {
  const [Iready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  return (
    <>
      {Iready ? (
        <RecoilRoot>
          <WagmiConfig config={wagmiConfig}>{children}</WagmiConfig>
        </RecoilRoot>
      ) : null}
    </>
  );
}
