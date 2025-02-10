import "@/styles/globals.css";
import type { AppProps } from "next/app";
import {
  createNetworkConfig,
  SuiClientProvider,
  WalletProvider,
} from "@mysten/dapp-kit";
import { getFullnodeUrl } from "@mysten/sui/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";

if (process.env.NODE_ENV === "production") {
  console.log = () => {};
}

const queryClient = new QueryClient();
const { networkConfig } = createNetworkConfig({
	testnet: { url: getFullnodeUrl("testnet") },
});

export default function App({ Component, pageProps }: AppProps) {
  return (
		<QueryClientProvider client={queryClient}>
			<SuiClientProvider
				networks={networkConfig}
				defaultNetwork="testnet"
			>
				<WalletProvider autoConnect>
					<Component {...pageProps} />
					<ToastContainer />
				</WalletProvider>
			</SuiClientProvider>
		</QueryClientProvider>
  );
}
