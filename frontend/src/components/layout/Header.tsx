import React, { useState } from "react";
import Link from "next/link";
import { HiMenu, HiX } from "react-icons/hi";
import CustomConnectButton from "../common/CustomConnectButton";
import CustomDisconnectButton from "../common/CustomDisconnectButton";

interface Props {
	address?: string;
}

const Header: React.FC<Props> = ({ address }) => {
	const [mobileMenu, setMobileMenu] = useState(false);

	return (
		<header
			className="flex items-center justify-between w-full p-4 md:px-8"
			style={{
				background:
					"linear-gradient(90deg, rgba(10,25,47,0.95) 0%, rgba(20,40,60,0.95) 100%)",
				borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
				boxShadow: "0 2px 5px rgba(0, 0, 0, 0.3)",
			}}
		>
			<h1 className="text-xl font-bold text-white">AI SUI COIN</h1>

			<nav className="hidden md:flex space-x-8">
				<Link
					href="/"
					className="text-white font-semibold text-lg px-3 py-2 hover:text-blue-400 underline decoration-transparent hover:decoration-white transition-all"
				>
					Home
				</Link>
				<Link
					href="/list"
					className="text-white font-semibold text-lg px-3 py-2 hover:text-blue-400 underline decoration-transparent hover:decoration-white transition-all"
				>
					Coin List
				</Link>
			</nav>

			<div className="hidden md:flex space-x-4">
				<CustomConnectButton address={address} />
				<CustomDisconnectButton address={address} />
			</div>

			<div className="md:hidden flex items-center">
				<button
					onClick={() => setMobileMenu(!mobileMenu)}
					className="text-white text-2xl focus:outline-none"
				>
					{mobileMenu ? <HiX /> : <HiMenu />}
				</button>
			</div>

			{mobileMenu && (
				<div className="fixed inset-0 bg-black bg-opacity-90 flex flex-col items-center justify-center z-50">
					<button
						onClick={() => setMobileMenu(false)}
						className="absolute top-5 right-5 text-white text-3xl"
					>
						<HiX />
					</button>
					<nav className="flex flex-col space-y-6 text-center">
						<Link
							href="/"
							className="text-white text-2xl font-semibold px-4 py-2 hover:text-blue-400 underline decoration-transparent hover:decoration-white transition-all"
							onClick={() => setMobileMenu(false)}
						>
							Home
						</Link>
						<Link
							href="/list"
							className="text-white text-2xl font-semibold px-4 py-2 hover:text-blue-400 underline decoration-transparent hover:decoration-white transition-all"
							onClick={() => setMobileMenu(false)}
						>
							Coin List
						</Link>
					</nav>

					<div className="mt-8 flex flex-col space-y-4">
						<CustomConnectButton address={address} />
						<CustomDisconnectButton address={address} />
					</div>
				</div>
			)}
		</header>
	);
};

export default Header;
