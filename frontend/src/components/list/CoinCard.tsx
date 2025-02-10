import React from "react";
import Image from "next/image";
import Link from "next/link";
import truncateAddress from "@/utils/move/format/truncateAddress";
import { FiExternalLink } from "react-icons/fi";

interface Props {
	name: string;
	symbol: string;
	description: string;
	imageUrl: string;
	coinAddress?: string;
	timestamp: number;
}

const CoinCard: React.FC<Props> = ({
	name,
	symbol,
	description,
	imageUrl,
	coinAddress,
}) => {
	return (
		<div
			className="bg-[rgba(10,25,47,0.95)] border border-[rgba(58,110,165,0.8)] 
                        shadow-[0_0_20px_rgba(58,110,165,0.8)] rounded-lg p-6 max-w-sm w-full 
                        text-white flex flex-col items-center hover:shadow-blue-500 transition-all duration-300"
		>
			{/* Image with Next.js */}
			<div className="relative w-32 h-32 mb-4">
				<Image
					src={imageUrl}
					alt={name}
					layout="fill"
					objectFit="cover"
					className="rounded-lg shadow-lg"
				/>
			</div>

			{/* Name & Symbol */}
			<Link
				href={`/coin/${coinAddress}`}
				className="mt-4 text-[#E3F2FD] text-lg font-bold underline hover:text-[#64B5F6] transition-all duration-300"
			>
				{name} ({symbol})
			</Link>

			{/* Contract Address */}
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
			<p className="text-gray-300 text-sm text-center mt-2">
				{description}
			</p>
		</div>
	);
};

export default CoinCard;
