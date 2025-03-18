import WalletConnectProvider from "@walletconnect/web3-provider";

export const connectWallet = async (
  setAccount: React.Dispatch<React.SetStateAction<string | null>>,
  setButtonText: React.Dispatch<React.SetStateAction<string>>
) => {
  console.log("Infura Project ID:", process.env.NEXT_PUBLIC_INFURA_PROJECT_ID);

  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  const isIos = /iPhone|iPad|iPod/.test(navigator.userAgent);

  if (window.ethereum?.isMetaMask) {
    // PC o móvil con MetaMask integrado (Google)
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
    // Modo Móvil: Conectar usando WalletConnect si no hay MetaMask en la web
    try {
      const provider = new WalletConnectProvider({
        rpc: {
          1: `https://mainnet.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_PROJECT_ID}`,
        },
      });

      await provider.enable(); // Abre MetaMask en el móvil y conecta a la web

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

  // Si no tiene MetaMask, redirigir a la tienda para instalarlo
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
