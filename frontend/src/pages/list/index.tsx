import Header from "@/components/layout/Header";
import EventList from "@/components/list/CardList";
import { useCurrentWallet } from "@mysten/dapp-kit";
import React, { useEffect } from "react";

const ListPage = () => {
	const { currentWallet } = useCurrentWallet();
	const address = currentWallet?.accounts?.[0].address;

	useEffect(() => {
		console.log("Wallet Updated:", currentWallet);
	}, [currentWallet]);	

	return (
		<div className="flex flex-col min-h-screen">
			<Header address={address}/>
			<main
				className="flex items-center flex-1 flex-col px-4 gap-20 py-20"
				style={{
					background:
						"radial-gradient(circle, rgba(58,110,165,0.5) 0%, rgba(10,25,47,1) 70%, rgba(5,15,30,1) 100%)",
				}}
			>
                <EventList />
            </main>
		</div>
	);
};

export default ListPage;
