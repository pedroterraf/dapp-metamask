export {};

declare global {
  interface EthereumRequestArguments {
    method: string;
    params?: unknown[];
  }

  interface Window {
    ethereum?: {
      isMetaMask?: boolean;
      request: <T = unknown>(args: EthereumRequestArguments) => Promise<T>;
    };
  }
}
