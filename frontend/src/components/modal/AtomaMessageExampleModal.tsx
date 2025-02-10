import React, { useState } from "react";
import Modal from "@mui/material/Modal";
import fetchAtoma from "@/utils/ai/atomaAI";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { FiX } from "react-icons/fi"; // Import close icon

interface Props {
	isOpen: boolean;
	onClose: () => void;
	handleSubmit: (userMessage: string, botResponse: string) => void;
}

const AtomaMessageExampleModal: React.FC<Props> = ({
	isOpen,
	onClose,
	handleSubmit,
}) => {
	const [question, setQuestion] = useState("");
	const [inputText, setInputText] = useState("");
	const [outputText, setOutputText] = useState("");

	const atomaMutation = useMutation({
		mutationKey: ["fetch_atoma", inputText],
		mutationFn: (message: string) => fetchAtoma(message),
		onSuccess: (response: string) => {
			console.log("AI Response:", response);
			setOutputText(response);
		},
		onError: (error) => {
			console.error("Error fetching AI response:", error);
			setOutputText("");
			toast.error("Error fetching AI response!");
		},
	});

	const handleCreate = () => {
		if (!question || !inputText) {
			toast.error("Please fill all the fields!");
			return;
		}
		setOutputText("Generating response...");
		const modifyText = `Question is: ${question}. prompt is: ${inputText}. Then create an answer`;
		atomaMutation.mutate(modifyText);
	};

	const handleClose = () => {
		setQuestion("");
		setInputText("");
		setOutputText("");
		onClose();
	};

	return (
		<Modal
			open={isOpen}
			onClose={onClose}
			aria-labelledby="input-output-modal"
		>
			<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 px-4">
				<div
					className="p-12 bg-[rgba(10,25,47,0.95)] border border-[rgba(58,110,165,0.8)] 
                                shadow-[0_0_20px_rgba(58,110,165,0.8)] rounded-lg max-w-3xl w-full 
                                text-center flex flex-col gap-6"
				>
					{/* Title */}
					<h2 className="text-2xl font-bold text-[#4FC3F7]">
						Atoma AI Chat
					</h2>

					{/* User Question Input Field */}
					<div className="relative">
						<input
							type="text"
							value={question}
							onChange={(e) => setQuestion(e.target.value)}
							className="w-full p-3 rounded bg-gray-900 text-white border border-gray-700 
                                       focus:outline-none focus:ring-2 focus:ring-blue-400"
							placeholder="Enter user question..."
						/>
						{question && (
							<button
								onClick={() => setQuestion("")}
								className="absolute top-2 right-2 p-1 rounded-full bg-gray-700 hover:bg-gray-600 
                                           text-white transition duration-300"
								title="Clear question"
							>
								<FiX className="text-lg" />
							</button>
						)}
					</div>

					{/* Input Textarea */}
					<div className="relative">
						<textarea
							value={inputText}
							onChange={(e) => setInputText(e.target.value)}
							className="w-full p-3 rounded bg-gray-900 text-white border border-gray-700 
                                       focus:outline-none focus:ring-2 focus:ring-blue-400"
							rows={4}
							placeholder="Enter your prompt..."
						/>
						{inputText && (
							<button
								onClick={() => setInputText("")}
								className="absolute top-2 right-2 p-1 rounded-full bg-gray-700 hover:bg-gray-600 
                                           text-white transition duration-300"
								title="Clear input"
							>
								<FiX className="text-lg" />
							</button>
						)}
					</div>

					{/* 🎯 Output Box */}
					<div className="relative">
						<div
							className="w-full p-3 rounded border border-gray-700 bg-[rgba(255,255,255,0.05)] 
                                        min-h-[80px] text-[#B0BEC5]"
						>
							{atomaMutation.isPending
								? "Generating..."
								: outputText ||
								  "Generated output will appear here..."}
						</div>
						{outputText && (
							<button
								onClick={() => setOutputText("")}
								className="absolute top-2 right-2 p-1 rounded-full bg-gray-700 hover:bg-gray-600 
                                           text-white transition duration-300"
								title="Clear output"
							>
								<FiX className="text-lg" />
							</button>
						)}
					</div>

					{/* 🚀 Action Buttons */}
					<div className="flex justify-center gap-4">
						<button
							onClick={handleClose}
							disabled={atomaMutation.isPending}
							className="px-5 py-2 rounded-lg bg-[rgba(58,110,165,0.8)] text-[#E3F2FD] 
                                       hover:bg-[rgba(58,110,165,1)] hover:shadow-[0_0_10px_rgba(58,110,165,1)] 
                                       transition-all duration-300"
						>
							Close
						</button>
						{!outputText ? (
							<button
								onClick={handleCreate}
								className={`px-5 py-2 rounded-lg text-white transition-all duration-300 ${
									atomaMutation.isPending
										? "bg-gray-500 cursor-not-allowed"
										: "bg-blue-500 hover:bg-blue-600 hover:shadow-[0_0_10px_rgba(58,110,165,1)]"
								}`}
								disabled={atomaMutation.isPending}
							>
								Create
							</button>
						) : (
							<button
								onClick={() => {
									handleSubmit(question, outputText);
									handleClose();
								}}
								className={`px-5 py-2 rounded-lg text-white transition-all duration-300 ${
									atomaMutation.isPending
										? "bg-gray-500 cursor-not-allowed"
										: "bg-blue-500 hover:bg-blue-600 hover:shadow-[0_0_10px_rgba(58,110,165,1)]"
								}`}
								disabled={
									atomaMutation.isPending ||
									!outputText ||
									!question
								}
							>
								Submit
							</button>
						)}
					</div>
				</div>
			</div>
		</Modal>
	);
};

export default AtomaMessageExampleModal;
