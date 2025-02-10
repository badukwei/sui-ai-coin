import fetchImage from "@/utils/ai/falAI";
import fetchMetadata from "@/utils/ai/openAI";
import formatCreateImagePrompt from "@/utils/move/format/imagePrompt";
import formatCreateTemplateResponse from "@/utils/move/format/templateResponse";
import { createBot } from "@/utils/move/createBot";
import updateTemplate from "@/utils/move/template";
import { useSignAndExecuteTransaction, useSuiClient } from "@mysten/dapp-kit";
import init from "@mysten/move-bytecode-template";
import React, {
	forwardRef,
	useEffect,
	useImperativeHandle,
	useRef,
	useState,
} from "react";
import { Controller, useForm } from "react-hook-form";
import { FaArrowDown, FaArrowRight } from "react-icons/fa";
import ErrorModal from "../modal/ErrorModal";
import LoadingModal from "../modal/LoadingModal";
import SuccessModal from "../modal/SuccessModal";
import { IMetadata } from "@/types/move/metadata";
import CustomConnectButton from "../common/CustomConnectButton";
import { fetcher } from "@/libs/apiFactory";
import { defaultConfig } from "@/constants/ai/botConfig";

interface Props {
	address?: string;
}

interface FormValues {
	userInput: string;
}

const defaultMetadata = {
	symbol: "",
	name: "",
	description: "",
	imageUrl: "",
	coinAddress: "",
};

const CreateCoinForm = forwardRef(({ address }: Props, ref) => {
	// states
	const [error, setError] = useState<string>("");
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [metadata, setMetadata] = useState<IMetadata>(defaultMetadata);

	// refs
	const textareaRef = useRef<HTMLTextAreaElement | null>(null);

	// form
	const {
		handleSubmit,
		control,
		formState: { errors },
	} = useForm<FormValues>({
		defaultValues: {
			userInput: "",
		},
	});

	const suiClient = useSuiClient();
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

	const createCoin = async (data: FormValues) => {
		const { userInput } = data;
		if (!userInput || !address) return;
		try {
			setIsLoading(true);
			const metadata = await fetchMetadata(userInput);
			if (!metadata) throw new Error();

			const prompt = formatCreateImagePrompt(metadata);
			const imageUrl = await fetchImage(prompt);
			if (!imageUrl) throw new Error();

			const netWorkResponse = await updateTemplate(
				address,
				metadata,
				imageUrl,
				signAndExecuteTransaction
			);
			console.log(netWorkResponse);

			const { coinType, coinAddress, treasuryCap, recipient } =
				formatCreateTemplateResponse(netWorkResponse);
			if (!coinType || !treasuryCap || !recipient) throw new Error();

			const botConfig = {
				...defaultConfig,
				name: coinAddress,
			};

			const response = await fetcher({
				url: "/agent/start",
				method: "POST",
				body: { characterJson: botConfig },
			});

			const botId = (response.id as string) || "";
			const botJson = JSON.stringify(botConfig);

			const result = await createBot(
				coinType,
				treasuryCap,
				coinAddress,
				botId,
				metadata.name,
				metadata.symbol,
				metadata.description,
				imageUrl,
				botJson,
				signAndExecuteTransaction
			);
			console.log(result);

			setMetadata({
				...metadata,
				imageUrl,
				coinAddress,
			});
			setIsLoading(false);
		} catch (error) {
			console.error(error);
			setIsLoading(false);
			setError(
				"Something went wrong while creating your memecoin. This could be due to a network issue, blockchain congestion, or an unexpected error. Please check your connection and try again later."
			);
		}
	};

	useImperativeHandle(ref, () => ({
		focusTextarea: () => {
			textareaRef.current?.focus();
		},
	}));

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

	return (
		<section className="w-full flex  flex-col justify-center items-center">
			<h2 className="text-gray-200 text-2xl font-bold p-2 w-full max-w-3xl text-left tracking-wide flex items-center gap-2">
				Create Your Memecoin
				<FaArrowDown className="text-blue-400 text-xl" />
			</h2>

			<form
				className={`relative w-full max-w-3xl h-40 p-4 border rounded-lg shadow-lg bg-gradient-to-br 
                    from-gray-800 via-gray-900 to-black transition-all duration-300 ease-in-out
                    focus-within:ring-4 focus-within:ring-blue-500 focus-within:border-blue-500 focus-within:shadow-blue-500/50
                    ${
						errors.userInput
							? "border-red-500 focus-within:ring-red-500 focus-within:border-red-500 focus-within:shadow-red-500/50"
							: "border-gray-600"
					}`}
				onSubmit={handleSubmit(createCoin)}
			>
				{!address && (
					<div className="absolute inset-0 z-50 bg-black/50 backdrop-blur-md flex flex-col items-center justify-center rounded-lg border border-gray-500/50">
						<CustomConnectButton address={address} />
					</div>
				)}
				{/* Textarea */}
				<Controller
					name="userInput"
					control={control}
					rules={{
						required: "Prompt cannot be empty.",
						maxLength: {
							value: 2000,
							message: "Prompt cannot exceed 2000 characters.",
						},
					}}
					render={({ field }) => (
						<textarea
							{...field}
							placeholder="Type your prompt here..."
							className="w-full h-28 p-4 border-none focus:outline-none resize-none font-sans text-white bg-transparent placeholder-gray-400"
						/>
					)}
				/>

				{/* Submit Button */}
				<div className="absolute bottom-4 right-4">
					<button
						type="submit"
						className={`flex cursor-pointer items-center justify-center w-8 h-8 text-white rounded-full shadow-md 
                            focus:ring-2 focus:outline-none transition-all duration-300
                            ${
								errors.userInput
									? "bg-red-500 hover:bg-red-600 focus:ring-red-500"
									: "bg-blue-500 hover:bg-blue-600 focus:ring-blue-500"
							}`}
						aria-label="Send"
						// disabled={!address || !!error}
					>
						<FaArrowRight size={12} />
					</button>
				</div>
				{/* Error Message */}
				<div className="absolute bottom-4 left-4">
					{errors.userInput && (
						<p className="text-red-400 text-sm mt-1 animate-fade-in">
							{errors.userInput.message}
						</p>
					)}
				</div>
			</form>

			<LoadingModal
				isOpen={isLoading}
				handleClose={() => setIsLoading(false)}
			/>
			<SuccessModal
				isOpen={!!metadata.symbol}
				memecoin={metadata}
				handleClose={() => setMetadata(defaultMetadata)}
			/>
			<ErrorModal
				isOpen={!!error}
				title="Memecoin Creation Failed"
				handleClose={() => setError("")}
				errorMessage={error}
			/>
		</section>
	);
});

CreateCoinForm.displayName = "CreateCoinForm";

export default CreateCoinForm;
