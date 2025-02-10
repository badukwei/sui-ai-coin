import { CoinStruct, SuiTransactionBlockResponse } from "@mysten/sui/client";
import { Transaction } from "@mysten/sui/transactions";

export async function mergeCoins(
	balances: CoinStruct[],
	amount: number,
	signAndExecuteTransaction: (args: {
		transaction: Transaction;
	}) => Promise<SuiTransactionBlockResponse>
) {
	const tx = new Transaction();

	if (balances.length < 0) return;

	tx.splitCoins(tx.object(balances[0].coinObjectId), [amount]);

	const response = await signAndExecuteTransaction({
		transaction: tx,
	});

	return response;
}
