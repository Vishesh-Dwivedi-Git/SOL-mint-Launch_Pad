import React, { useMemo } from "react";
import {
  ConnectionProvider,
  WalletProvider,
  useWallet
} from "@solana/wallet-adapter-react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
  WalletModalProvider,
  WalletDisconnectButton,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import { clusterApiUrl } from "@solana/web3.js";
import "@solana/wallet-adapter-react-ui/styles.css";
import TokenLauchpad from "./TokenLauchpad";

function App() {
  const network = WalletAdapterNetwork.Devnet;

  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  return (

    <div className="min-h-screen w-full bg-slate-800 ">
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={[]} autoConnect>
        <WalletModalProvider>
        <div> <h1 className="mb-10 pt-[15px] pl-[30px] text-[30px] text-white font-bold font-sans ">LAUNCH PAD</h1></div>
        <div className="flex flex-col  items-center">
        <div className="flex justify-center w-full" >
           <div className="mr-[5px]"><h1>hi welcome to Launchpad Connect your wallet</h1></div>
          <div >
            <WalletMultiButton />
            <WalletDisconnectButton />
          </div>
        </div>
          <div className=" mt-[100px] p-[10px] text-white shadow-sm border border-slate-200 rounded-lg ml-[15px] mr-[15px]">
          <TokenLauchpad/>
          </div>
          </div>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
    </div>
  );
}

export default App;
