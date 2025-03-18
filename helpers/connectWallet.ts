import { Web3Provider } from "@ethersproject/providers";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { ethers } from "ethers";

export const connectWallet = async (
  setAccount: React.Dispatch<React.SetStateAction<string | null>>,
  setButtonText: React.Dispatch<React.SetStateAction<string>>,
  setBalance: React.Dispatch<React.SetStateAction<string>>
) => {
  // Detecta si el dispositivo es móvil
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  // Detecta si el dispositivo es iOS
  const isIos = /iPhone|iPad|iPod/.test(navigator.userAgent);

  // Si MetaMask está instalado en el navegador (en escritorio o móvil con MetaMask integrado)
  if (window.ethereum?.isMetaMask) {
    try {
      // Solicita las cuentas de MetaMask
      const accounts = await window.ethereum.request<string[]>({
        method: "eth_requestAccounts",
      });

      if (accounts.length > 0) {
        setAccount(accounts[0]);
        setButtonText("Wallet Connected");

        // Crea un proveedor Web3 con la instancia de MetaMask
        const provider = new Web3Provider(window.ethereum);
        // Obtiene el balance de la cuenta conectada
        const balance = await provider.getBalance(accounts[0]);
        // Formatea el balance a un valor legible (en Ether)
        const formattedBalance = ethers.utils.formatEther(balance);
        setBalance(formattedBalance);
        return;
      }
    } catch (error) {
      console.error("Error connecting wallet:", error);
      setButtonText("Connection Failed");
      return;
    }
  }

  // Si el dispositivo es móvil y no se tiene MetaMask, usa WalletConnect para conectar con MetaMask
  if (isMobile) {
    try {
      // Crea un proveedor WalletConnect con el RPC de Ethereum
      const provider = new WalletConnectProvider({
        rpc: {
          1: `https://mainnet.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_PROJECT_ID}`, // Usa Infura como proveedor RPC
        },
        qrcode: true, // Muestra un código QR para que el usuario lo escanee con MetaMask
      });

      // Habilita el proveedor - esto abrirá el código QR
      await provider.enable();
      // Obtiene las cuentas del proveedor WalletConnect
      const accounts = provider.accounts;
      if (accounts.length > 0) {
        setAccount(accounts[0]);
        setButtonText("Wallet Connected");

        // Crea un proveedor Web3 con la instancia de WalletConnect
        const web3Provider = new Web3Provider(provider);
        // Obtiene el balance de la cuenta conectada
        const balance = await web3Provider.getBalance(accounts[0]);
        // Formatea el balance a un valor legible (en Ether)
        const formattedBalance = ethers.utils.formatEther(balance);
        setBalance(formattedBalance);
        return;
      }
    } catch (error) {
      console.error("Error connecting wallet via WalletConnect:", error);
      setButtonText("Connection Failed");
    }
  }

  // Si MetaMask no está disponible o WalletConnect falla, redirige al usuario a la tienda de aplicaciones
  setTimeout(() => {
    if (isIos) {
      window.location.href =
        "https://apps.apple.com/us/app/metamask/id1438144202";
    } else {
      window.location.href =
        "https://play.google.com/store/apps/details?id=io.metamask";
    }
  }, 3000);
};
