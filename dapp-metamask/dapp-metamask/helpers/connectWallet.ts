// Function to connect MetaMask wallet
export const connectWallet = async (
  setAccount: React.Dispatch<React.SetStateAction<string | null>>,
  setButtonText: React.Dispatch<React.SetStateAction<string>>
) => {
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
