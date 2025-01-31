import { useCurrentWallet } from "@mysten/dapp-kit";
import "@mysten/dapp-kit/dist/index.css";
import CustomConnectButton from "@/components/common/CustomConnectButton";
import CustomDisconnectButton from "@/components/common/CustomDisconnectButton";
import CreateCoinForm from "@/components/home/CreateCoinForm";
import BasicModal from "@/components/modal/ErrorModal";
import ErrorModal from "@/components/modal/ErrorModal";

export default function Home() {
	// sui
	const { currentWallet } = useCurrentWallet();
	const address = currentWallet?.accounts?.[0]?.address;

	return (
		<div className="flex flex-col min-h-screen">
			{/* Header */}
			<header
				className="flex items-center justify-between w-full p-4"
				style={{
					background:
						"linear-gradient(90deg, rgba(10,25,47,0.95) 0%, rgba(20,40,60,0.95) 100%)",
					borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
					boxShadow: "0 2px 5px rgba(0, 0, 0, 0.3)",
				}}
			>
				<h1 className="text-lg font-bold text-white">AI SUI MEME</h1>
				<CustomConnectButton address={address} />
				<CustomDisconnectButton address={address} />
			</header>

			{/* Main Content */}
			<main
				className="flex items-center flex-1 flex-col px-4 gap-20 py-20"
				style={{
					background:
						"radial-gradient(circle, rgba(58,110,165,0.5) 0%, rgba(10,25,47,1) 70%, rgba(5,15,30,1) 100%)",
				}}
			>
				<section className="relative flex flex-col items-center justify-center text-center">
					{/* Hero Content */}
					<div>
						<h2 className="text-4xl lg:text-6xl font-extrabold text-white leading-tight">
							Transform Your Ideas into Memecoins
						</h2>
						<p className="text-gray-400 text-lg lg:text-xl mt-4">
							Simply enter your text, and our AI will help you
							create a unique memecoin on the Sui blockchain.
						</p>

						<div className="flex flex-col md:flex-row items-center justify-center gap-4 mt-8">
							<button className="px-6 py-3 text-lg font-medium bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all">
								Start Creating →
							</button>
							<button className="px-6 py-3 text-lg font-medium bg-transparent text-white border border-gray-500 rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all">
								Learn How It Works
							</button>
						</div>
					</div>

					{/* Hero Illustration */}
					<div className="mt-16">
						<div className="w-full max-w-3xl mx-auto bg-gradient-to-b from-gray-900 via-black to-gray-800 rounded-lg shadow-2xl p-10">
							<p className="text-white text-lg">
								Empowering creativity with AI and blockchain.
								Your next viral token is just a few words away.
							</p>
						</div>
					</div>
				</section>
				<CreateCoinForm address={address} />
			</main>
		</div>
	);
}
