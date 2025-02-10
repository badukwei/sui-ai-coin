import React, { useState } from "react";
import Modal from "@mui/material/Modal";
import { toast } from "react-toastify";
import RoutingToast from "../common/CustomToastMessage/RoutingToast";

interface Props {
	isOpen: boolean;
	onClose: () => void;
	onSubmit: (value: number) => void;
	totalBalance: number;
	coinAddress?: string;
}

const DonateInputModal: React.FC<Props> = ({
	isOpen,
	onClose,
	onSubmit,
	totalBalance,
	coinAddress,
}) => {
	const [inputValue, setInputValue] = useState<number | "">("");

	const handleSubmit = () => {
		if (inputValue !== "") {
			const inputNumber = Number(inputValue);
			if (inputNumber > totalBalance) {
				toast.error(
					<RoutingToast
						message="You don't have enough balance!"
						route={`/create/${coinAddress}`}
						linkMessage="Update bot to get token"
					/>,
					{
						position: "top-right",
						autoClose: 2000,
						closeOnClick: true,
						pauseOnHover: true,
						draggable: true,
					}
				);
				onClose();
				return;
			}
			onSubmit(Number(inputValue));
			setInputValue("");
			onClose();
		}
	};

	return (
		<Modal
			open={isOpen}
			onClose={onClose}
			aria-labelledby="number-input-modal"
		>
			<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 px-4">
				<div
					className="p-8 bg-[rgba(10,25,47,0.95)] border border-[rgba(58,110,165,0.8)] 
                                shadow-[0_0_20px_rgba(58,110,165,0.8)] rounded-lg max-w-md w-full 
                                text-center flex flex-col gap-6"
				>
					{/* 🔢 Title */}
					<h2 className="text-2xl font-bold text-[#4FC3F7]">
						Enter a Number
					</h2>

					{/* 🔢 Number Input */}
					<input
						type="number"
						value={inputValue}
						onChange={(e) =>
							setInputValue(
								e.target.value ? Number(e.target.value) : ""
							)
						}
						className="w-full p-3 rounded bg-gray-900 text-white border border-gray-700 
                                   focus:outline-none focus:ring-2 focus:ring-blue-400"
						placeholder="Enter a number..."
					/>

					{/* 🚀 Action Buttons */}
					<div className="flex justify-center gap-4">
						<button
							onClick={onClose}
							className="px-5 py-2 rounded-lg bg-[rgba(58,110,165,0.8)] text-[#E3F2FD] 
                                       hover:bg-[rgba(58,110,165,1)] hover:shadow-[0_0_10px_rgba(58,110,165,1)] 
                                       transition-all duration-300"
						>
							Close
						</button>
						<button
							type="button"
							disabled={inputValue === ""}
							className="px-4 py-2 text-white rounded-lg transition flex items-center justify-center 
               					bg-gradient-to-r from-yellow-400 to-orange-500 
               					hover:from-yellow-500 hover:to-orange-600 
               					active:scale-95 shadow-lg shadow-orange-400/50"
							onClick={handleSubmit}
						>
							Donate
						</button>
					</div>
				</div>
			</div>
		</Modal>
	);
};

export default DonateInputModal;
