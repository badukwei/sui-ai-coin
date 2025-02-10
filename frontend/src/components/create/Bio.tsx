import { AIConfig } from "@/types/ai/eliza/character";
import React, { useState } from "react";
import AtomaChatModel from "../modal/AtomaChatModel";

interface Props {
	config: AIConfig;
	handleArrayChange: (field: string, index: number, value: string) => void;
	handleRemoveArrayItem: <K extends keyof AIConfig>(
		field: K,
		index: number
	) => void;
	handleAddArrayItem: <K extends keyof AIConfig>(field: K) => void;
	handleAddArrayItemWithContent: <K extends keyof AIConfig>(
		field: K,
		content: string
	) => void;
}

const Bio: React.FC<Props> = ({
	config,
	handleArrayChange,
	handleRemoveArrayItem,
	handleAddArrayItem,
	handleAddArrayItemWithContent,
}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleSubmit = (content: string) => {
		handleAddArrayItemWithContent("bio", content);
	};
	return (
		<div className="mt-4">
			<div className="flex justify-between items-center mt-6 mb-2">
				<h3 className="text-lg font-semibold">Bio</h3>
				<button
					onClick={() => setIsModalOpen(true)}
					className="p-2 bg-green-500 text-white rounded transition 
                               hover:bg-green-600 active:scale-95"
				>
					Create with Atoma AI
				</button>
			</div>
			{config.bio.map((item, index) => (
				<div key={index} className="flex items-center gap-2 mb-2">
					<input
						type="text"
						value={item}
						onChange={(e) =>
							handleArrayChange("bio", index, e.target.value)
						}
						className="w-full p-2 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
					/>
					<button
						onClick={() => handleRemoveArrayItem("bio", index)}
						className="p-2 bg-red-500 text-white rounded transition 
                                   hover:bg-red-600 active:scale-95"
					>
						✖
					</button>
				</div>
			))}

			<button
				onClick={() => handleAddArrayItem("bio")}
				className="p-2 bg-blue-500 text-white rounded w-full mt-2 transition 
                           hover:bg-blue-600 active:scale-95"
			>
				+ Add Bio
			</button>

			<AtomaChatModel
				isOpen={isModalOpen}
				handleSubmit={handleSubmit}
				onClose={() => setIsModalOpen(false)}
			/>
		</div>
	);
};

export default Bio;
