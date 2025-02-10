import { useSignAndExecuteTransaction, useSuiClient } from "@mysten/dapp-kit";
import { CoinMetadata } from "@mysten/sui/client";
import React, { useEffect, useState } from "react";
import { AIConfig } from "@/types/ai/eliza/character";
import { toast } from "react-toastify";
import { fetcher } from "@/libs/apiFactory";
import { updateBot } from "@/utils/move/updateBot";
import { configAddress } from "@/constants/move/store";
import { BotInfo } from "@/types/move/bot";
import { ELIZA_BASE_URL } from "@/constants";
import { defaultConfig } from "@/constants/ai/botConfig";
import Lore from "./Lore";
import Bio from "./Bio";
import PostExample from "./PostExample";
import Topic from "./Topic";
import Adjective from "./Adjective";
import RoutingToast from "../common/CustomToastMessage/RoutingToast";
import MessageExample from "./MessageExample";

interface Props {
	coinAddress: string;
	address?: string;
}

const AIConfigForm: React.FC<Props> = ({ coinAddress, address }) => {
	const [config, setConfig] = useState<AIConfig>(defaultConfig);
	const [originalConfig, setOriginalConfig] =
		useState<AIConfig>(defaultConfig);
	const [coinData, setCoinData] = useState<CoinMetadata | null>(null);
	const [botData, setBotData] = useState<BotInfo | null>(null);

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

	const handleChange = (
		field: string,
		value: string | number | boolean | string[]
	) => {
		setConfig((prev) => ({ ...prev, [field]: value }));
	};

	const handleArrayChange = (field: string, index: number, value: string) => {
		const newArray = [
			...(config[field as keyof typeof config] as string[]),
		];
		newArray[index] = value;
		handleChange(field, newArray);
	};

	const handleAddArrayItem = <K extends keyof AIConfig>(field: K) => {
		if (Array.isArray(config[field])) {
			setConfig((prev) => ({
				...prev,
				[field]: [...(prev[field] as string[]), ""],
			}));
		} else {
			console.error(
				`Error: '${field}' is not an array and cannot be modified dynamically.`
			);
		}
	};

	const handleAddArrayItemWithContent = <K extends keyof AIConfig>(
		field: K,
		content: string
	) => {
		if (Array.isArray(config[field])) {
			setConfig((prev) => ({
				...prev,
				[field]: [...(prev[field] as string[]), content],
			}));
		} else {
			console.error(
				`Error: '${field}' is not an array and cannot be modified dynamically.`
			);
		}
	};

	const handleRemoveArrayItem = <K extends keyof AIConfig>(
		field: K,
		index: number
	) => {
		if (Array.isArray(config[field])) {
			setConfig((prev) => {
				const updatedArray = [...(prev[field] as string[])];
				updatedArray.splice(index, 1);
				return { ...prev, [field]: updatedArray };
			});
		} else {
			console.error(
				`Error: '${field}' is not an array and cannot be modified dynamically.`
			);
		}
	};

	const handleMessageExampleChange = (
		pairIndex: number,
		messageIndex: 0 | 1,
		value: string
	) => {
		setConfig((prev) => {
			const updatedExamples = [...prev.messageExamples];
			updatedExamples[pairIndex][messageIndex].content.text = value;
			return { ...prev, messageExamples: updatedExamples };
		});
	};

	const handleAddMessageExample = () => {
		setConfig((prev) => ({
			...prev,
			messageExamples: [
				...prev.messageExamples,
				[
					{ user: "{{user1}}", content: { text: "" } }, // First user always "{{user1}}"
					{ user: prev.name, content: { text: "" } }, // Second user always `config.name`
				],
			],
		}));
	};

	const handleRemoveMessageExample = (pairIndex: number) => {
		setConfig((prev) => {
			const updatedExamples = [...prev.messageExamples];
			updatedExamples.splice(pairIndex, 1);
			return { ...prev, messageExamples: updatedExamples };
		});
	};

	const handleAddWithContentMessageExample = (
		userMessage: string,
		botResponse: string
	) => {
		setConfig((prev) => ({
			...prev,
			messageExamples: [
				...prev.messageExamples,
				[
					{ user: "{{user1}}", content: { text: userMessage } },
					{ user: prev.name, content: { text: botResponse } }, 
				],
			],
		}));
	};


	const update = async () => {
		const agentId = botData?.bot_id;
		if (!agentId) {
			toast.error("Missing bot data!");
			return;
		}
		if (!address) {
			toast.error("Please log in with your wallet!");
			return;
		}
		if (JSON.stringify(config) === JSON.stringify(originalConfig)) {
			toast.error("Please change the fields first!");
			return;
		}
		try {
			const deleteResponse = await fetch(
				`${ELIZA_BASE_URL}/agents/${agentId}`,
				{ method: "DELETE" }
			);
			console.log(deleteResponse);
			const response = await fetcher({
				url: "/agent/start",
				method: "POST",
				body: { characterJson: config },
			});
			console.log(response);
			const botJsonString = JSON.stringify(config);
			const { bot_id, name, symbol } = botData;
			const suiResponse = await updateBot(
				coinAddress,
				address,
				coinAddress,
				bot_id,
				name,
				symbol,
				botJsonString,
				signAndExecuteTransaction
			);
			console.log(suiResponse);
			toast.success(
				<RoutingToast
					message="Success update the bot! Thanks for the contribution!"
					route={`/coin/${coinAddress}`}
					linkMessage="Go to chat"
				/>,
				{
					position: "top-right",
					autoClose: 2000,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: true,
				}
			);
		} catch (error) {
			console.error(error);
			toast.error("An error occurred while updating the bot!");
		}
	};

	useEffect(() => {
		const fetchCoinData = async () => {
			try {
				const data = await suiClient.getCoinMetadata({
					coinType: coinAddress,
				});
				setCoinData(data);
				handleChange("name", data?.symbol ?? "Default");
				console.log("Fetched Coin Data:", data);
			} catch (error) {
				console.error("Error fetching coin data:", error);
			}
		};

		fetchCoinData();
	}, [coinAddress, suiClient]);

	useEffect(() => {
		const run = async () => {
			const name = {
				type: "0x1::string::String",
				value: coinAddress,
			};
			try {
				const { data } = await suiClient.getDynamicFieldObject({
					parentId: configAddress,
					name: name,
				});
				const objectId = data?.objectId;
				if (!objectId) throw new Error();
				const response = await suiClient.getObject({
					id: objectId,
					options: {
						showContent: true,
					},
				});
				const object = response.data;
				if (object?.content?.dataType !== "moveObject")
					throw new Error();
				const botInfo = object.content.fields as unknown as BotInfo;
				setBotData(botInfo);
				const botConfig = JSON.parse(botInfo.bot_json) as AIConfig;
				setConfig(botConfig);
				setOriginalConfig(botConfig);
			} catch (error) {
				console.log(error);
			}
		};
		run();
	}, [coinAddress, suiClient]);

	return (
		<div className="w-full max-w-3xl mx-auto p-6 bg-gray-900 text-white rounded-lg shadow-lg">
			<h2 className="text-2xl font-semibold mb-4">
				AI Configuration Form
			</h2>
			<div className="flex flex-col gap-2">
				{/* Name */}
				<div className="mt-0">
					<h3 className="text-lg font-semibold mt-6 mb-2">Name</h3>
					<input
						type="text"
						value={config.name}
						disabled // Disabled field
						className="w-full p-2 rounded bg-gray-700 text-gray-400 mb-4 opacity-50 cursor-not-allowed"
					/>
				</div>

				{/* Model Provider */}
				<div className="mt-0">
					<h3 className="text-lg font-semibold mt-6 mb-2">
						Model Provider
					</h3>
					<input
						type="text"
						value={config.modelProvider}
						disabled // Disabled field
						className="w-full p-2 rounded bg-gray-700 text-gray-400 mb-4 opacity-50 cursor-not-allowed"
					/>
				</div>

				{/* Voice Model */}
				<div className="mt-0">
					<h3 className="text-lg font-semibold mt-6 mb-2">
						Voice Model
					</h3>
					<input
						type="text"
						value={config.settings.voice.model}
						disabled // Disabled field
						className="w-full p-2 rounded bg-gray-700 text-gray-400 mb-4 opacity-50 cursor-not-allowed"
					/>
				</div>

				{/* Bio */}
				<Bio
					config={config}
					handleAddArrayItem={handleAddArrayItem}
					handleArrayChange={handleArrayChange}
					handleRemoveArrayItem={handleRemoveArrayItem}
					handleAddArrayItemWithContent={
						handleAddArrayItemWithContent
					}
				/>

				{/* Lore */}
				<Lore
					config={config}
					handleAddArrayItem={handleAddArrayItem}
					handleArrayChange={handleArrayChange}
					handleRemoveArrayItem={handleRemoveArrayItem}
					handleAddArrayItemWithContent={
						handleAddArrayItemWithContent
					}
				/>

				{/* Message Examples */}
				<MessageExample
					config={config}
					handleMessageExampleChange={handleMessageExampleChange}
					handleAddMessageExample={handleAddMessageExample}
					handleRemoveMessageExample={handleRemoveMessageExample}
					handleAddWithContentMessageExample={
						handleAddWithContentMessageExample
					}
				/>

				{/* Post Examples */}
				<PostExample
					config={config}
					handleAddArrayItem={handleAddArrayItem}
					handleArrayChange={handleArrayChange}
					handleRemoveArrayItem={handleRemoveArrayItem}
					handleAddArrayItemWithContent={
						handleAddArrayItemWithContent
					}
				/>

				{/* Topics */}
				<Topic
					config={config}
					handleAddArrayItem={handleAddArrayItem}
					handleArrayChange={handleArrayChange}
					handleRemoveArrayItem={handleRemoveArrayItem}
					handleAddArrayItemWithContent={
						handleAddArrayItemWithContent
					}
				/>

				{/* Adjectives */}
				<Adjective
					config={config}
					handleAddArrayItem={handleAddArrayItem}
					handleArrayChange={handleArrayChange}
					handleRemoveArrayItem={handleRemoveArrayItem}
					handleAddArrayItemWithContent={
						handleAddArrayItemWithContent
					}
				/>

				{/* JSON Preview */}
				<div className="mt-6 p-4 bg-gray-800 rounded-lg">
					<h3 className="text-lg font-semibold mb-2">JSON Preview</h3>
					<div className="overflow-x-auto max-w-full bg-gray-700 p-3 rounded-lg">
						<pre className="text-sm whitespace-pre-wrap break-words">
							{JSON.stringify(config, null, 2)}
						</pre>
					</div>
				</div>

				{/* Save Button */}
				<button
					onClick={update}
					className="mt-4 w-full p-3 bg-blue-500 hover:bg-blue-600 rounded-lg"
					disabled={!coinData}
				>
					Update Config
				</button>
			</div>
		</div>
	);
};

export default AIConfigForm;
