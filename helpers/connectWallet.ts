// Function to connect MetaMask wallet
export const connectWallet = async (
  setAccount: React.Dispatch<React.SetStateAction<string | null>>,
  setButtonText: React.Dispatch<React.SetStateAction<string>>
) => {
  // Check if the user is on mobile
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  if (isMobile) {
    if (!window.ethereum?.isMetaMask) {
      const isIos = /iPhone|iPad|iPod/.test(navigator.userAgent);

      if (isIos) {
        window.location.href =
          "https://apps.apple.com/us/app/metamask/id1438144202"; // MetaMask iOS App
        setButtonText("Redirecting to App Store...");
      } else {
        window.location.href =
          "https://play.google.com/store/apps/details?id=io.metamask"; // MetaMask Android App
        setButtonText("Redirecting to Play Store...");
      }

      return;
    }
  }

  if (window.ethereum?.isMetaMask) {
    try {
      const accounts = await window.ethereum.request<string[]>({
        method: "eth_requestAccounts",
      });

      if (accounts.length > 0) {
        setAccount(accounts[0]);
        setButtonText("Wallet Connected");
      }
    } catch (error) {
      console.error("Error connecting wallet:", error);
      setButtonText("Connection Failed");
    }
  } else {
    setButtonText("MetaMask is not installed.");
  }
};
