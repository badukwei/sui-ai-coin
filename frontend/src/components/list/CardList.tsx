import { useSuiClient } from "@mysten/dapp-kit";
import React, { useEffect, useState } from "react";
import { FaSearch, FaSortAmountDown, FaSortAmountUp } from "react-icons/fa";
import CoinCard from "./CoinCard";
import { MetadataWithTime } from "@/types/move/metadata";
import { createEventAddress } from "@/constants/move/store";

const CardList = () => {
	const [memecoins, setMemecoins] = useState<MetadataWithTime[]>([]);
	const [searchQuery, setSearchQuery] = useState<string>("");
	const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
	
	const suiClient = useSuiClient();

	useEffect(() => {
		const fetchEvents = async () => {
			try {
				const { data } = await suiClient.queryEvents({
					query: {
						MoveEventType: createEventAddress,
					},
				});

				// eslint-disable-next-line
				const parsedMemecoins = data.map((event: any) => ({
					name: event.parsedJson.name,
					symbol: event.parsedJson.symbol,
					description:
						event.parsedJson.description ||
						"No description available.",
					imageUrl: event.parsedJson.url,
					coinAddress: event.parsedJson.ca,
					timestamp: parseInt(event.timestampMs, 10),
				}));

				setMemecoins(parsedMemecoins);
			} catch (error) {
				console.error("Error fetching events:", error);
			}
		};

		fetchEvents();
	}, [suiClient]);

	// Filtering memecoins based on search query
	const filteredMemecoins = memecoins
		.filter(
			(memecoin) =>
				memecoin.name
					.toLowerCase()
					.includes(searchQuery.toLowerCase()) ||
				memecoin.symbol
					.toLowerCase()
					.includes(searchQuery.toLowerCase())
		)
		.sort((a, b) =>
			sortOrder === "asc"
				? a.timestamp - b.timestamp
				: b.timestamp - a.timestamp
		);

	return (
		<div className="w-full max-w-6xl mx-auto mt-6">
			{/* Search & Sorting Section */}
			<div className="flex flex-wrap items-center justify-between bg-gradient-to-br from-gray-900 to-gray-800 p-4 rounded-xl mb-6 shadow-lg">
				{/* Search Box */}
				<div className="relative flex items-center w-full sm:w-1/3 bg-gray-800 rounded-full p-2">
					<FaSearch className="absolute left-4 text-gray-400" />
					<input
						type="text"
						placeholder="Search for tokens"
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className="w-full pl-10 pr-4 bg-transparent text-white focus:ring-0 outline-none placeholder-gray-400"
					/>
				</div>

				{/* Sort Buttons */}
				<div className="flex items-center gap-4 mt-4 sm:mt-0">
					<button
						onClick={() => setSortOrder("asc")}
						className={`flex items-center gap-2 px-6 py-2 rounded-full text-white transition 
                ${
					sortOrder === "asc"
						? "bg-gradient-to-r from-green-400 to-green-600"
						: "bg-gray-700"
				} hover:opacity-90`}
					>
						<FaSortAmountUp /> Oldest
					</button>
					<button
						onClick={() => setSortOrder("desc")}
						className={`flex items-center gap-2 px-6 py-2 rounded-full text-white transition 
                ${
					sortOrder === "desc"
						? "bg-gradient-to-r from-blue-400 to-blue-600"
						: "bg-gray-700"
				} hover:opacity-90`}
					>
						<FaSortAmountDown /> Newest
					</button>
				</div>
			</div>

			{/* Responsive Grid Layout */}
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
				{filteredMemecoins.length > 0 ? (
					filteredMemecoins.map((memecoin, index) => (
						<CoinCard key={index} {...memecoin} />
					))
				) : (
					<p className="text-gray-400">No memecoins found.</p>
				)}
			</div>
		</div>
	);
};

export default CardList;
