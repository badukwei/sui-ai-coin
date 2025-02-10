import { useConnectWallet, useWallets } from "@mysten/dapp-kit";
import React, { useState } from "react";

interface Props {
	address?: string;
}

const CustomConnectButton: React.FC<Props> = ({ address }) => {
	const wallets = useWallets();
	const { mutate: connect } = useConnectWallet();
	const [showWalletDialog, setShowWalletDialog] = useState(false);

	if (address) return null;

	return (
		<div className="flex flex-col items-center">
			<button
				onClick={() => setShowWalletDialog(true)}
				style={{
					padding: "12px 24px",
					backgroundColor: "rgba(255, 255, 255, 0.1)",
					border: "1px solid rgba(255, 255, 255, 0.3)",
					color: "white",
					borderRadius: "8px",
					boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
					cursor: "pointer",
					transition: "all 0.3s ease, transform 0.1s ease-in-out",
				}}
				onMouseEnter={(e) => {
					(e.currentTarget as HTMLElement).style.backgroundColor =
						"rgba(255, 255, 255, 0.2)";
					(e.currentTarget as HTMLElement).style.transform =
						"scale(1.05)";
				}}
				onMouseLeave={(e) => {
					(e.currentTarget as HTMLElement).style.backgroundColor =
						"rgba(255, 255, 255, 0.1)";
					(e.currentTarget as HTMLElement).style.transform =
						"scale(1)";
				}}
				onMouseDown={(e) => {
					(e.currentTarget as HTMLElement).style.transform =
						"scale(0.95)";
				}}
				onMouseUp={(e) => {
					(e.currentTarget as HTMLElement).style.transform =
						"scale(1.05)";
				}}
			>
				Connect Wallet
			</button>

			{showWalletDialog && (
				<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50">
					<div className="bg-gray-900 text-white rounded-lg shadow-lg p-6 w-80 text-center">
						<h2 className="text-2xl font-bold mb-4">
							Select Wallet
						</h2>
						<ul className="space-y-3">
							{wallets.map((wallet) => (
								<li key={wallet.name}>
									<button
										onClick={() => {
											connect(
												{ wallet },
												{
													onSuccess: () =>
														console.log(
															`Connected to ${wallet.name}!`
														),
												}
											);
											setShowWalletDialog(false); // 連接後關閉對話框
										}}
										className="w-full px-4 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition"
									>
										{wallet.name}
									</button>
								</li>
							))}
						</ul>
						<button
							onClick={() => setShowWalletDialog(false)}
							className="mt-5 px-4 py-2 text-gray-300 hover:text-white border border-gray-500 rounded-lg transition"
						>
							Cancel
						</button>
					</div>
				</div>
			)}
		</div>
	);
};

export default CustomConnectButton;
