import { apiClient } from "@/libs/apiFactory";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import { PacmanLoader } from "react-spinners";
import { BotInfo } from "@/types/move/bot";
import { useSignAndExecuteTransaction, useSuiClient } from "@mysten/dapp-kit";
import { chatFee, configAddress } from "@/constants/move/store";
import { ContentWithUser } from "@/types/eliza/message";
import Link from "next/link";
import { chatWithBot } from "@/utils/move/chat";
import { toast } from "react-toastify";
import { donateToBot } from "@/utils/move/donate";
import { mergeCoins } from "@/utils/move/mergeCoin";
import DonateInputModal from "../modal/DonateInputModal";

interface Props {
	address?: string;
	coinAddress?: string;
}

const ChatBox: React.FC<Props> = ({ address, coinAddress }) => {
	const [input, setInput] = useState<string>("");
	const [agentId, setAgentId] = useState<string>("");
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
	const [totalBalance, setTotalBalance] = useState<number>(0);

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
	const queryClient = useQueryClient();

	const sendMessageMutation = useMutation({
		mutationKey: ["send_message", agentId],
		mutationFn: ({
			message,
			selectedFile,
		}: {
			message: string;
			selectedFile?: File | null;
		}) => apiClient.sendMessage(agentId, message, selectedFile),
		onSuccess: (newMessages: ContentWithUser[]) => {
			console.log(newMessages);
			queryClient.setQueryData(
				["messages", agentId],
				(old: ContentWithUser[] = []) => [
					...old.filter((msg) => !msg.isLoading),
					...newMessages.map((msg) => ({
						...msg,
						createdAt: Date.now(),
					})),
				]
			);
		},
		onError: (e) => {
			console.error(e);
		},
	});

	const sendMessage = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const newMessages = [
			{
				text: input,
				user: "user",
				createdAt: Date.now(),
			},
			{
				text: input,
				user: "system",
				isLoading: true,
				createdAt: Date.now(),
			},
		];

		queryClient.setQueryData(
			["messages", agentId],
			(old: ContentWithUser[] = []) => [...old, ...newMessages]
		);

		sendMessageMutation.mutate({
			message: input,
			selectedFile: null,
		});

		setInput("");
	};

	const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!input.trim()) {
			toast.error("Please enter the text!");
			return;
		}
		if (totalBalance < chatFee) {
			toast.error("You don't have enough balance!");
			return;
		}
		if (!address || !coinAddress) return;
		try {
			const { data } = await suiClient.getCoins({
				owner: address,
				coinType: coinAddress,
			});

			if (Number(data[0].balance) < chatFee) {
				await mergeCoins(data, signAndExecuteTransaction);
			}

			await new Promise((resolve) => setTimeout(resolve, 1000));

			const suiResponse = await chatWithBot(
				data,
				coinAddress,
				address,
				coinAddress,
				signAndExecuteTransaction
			);
			if (!suiResponse) throw new Error();
			sendMessage(e);
		} catch (error) {
			console.error(error);
			toast.error("Fail sending message!");
		}
	};

	const handleDonate = async (amount: number) => {
		if (totalBalance < amount) return;

		if (!address || !coinAddress) return;
		try {
			const { data } = await suiClient.getCoins({
				owner: address,
				coinType: coinAddress,
			});

			await mergeCoins(data, signAndExecuteTransaction);

			await new Promise((resolve) => setTimeout(resolve, 1000));

			const suiResponse = await donateToBot(
				data,
				coinAddress,
				address,
				amount,
				coinAddress,
				signAndExecuteTransaction
			);
			if (!suiResponse) throw new Error();
			toast.success("Thanks for the donation!");
		} catch (error) {
			console.error(error);
			toast.error("Fail to Donate! Please check the balance!");
		}
	};

	const messages =
		queryClient.getQueryData<ContentWithUser[]>(["messages", agentId]) ||
		[];

	const getMessageVariant = (role: string) =>
		role !== "user" ? "received" : "sent";

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
				const agentId = botInfo.bot_id;
				setAgentId(agentId);
			} catch (error) {
				console.log(error);
			}
		};
		run();
	}, [coinAddress, suiClient]);

	useEffect(() => {
		const run = async () => {
			if (!address || !coinAddress) return;
			const { data } = await suiClient.getCoins({
				owner: address,
				coinType: coinAddress,
			});

			let totalBalance = 0;
			for (const coin of data) {
				totalBalance += Number(coin.balance);
			}
			console.log(totalBalance);
			setTotalBalance(totalBalance);
		};
		run();
	}, [address, suiClient, coinAddress]);

	return (
		<div className="relative w-full max-w-3xl">
			{!agentId && (
				<div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-70 rounded-lg z-10">
					<Link
						href={`/create/${coinAddress}`}
						style={{
							padding: "12px 24px",
							backgroundColor: "rgba(255, 255, 255, 0.1)",
							border: "1px solid rgba(255, 255, 255, 0.3)",
							color: "white",
							borderRadius: "8px",
							boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
							cursor: "pointer",
							transition:
								"all 0.3s ease, transform 0.1s ease-in-out",
						}}
						onMouseEnter={(e) => {
							(
								e.currentTarget as HTMLElement
							).style.backgroundColor =
								"rgba(255, 255, 255, 0.2)";
							(e.currentTarget as HTMLElement).style.transform =
								"scale(1.05)";
						}}
						onMouseLeave={(e) => {
							(
								e.currentTarget as HTMLElement
							).style.backgroundColor =
								"rgba(255, 255, 255, 0.1)";
							(e.currentTarget as HTMLElement).style.transform =
								"scale(1)";
						}}
						onMouseDown={(e) => {
							(e.currentTarget as HTMLElement).style.transform =
								"scale(0.95)";
						}}
						onMouseUp={(e) => {
							(e.currentTarget as HTMLElement).style.transform =
								"scale(1.05)";
						}}
					>
						Create Bot
					</Link>
				</div>
			)}

			<form
				onSubmit={handleSendMessage}
				className={`relative p-6 rounded-lg bg-black/50 shadow-lg flex flex-col gap-6 ${
					!agentId ? "opacity-30 pointer-events-none" : ""
				}`}
			>
				<div className="flex flex-col gap-6 overflow-y-auto max-h-96">
					{messages.map((message, index) => {
						const variant = getMessageVariant(message?.user);

						return (
							<div
								key={index}
								className={`flex ${
									variant === "sent"
										? "justify-end"
										: "justify-start"
								}`}
							>
								<div
									className={`flex flex-col gap-2 p-4 rounded-2xl max-w-md shadow-md ${
										variant === "sent"
											? "bg-blue-500 text-white"
											: variant === "received"
											? "bg-gray-600 text-white"
											: "bg-green-500 text-white"
									}`}
								>
									{message.isLoading &&
									message.user === "system" ? (
										<PacmanLoader
											color="#4FC3F7"
											size={14}
										/>
									) : (
										<>
											<p className="text-white break-words leading-6 text-base">
												{message.text}
											</p>
											<span className="text-xs text-gray-300 text-right">
												{dayjs(
													message.createdAt
												).format("h:mm A")}
											</span>
										</>
									)}
								</div>
							</div>
						);
					})}
				</div>

				<div className="flex items-center gap-2">
					<input
						type="text"
						value={input}
						onChange={(e) => setInput(e.target.value)}
						className="flex-1 p-2 rounded-lg border bg-gray-800 text-white"
						placeholder="Type a message..."
					/>

					<button
						type="submit"
						disabled={sendMessageMutation?.isPending}
						className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition cursor-pointer"
					>
						Send
					</button>

					<button
						type="button"
						disabled={sendMessageMutation?.isPending}
						className="px-4 py-2 text-white rounded-lg transition flex items-center justify-center 
							bg-gradient-to-r from-yellow-400 to-orange-500 
							hover:from-yellow-500 hover:to-orange-600 
               				active:scale-95 shadow-lg shadow-orange-400/50"
						onClick={() => setIsModalOpen(true)}
					>
						Donate
					</button>
				</div>
			</form>
			<DonateInputModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				onSubmit={handleDonate}
				totalBalance={totalBalance}
				coinAddress={coinAddress}
			/>
		</div>
	);
};

export default ChatBox;
