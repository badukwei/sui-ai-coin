import * as React from "react";
import Modal from "@mui/material/Modal";
import { FaCheckCircle } from "react-icons/fa";
import { IMetadata } from "@/types/move/metadata";
import Link from "next/link";
import truncateAddress from "@/utils/move/format/truncateAddress";
import { FiExternalLink } from "react-icons/fi";
import Image from "next/image";

interface Props {
  isOpen: boolean;
  memecoin: IMetadata;
  handleClose: () => void;
}

const SuccessModal: React.FC<Props> = ({ isOpen, memecoin, handleClose }) => {
  return (
		<Modal
			open={isOpen}
			onClose={handleClose}
			aria-labelledby="modal-title"
			aria-describedby="modal-description"
		>
			<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
				<div
					className="bg-[rgba(10,25,47,0.95)] border border-[rgba(58,110,165,0.8)] shadow-[0_0_20px_rgba(58,110,165,0.8)] 
                    rounded-lg p-12 max-w-md w-full text-center flex flex-col"
				>
					{/* ✅ Success Icon */}
					<div className="flex items-center justify-center gap-2 text-[#4CAF50] font-bold text-xl">
						<FaCheckCircle className="text-green-400 text-2xl" />
						<span>Memecoin Created Successfully!</span>
					</div>

					{/* 🌟 Memecoin Image */}
					<div className="mt-4 flex justify-center">
						<Image
							src={memecoin.imageUrl}
							alt={memecoin.name}
							width={128}
							height={128}
							className="rounded-lg shadow-lg"
						/>
					</div>

					{/* 🔹 Memecoin Info */}
					<Link
						href={`create/${memecoin.coinAddress}`}
						className="mt-4 text-[#E3F2FD] text-lg font-bold underline hover:text-[#64B5F6] transition-all duration-300"
					>
						{memecoin.name} ({memecoin.symbol})
					</Link>
					<p className="mt-2 text-[#B0BEC5] text-md flex items-center justify-center gap-1">
						Coin Address:{" "}
						<Link
							href={`https://testnet.suivision.xyz/coin/${memecoin.coinAddress}`}
							className="text-[#90CAF9] underline hover:text-[#64B5F6] flex items-center gap-1"
							target="_blank"
							rel="noopener noreferrer"
						>
							{truncateAddress(memecoin.coinAddress)}
							<FiExternalLink className="inline-block text-lg" />
						</Link>
					</p>
					<p className="mt-2 text-[#B0BEC5] text-md">
						{memecoin.description}
					</p>

					<div className="mt-6 flex justify-center gap-4">
						{/* Provide Feedback Button as a Link */}
						<Link
							href="https://forms.gle/WgybJUgFN9d7XVTY8"
							target="_blank"
							rel="noopener noreferrer"
							className="w-40 bg-blue-500 text-white px-5 py-2 rounded-lg 
                   hover:bg-blue-600 hover:shadow-[0_0_10px_rgba(33,150,243,1)] 
                   transition-all duration-300 text-center flex items-center justify-center"
						>
							Feedback
						</Link>

						{/* Close Button */}
						<button
							onClick={handleClose}
							className="w-40 bg-gray-500 text-white px-5 py-2 rounded-lg 
                   hover:bg-gray-600 hover:shadow-[0_0_10px_rgba(158,158,158,1)] 
                   transition-all duration-300"
						>
							Close
						</button>
					</div>
				</div>
			</div>
		</Modal>
  );
};

export default SuccessModal;
