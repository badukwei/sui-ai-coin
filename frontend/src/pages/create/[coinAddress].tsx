import React from "react";
import Header from "@/components/layout/Header";
import { useCurrentWallet } from "@mysten/dapp-kit";
import { useRouter } from "next/router";
import CoinInfo from "@/components/coin/CoinInfo";
import AIConfigForm from "@/components/create/ModelForm";

const CoinModelFormPage = () => {
	const { currentWallet } = useCurrentWallet();
	const address = currentWallet?.accounts?.[0]?.address;

	const router = useRouter();
	const { coinAddress } = router.query;

	const normalizedCoinAddress =
		typeof coinAddress === "string" ? coinAddress : undefined;

	return (
		<div className="flex flex-col min-h-screen">
			<Header address={address} />
			<main
				className="flex items-center flex-1 flex-col px-4 gap-10 py-20 w-full"
				style={{
					background:
						"radial-gradient(circle, rgba(58,110,165,0.5) 0%, rgba(10,25,47,1) 70%, rgba(5,15,30,1) 100%)",
				}}
			>
				{normalizedCoinAddress && (
					<CoinInfo
						coinAddress={normalizedCoinAddress}
						address={address}
					/>
				)}
				{normalizedCoinAddress && (
					<AIConfigForm
						coinAddress={normalizedCoinAddress}
						address={address}
					/>
				)}
			</main>
		</div>
	);
};

export default CoinModelFormPage;
