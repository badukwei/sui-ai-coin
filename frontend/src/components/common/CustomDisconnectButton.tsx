import React from "react";
import { useDisconnectWallet } from "@mysten/dapp-kit";
import { FaSignOutAlt } from "react-icons/fa"; // Import disconnect icon

interface Props {
  address?: string;
}

const CustomDisconnectButton: React.FC<Props> = ({ address }) => {
  const { mutate: disconnect } = useDisconnectWallet();

  if (!address) return null;

  return (
    <button
      onClick={() => disconnect()}
      className="flex items-center justify-center px-6 py-3 bg-transparent text-white rounded-lg border border-white border-opacity-30 shadow-lg"
      style={{
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        border: "1px solid rgba(255, 255, 255, 0.3)",
        borderRadius: "8px",
        boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
        transition: "all 0.3s ease, transform 0.1s ease-in-out",
        cursor: "pointer",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.backgroundColor =
          "rgba(255, 255, 255, 0.2)";
        (e.currentTarget as HTMLElement).style.transform = "scale(1.05)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.backgroundColor =
          "rgba(255, 255, 255, 0.1)";
        (e.currentTarget as HTMLElement).style.transform = "scale(1)";
      }}
      onMouseDown={(e) => {
        (e.currentTarget as HTMLElement).style.transform = "scale(0.95)";
      }}
      onMouseUp={(e) => {
        (e.currentTarget as HTMLElement).style.transform = "scale(1.05)";
      }}
    >
      {/* Display truncated address */}
      <span className="mr-2">{`${address.slice(0, 6)}...${address.slice(
        -4,
      )}`}</span>

      {/* Disconnect icon */}
      <FaSignOutAlt style={{ fontSize: "16px" }} />
    </button>
  );
};

export default CustomDisconnectButton;
