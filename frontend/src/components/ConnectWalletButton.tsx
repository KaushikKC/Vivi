// components/ConnectWalletButton.tsx
import React from "react";
import { ConnectKitButton } from "connectkit";
import { IoWallet } from "react-icons/io5";

interface ConnectWalletButtonProps {
  className?: string;
}

export const ConnectWalletButton: React.FC<ConnectWalletButtonProps> = ({
  className = "",
}) => {
  return (
    <ConnectKitButton.Custom>
      {({ isConnected, show, truncatedAddress, ensName }) => {
        return (
          <button
            onClick={show}
            className={`flex items-center justify-center gap-2 bg-black bg-opacity-40 font-semibold backdrop-blur-md p-4 text-[20px] rounded-full ${className}`}
          >
            <IoWallet />
            {isConnected ? ensName ?? truncatedAddress : "Connect Wallet"}
          </button>
        );
      }}
    </ConnectKitButton.Custom>
  );
};
