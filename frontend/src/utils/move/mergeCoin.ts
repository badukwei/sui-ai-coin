import { CoinStruct, SuiTransactionBlockResponse } from "@mysten/sui/client";
import { Transaction } from "@mysten/sui/transactions";

export async function mergeCoins(
	balances: CoinStruct[],
	signAndExecuteTransaction: (args: {
		transaction: Transaction;
	}) => Promise<SuiTransactionBlockResponse>
) {
	const tx = new Transaction();

	if (balances.length < 2) return;

	tx.mergeCoins(
		tx.object(balances[0].coinObjectId),
		balances.slice(1).map((coin) => tx.object(coin.coinObjectId))
	);

	const response = await signAndExecuteTransaction({
		transaction: tx,
	});

	return response;
}
