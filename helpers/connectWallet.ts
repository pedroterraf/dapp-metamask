import WalletConnectProvider from "@walletconnect/web3-provider";

export const connectWallet = async (
  setAccount: React.Dispatch<React.SetStateAction<string | null>>,
  setButtonText: React.Dispatch<React.SetStateAction<string>>
) => {
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  const isIos = /iPhone|iPad|iPod/.test(navigator.userAgent);

  if (window.ethereum?.isMetaMask) {
    // Conectar usando MetaMask en PC o móvil con navegador compatible
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
  }

  if (isMobile) {
    try {
      const provider = new WalletConnectProvider({
        rpc: {
          1: `https://mainnet.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_PROJECT_ID}`,
        },
        bridge: "https://bridge.walletconnect.org",
        qrcodeModalOptions: {
          mobileLinks: ["metamask"], // Especificar las apps móviles compatibles
          desktopLinks: ["metamask"], // Especificar las apps de escritorio compatibles
        },
      });

      // Habilitar WalletConnect y abrir la app
      await provider.enable();

      const accounts = provider.accounts;
      if (accounts.length > 0) {
        setAccount(accounts[0]);
        setButtonText("Wallet Connected");
        return;
      }
    } catch (error) {
      console.error("Error connecting wallet via WalletConnect:", error);
      setButtonText("Connection Failed");
    }
  }

  // Si no tiene MetaMask instalado, NO redirigir inmediatamente
  console.warn("MetaMask not found, prompting user to install.");

  setTimeout(() => {
    if (isIos) {
      window.location.href = "https://metamask.app.link/dapp/YOUR_DAPP_URL";
    } else {
      window.location.href = "https://metamask.app.link";
    }
  }, 3000);
};
