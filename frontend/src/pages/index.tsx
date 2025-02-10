import { useCurrentWallet } from "@mysten/dapp-kit";
import "@mysten/dapp-kit/dist/index.css";
import CreateCoinForm from "@/components/home/CreateCoinForm";
import { useRef, useState } from "react";
import IntroductionModal from "@/components/modal/IntroductionModal";
import { TypeAnimation } from "react-type-animation";
import Header from "@/components/layout/Header";

export default function Home() {
	// states
	const [isIntroOpen, setIsIntroOpen] = useState<boolean>(false);

	// ref
	const createCoinFormRef = useRef<{ focusTextarea: () => void } | null>(
		null
	);

	// sui
	const { currentWallet } = useCurrentWallet();
	const address = currentWallet?.accounts?.[0]?.address;

	return (
		<div className="flex flex-col min-h-screen">
			<Header address={address}/>
			{/* Main Content */}
			<main
				className="flex items-center flex-1  flex-col px-4 gap-20 py-20"
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
							create a unique coin and AI agent on the Sui blockchain.
						</p>

						<div className="flex flex-col md:flex-row items-center justify-center gap-4 mt-8">
							<button
								onClick={() =>
									createCoinFormRef.current?.focusTextarea()
								}
								className="px-6 py-3 text-lg font-medium bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
							>
								Start Creating →
							</button>
							<button
								onClick={() => setIsIntroOpen(true)}
								className="px-6 py-3 text-lg font-medium bg-transparent text-white border border-gray-500 rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all"
							>
								Learn How It Works
							</button>
						</div>
					</div>

					{/* Hero Illustration */}
					<div className="mt-16">
						<div className="w-full max-w-3xl mx-auto bg-gradient-to-b from-gray-900 via-black to-gray-800 rounded-lg shadow-2xl p-10">
							<p className="text-white text-lg">
								<TypeAnimation
									sequence={[
										"Empowering creativity with AI and blockchain.",
										2000,
										"Your next viral token is just a few words away.",
										2000,
									]}
									wrapper="span"
									speed={50}
									repeat={Infinity}
								/>
							</p>
						</div>
					</div>
				</section>
				<CreateCoinForm address={address} ref={createCoinFormRef} />
			</main>
			<IntroductionModal
				isOpen={isIntroOpen}
				handleClose={() => setIsIntroOpen(false)}
			/>
		</div>
	);
}
