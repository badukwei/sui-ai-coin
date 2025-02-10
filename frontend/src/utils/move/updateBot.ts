import { configAddress, storePackageAddress } from "@/constants/move/store";
import { SuiTransactionBlockResponse } from "@mysten/sui/client";
import { Transaction } from "@mysten/sui/transactions";

export async function updateBot(
	coinType: string,
	recipient: string,
	coinAddress: string,
	botId: string,
	name: string,
	symbol: string,
	botJsonString: string,
	signAndExecuteTransaction: (args: {
		transaction: Transaction;
	}) => Promise<SuiTransactionBlockResponse>
) {
	const tx = new Transaction();

	tx.moveCall({
		target: `${storePackageAddress}::store::update_bot`,
		typeArguments: [coinType],
		arguments: [
			tx.object(configAddress),
			tx.pure.address(recipient),
			tx.pure.string(botId),
			tx.pure.string(name),
			tx.pure.string(symbol),
			tx.pure.string(coinAddress),
			tx.pure.string(botJsonString),
		],
	});

	tx.setGasBudget(200000000);

	const response = await signAndExecuteTransaction({
		transaction: tx,
	});

	return response;
}

