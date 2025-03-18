import WalletConnectProvider from "@walletconnect/web3-provider";

export const connectWallet = async (
  setAccount: React.Dispatch<React.SetStateAction<string | null>>,
  setButtonText: React.Dispatch<React.SetStateAction<string>>
) => {
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  const isIos = /iPhone|iPad|iPod/.test(navigator.userAgent);

  if (window.ethereum?.isMetaMask) {
    // Modo de PC o móvil con MetaMask integrado (Google)
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

      await provider.enable(); // Habilitar WalletConnect y abrir la app

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

  // Si MetaMask está instalado, intentar abrir la app directamente
  if (isMobile) {
    const metamaskUrl = isIos
      ? "metamask://"
      : "https://metamask.app.link/dapp/YOUR_DAPP_URL";

    window.location.href = metamaskUrl;

    // redirige a la App Store o Google Play
    setTimeout(() => {
      if (isIos) {
        window.location.href =
          "https://apps.apple.com/us/app/metamask/id1438144202";
      } else {
        window.location.href =
          "https://play.google.com/store/apps/details?id=io.metamask";
      }
    }, 1000);
  }
};
