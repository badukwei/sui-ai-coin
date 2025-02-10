import { configAddress, storePackageAddress } from "@/constants/move/store";
import { SuiTransactionBlockResponse } from "@mysten/sui/client";
import { Transaction } from "@mysten/sui/transactions";

export async function createBot(
	coinType: string,
	treasuryCap: string,
	coinAddress: string,
	botId: string,
	name: string,
	symbol: string,
	description: string,
	url: string,
	botJson: string,
	signAndExecuteTransaction: (args: {
		transaction: Transaction;
	}) => Promise<SuiTransactionBlockResponse>
) {
	const tx = new Transaction();

	tx.moveCall({
		target: `${storePackageAddress}::store::create_bot`,
		typeArguments: [coinType],
		arguments: [
			tx.object(configAddress),
			tx.object(treasuryCap),
			tx.pure.string(botId),
			tx.pure.string(name),
			tx.pure.string(symbol),
			tx.pure.string(description),
			tx.pure.string(url),
			tx.pure.string(coinAddress),
			tx.pure.string(botJson),
		],
	});

	tx.setGasBudget(200000000);

	const response = await signAndExecuteTransaction({
		transaction: tx,
	});

	return response;
}
