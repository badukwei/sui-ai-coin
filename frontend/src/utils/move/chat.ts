import { chatFee, configAddress, storePackageAddress } from "@/constants/move/store";
import { CoinStruct, SuiTransactionBlockResponse } from "@mysten/sui/client";
import { Transaction } from "@mysten/sui/transactions";

export async function chatWithBot(
	balances: CoinStruct[],
	coinType: string,
	sender: string,
	coinAddress: string,
	signAndExecuteTransaction: (args: {
		transaction: Transaction;
	}) => Promise<SuiTransactionBlockResponse>
) {
	const tx = new Transaction();

	if (balances.length === 0) return;

	const coin = tx.splitCoins(tx.object(balances[0].coinObjectId), [chatFee]);

	tx.moveCall({
		target: `${storePackageAddress}::store::chat_with_bot`,
		typeArguments: [coinType],
		arguments: [
			tx.object(configAddress),
			tx.object(coin),
			tx.pure.address(sender),
			tx.pure.string(coinAddress),
		],
	});

	tx.setGasBudget(200000000);

	const response = await signAndExecuteTransaction({
		transaction: tx,
	});

	console.log("Mint and transfer successful:", response);
	return response;
}
