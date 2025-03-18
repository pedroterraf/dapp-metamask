"use client";

import { useState } from "react";
import styles from "./ButtonWallet.module.css";
import { connectWallet } from "@/helpers/connectWallet";
import { disconnectWallet } from "@/helpers/disconnectWallet";

export default function ButtonWallet() {
  const [buttonText, setButtonText] = useState<string>("Let's start");
  const [account, setAccount] = useState<string | null>(null);

  return (
    <div className={styles.navbar}>
      <button
        className={styles.button}
        onClick={() => connectWallet(setAccount, setButtonText)}
      >
        {buttonText}
      </button>
      {account && (
        <>
          <span className={styles.account}>{account}</span>
          <button
            className={styles.disconnectButton}
            onClick={() => disconnectWallet(setAccount, setButtonText)}
          >
            Disconnect
          </button>
        </>
      )}
    </div>
  );
}
