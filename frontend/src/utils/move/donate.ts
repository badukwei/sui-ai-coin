import { configAddress, storePackageAddress } from "@/constants/move/store";
import { CoinStruct, SuiTransactionBlockResponse } from "@mysten/sui/client";
import { Transaction } from "@mysten/sui/transactions";

export async function donateToBot(
	balances: CoinStruct[],
	coinType: string,
	sender: string,
	amountToSend: number,
	coinAddress: string,
	signAndExecuteTransaction: (args: {
		transaction: Transaction;
	}) => Promise<SuiTransactionBlockResponse>
) {
	const tx = new Transaction();

	if (balances.length === 0) return;

	const coin = tx.splitCoins(tx.object(balances[0].coinObjectId), [amountToSend]);

	tx.moveCall({
		target: `${storePackageAddress}::store::donate_to_bot`,
		typeArguments: [coinType],
		arguments: [
			tx.object(configAddress),
			tx.object(coin),
			tx.pure.address(sender),
			tx.pure.string(coinAddress),
		],
	});

	const response = await signAndExecuteTransaction({
		transaction: tx,
	});

	return response;
}
