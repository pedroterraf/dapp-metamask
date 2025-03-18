import WalletConnectProvider from "@walletconnect/web3-provider";
import { log } from "console";

export const connectWallet = async (
  setAccount: React.Dispatch<React.SetStateAction<string | null>>,
  setButtonText: React.Dispatch<React.SetStateAction<string>>
) => {
  console.log(process.env.API_KEY);

  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  if (window.ethereum?.isMetaMask && !isMobile) {
    // Modo PC: Conectar con MetaMask como siempre
    try {
      const accounts = await window.ethereum.request<string[]>({
        method: "eth_requestAccounts",
      });

      if (accounts.length > 0) {
        setAccount(accounts[0]);
        setButtonText("Wallet Connected");
        return;
      }
    } catch (error) {
      console.error("Error connecting wallet:", error);
      setButtonText("Connection Failed");
      return;
    }
  } else {
    // Modo Móvil: Usar WalletConnect
    try {
      const provider = new WalletConnectProvider({
        rpc: {
          1: `https://mainnet.infura.io/v3/${process.env.API_KEY}`, // Cambia con tu Infura ID
        },
      });

      await provider.enable(); // Abre MetaMask en móvil

      const accounts = provider.accounts;

      if (accounts.length > 0) {
        setAccount(accounts[0]);
        setButtonText("Wallet Connected");
        return;
      }
    } catch (error) {
      console.error("Error connecting wallet:", error);
      setButtonText("Connection Failed");
    }
  }
};
