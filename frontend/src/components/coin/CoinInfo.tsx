import { useSuiClient } from "@mysten/dapp-kit";
import { CoinMetadata } from "@mysten/sui/client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiExternalLink } from "react-icons/fi";
import { useRouter } from "next/router";
import truncateAddress from "@/utils/move/format/truncateAddress";
import { toast } from "react-toastify";
import { configAddress } from "@/constants/move/store";
import { BotInfo } from "@/types/move/bot";

interface CoinInfoProps {
	coinAddress: string;
	address?: string;
}

const CoinInfo: React.FC<CoinInfoProps> = ({ coinAddress, address }) => {
	const [coinData, setCoinData] = useState<CoinMetadata | null>(null);
	const [totalBalance, setTotalBalance] = useState<number>(0);
	const [botData, setBotData] = useState<BotInfo | null>(null);
	const suiClient = useSuiClient();
	const router = useRouter();

	useEffect(() => {
		const fetchCoinData = async () => {
			try {
				const data = await suiClient.getCoinMetadata({
					coinType: coinAddress,
				});
				setCoinData(data);
				console.log("Fetched Coin Data:", data);
			} catch (error) {
				console.error("Error fetching coin data:", error);
				toast.error("Can't find the coin!");
			}
		};

		if (coinAddress) {
			fetchCoinData();
		}
	}, [coinAddress, suiClient]);

	useEffect(() => {
		const run = async () => {
			const name = {
				type: "0x1::string::String",
				value: coinAddress,
			};
			try {
				const { data } = await suiClient.getDynamicFieldObject({
					parentId: configAddress,
					name: name,
				});
				const objectId = data?.objectId;
				if (!objectId) throw new Error();
				const response = await suiClient.getObject({
					id: objectId,
					options: {
						showContent: true,
					},
				});
				const object = response.data;
				if (object?.content?.dataType !== "moveObject")
					throw new Error();
				const botInfo = object.content.fields as unknown as BotInfo;
				console.log(botInfo);
				setBotData(botInfo);
			} catch (error) {
				console.log(error);
			}
		};
		run();
	}, [coinAddress, suiClient]);

	useEffect(() => {
		const run = async () => {
			if (!address || !coinAddress) return;
			const { data } = await suiClient.getCoins({
				owner: address,
				coinType: coinAddress,
			});

			let totalBalance = 0;
			for (const coin of data) {
				totalBalance += Number(coin.balance);
			}
			console.log(totalBalance);
			setTotalBalance(totalBalance);
		};
		run();
	}, [address, suiClient, coinAddress]);

	// Determine current route and set appropriate link
	const isCoinRoute = router.pathname.startsWith("/coin/");
	const dynamicLink = isCoinRoute
		? `/create/${coinAddress}`
		: `/coin/${coinAddress}`;
	const linkText = isCoinRoute ? "Update AI agent" : "Chat With AI agent";

	return (
		<div className="relative w-full max-w-3xl bg-gray-800 text-white p-6 rounded-lg text-center shadow-lg">
			<div className="absolute top-4 right-4">
				<Link
					href={dynamicLink}
					className="px-5 py-2 rounded-lg bg-[rgba(255,255,255,0.1)] text-[#E3F2FD] border border-[rgba(255,255,255,0.2)] 
               backdrop-blur-md hover:bg-[rgba(255,255,255,0.2)] hover:border-[rgba(255,255,255,0.4)] 
               hover:shadow-[0_0_15px_rgba(58,110,165,0.6)] transition-all duration-300"
				>
					{linkText}
				</Link>
			</div>

			{coinData ? (
				<>
					{/* Image */}
					{coinData.iconUrl && (
						<div className="flex justify-center mb-4">
							<Image
								src={coinData.iconUrl}
								alt={coinData.name}
								width={80}
								height={80}
								className="rounded-full"
							/>
						</div>
					)}

					{/* Symbol */}
					<h2 className="text-2xl font-bold">{coinData.name}</h2>
					<p className="text-lg text-gray-300">
						Symbol: {coinData.symbol}
					</p>

					{/* Link */}
					<p className="mt-2 text-[#B0BEC5] text-md flex items-center justify-center gap-1">
						Coin Address:{" "}
						<Link
							href={`https://testnet.suivision.xyz/coin/${coinAddress}`}
							className="text-[#90CAF9] underline hover:text-[#64B5F6] flex items-center gap-1"
							target="_blank"
							rel="noopener noreferrer"
						>
							{truncateAddress(coinAddress)}
							<FiExternalLink className="inline-block text-lg" />
						</Link>
					</p>

					{/* Description */}
					<p className="text-gray-200 mt-4">{coinData.description}</p>

					{/* Bot Balance */}
					<div className="mt-6 p-4 bg-gray-700 text-white rounded-lg">
						<h3 className="text-lg font-semibold">Bot Balance</h3>
						<p className="text-xl font-bold text-red-400">
							{Number(botData?.token_reserve)} {coinData.symbol}
						</p>
					</div>

					{/* Your Balance */}
					<div className="mt-6 p-4 bg-gray-700 text-white rounded-lg">
						<h3 className="text-lg font-semibold">Your Balance</h3>
						<p className="text-xl font-bold text-green-400">
							{totalBalance} {coinData.symbol}
						</p>
					</div>
				</>
			) : (
				<p>Loading coin data...</p>
			)}
		</div>
	);
};

export default CoinInfo;
