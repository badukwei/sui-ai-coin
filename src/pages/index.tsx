// import { Geist, Geist_Mono } from "next/font/google";
import { useEffect, useState } from "react";
import { FaArrowRight, FaUserCircle } from "react-icons/fa";
import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";
import { fromHex, toHex, toBase64 } from "@mysten/sui/utils";
import {
	useCurrentWallet,
	ConnectButton,
	useSuiClient,
	useDisconnectWallet,
	useSignAndExecuteTransaction,
} from "@mysten/dapp-kit";
import "@mysten/dapp-kit/dist/index.css";
import init from "@mysten/move-bytecode-template";
import fetchOpenAICompletion from "@/utils/ai/openAI";
import { Controller, ControllerRenderProps, useForm } from "react-hook-form";
import updateTemplate from "@/utils/move/template";
import { mintAndTransfer } from "@/utils/move/mint";
import fetchMetadata from "@/utils/ai/openAI";
import delay from "@/utils/common/delay";
import {
	formatCreateImagePrompt,
	formatCreateTemplateResponse,
} from "@/utils/move/format";
import fetchImage from "@/utils/ai/falAI";
import { Transaction } from "@mysten/sui/transactions";

interface FormValues {
	userInput: string;
}

export default function Home() {
	// states
	// form control
	const {
		handleSubmit,
		control,
		reset,
		formState: { errors },
		trigger,
		setValue,
		watch,
		getValues,
	} = useForm<FormValues>({
		defaultValues: {
			userInput: "",
		},
	});

	// sui
	const suiClient = useSuiClient();
	const { currentWallet, connectionStatus } = useCurrentWallet();
	const address = currentWallet?.accounts?.[0].address;
	const { mutate: disconnectWallet } = useDisconnectWallet();
	const { mutateAsync: signAndExecuteTransaction } =
		useSignAndExecuteTransaction({
			execute: async ({ bytes, signature }) =>
				await suiClient.executeTransactionBlock({
					transactionBlock: bytes,
					signature,
					options: {
						showBalanceChanges: true,
						showEffects: true,
						showEvents: true,
						showInput: true,
						showObjectChanges: true,
						showRawEffects: true,
						showRawInput: true,
					},
				}),
		});

	useEffect(() => {
		const initWasm = async () => {
			try {
				await init("/move_bytecode_template_bg.wasm");
				console.log("WASM initialized successfully!");
			} catch (error) {
				console.error("Error initializing WASM:", error);
			}
		};

		initWasm();
	}, []);

	const createCoin = async (data: FormValues) => {
		const { userInput } = data;
		if (!userInput || !address) return;
		try {
			const metadata = await fetchMetadata(userInput);
			console.log(metadata);

			const prompt = formatCreateImagePrompt(metadata);
			const ImageUrl = await fetchImage(prompt);
			console.log(ImageUrl);

			const netWorkResponse = await updateTemplate(
				address,
				metadata,
				ImageUrl,
				signAndExecuteTransaction
			);
			console.log(netWorkResponse);
			const { coinType, treasuryCap, recipient } =
				formatCreateTemplateResponse(netWorkResponse);
			if (!coinType || !treasuryCap || !recipient)
				throw new Error(`API error: Fail create the coin`);
			const result = await mintAndTransfer(
				coinType,
				treasuryCap,
				recipient,
				signAndExecuteTransaction
			);
			console.log(result);
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-100 via-white to-blue-50">
			{/* Header */}
			<header className="flex items-center justify-between w-full p-4 bg-white shadow-md">
				<h1 className="text-lg font-bold text-gray-700">AI SUI MEME</h1>
				<ConnectButton
					style={{
						paddingTop: "12px",
						paddingRight: "24px",
						paddingLeft: "24px",
						paddingBottom: "12px", 
					}}
				/>
			</header>

			{/* Main Content */}
			<main className="flex items-center justify-center flex-1">
				<div className="relative w-full max-w-2xl h-64 p-4 border border-gray-300 rounded-lg bg-white shadow-lg">
					{/* Textarea */}
					<form onSubmit={handleSubmit(createCoin)}>
						<Controller
							name="userInput"
							control={control}
							render={({ field }) => (
								<textarea
									placeholder="Type your message here..."
									className="w-full h-full p-4 pr-12 border-none focus:outline-none resize-none font-sans text-gray-800"
									value={field.value}
									onChange={field.onChange}
								></textarea>
							)}
						/>

						{/* Send Button */}
						<button
							type="submit"
							className="absolute bottom-4 right-4 flex items-center justify-center w-10 h-10 text-white bg-blue-500 rounded-full shadow-md hover:bg-blue-600 focus:ring-2 focus:ring-blue-400 focus:outline-none"
							aria-label="Send"
						>
							<FaArrowRight size={16} />
						</button>
					</form>
				</div>
			</main>
		</div>
	);
}
