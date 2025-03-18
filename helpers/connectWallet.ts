import WalletConnectProvider from "@walletconnect/web3-provider";

export const connectWallet = async (
  setAccount: React.Dispatch<React.SetStateAction<string | null>>,
  setButtonText: React.Dispatch<React.SetStateAction<string>>
) => {
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  const isIos = /iPhone|iPad|iPod/.test(navigator.userAgent);

  if (window.ethereum?.isMetaMask) {
    // Conectar si MetaMask está instalado en la web (PC o móvil con MetaMask integrado)
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
    // Si estamos en móvil, usar WalletConnect para vincular MetaMask con la web
    try {
      const provider = new WalletConnectProvider({
        rpc: {
          1: `https://mainnet.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_PROJECT_ID}`,
        },
        qrcode: true, // Mostrar un código QR para que MetaMask lo lea y lo vincule
      });

      // Mostrar el código QR para que MetaMask en la app lo lea y se conecte
      await provider.enable(); // Habilita la conexión y abrirá el código QR

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

  // Si MetaMask no está instalado, redirigir a la App Store o Google Play
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
