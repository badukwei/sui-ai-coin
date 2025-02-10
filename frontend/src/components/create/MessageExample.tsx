import { AIConfig } from "@/types/ai/eliza/character";
import React, { useState } from "react";
import AtomaMessageExampleModal from "../modal/AtomaMessageExampleModal";

interface Props {
	config: AIConfig;
	handleMessageExampleChange: (
		pairIndex: number,
		messageIndex: 0 | 1,
		value: string
	) => void;
	handleAddMessageExample: () => void;
	handleRemoveMessageExample: (pairIndex: number) => void;
	handleAddWithContentMessageExample: (
		userMessage: string,
		botResponse: string
	) => void;
}

const MessageExample: React.FC<Props> = ({
	config,
	handleMessageExampleChange,
	handleAddMessageExample,
	handleRemoveMessageExample,
	handleAddWithContentMessageExample,
}) => {
	const [isModalOpen, setIsModalOpen] = useState(false);

	const handleSubmit = (userMessage: string, botResponse: string) => {
		handleAddWithContentMessageExample(userMessage, botResponse);
	};
	return (
		<div className="mt-4">
			<h3 className="text-lg font-semibold mt-6 mb-2">
				Message Examples
			</h3>
			{config.messageExamples.map((examplePair, pairIndex) => (
				<div
					key={pairIndex}
					className="bg-gray-800 p-4 rounded-lg mb-4"
				>
					{/* First User ("{{user1}}") */}
					<label className="block text-sm text-gray-400">
						User Prompt :
					</label>
					<input
						type="text"
						value={examplePair[0].content.text}
						onChange={(e) =>
							handleMessageExampleChange(
								pairIndex,
								0,
								e.target.value
							)
						}
						className="w-full p-2 rounded bg-gray-700 text-white mb-2"
					/>

					{/* Second User (config.name) */}
					<label className="block text-sm text-gray-400">
						Response :
					</label>
					<input
						type="text"
						value={examplePair[1].content.text}
						onChange={(e) =>
							handleMessageExampleChange(
								pairIndex,
								1,
								e.target.value
							)
						}
						className="w-full p-2 rounded bg-gray-700 text-white mb-2"
					/>

					{/* Remove Button */}
					<button
						onClick={() => handleRemoveMessageExample(pairIndex)}
						className="mt-2 w-full p-2 rounded text-white transition 
                                bg-red-500 hover:bg-red-600 active:scale-95"
					>
						✖ Remove Example
					</button>
				</div>
			))}

			{/* Add New Example Pair Button */}
			<div className="flex gap-4 mt-2 w-full">
				<button
					onClick={handleAddMessageExample}
					className="flex-1 p-2 bg-blue-500 text-white rounded"
				>
					+ Add Message Example
				</button>
				<button
					onClick={() => setIsModalOpen(true)}
					className="flex-1 p-2 rounded text-white transition 
                                bg-green-500 hover:bg-green-600 active:scale-95"
				>
					Create with Atoma AI
				</button>
			</div>

			<AtomaMessageExampleModal
				isOpen={isModalOpen}
				handleSubmit={handleSubmit}
				onClose={() => setIsModalOpen(false)}
			/>
		</div>
	);
};

export default MessageExample;
