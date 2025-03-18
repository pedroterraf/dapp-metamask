// Function to disconnect wallet
export const disconnectWallet = (
  setAccount: React.Dispatch<React.SetStateAction<string | null>>,
  setButtonText: React.Dispatch<React.SetStateAction<string>>
) => {
  setAccount(null);
  setButtonText("Let's start");
};
