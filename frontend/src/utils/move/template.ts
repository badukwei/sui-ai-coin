import { templateHex } from "@/constants/move/template";
import { bcs } from "@mysten/bcs";
import {
  update_constants,
  update_identifiers,
} from "@mysten/move-bytecode-template";
import { Transaction } from "@mysten/sui/transactions";
import { fromHex, toBase64 } from "@mysten/sui/utils";
import { Metadata } from "@/types/ai/metadata";
import { SuiTransactionBlockResponse } from "@mysten/sui/client";

const updateTemplate = async (
  address: string,
  params: Metadata,
  imageUrl: string,
  signAndExecuteTransaction: (args: {
    transaction: Transaction;
  }) => Promise<SuiTransactionBlockResponse>,
) => {
  const templateBytecode = fromHex(templateHex);

  const { symbol, name, description } = params;

  let updated;

  updated = update_identifiers(templateBytecode, {
    TEMPLATE: symbol,
    template: symbol.toLowerCase(),
  });

  // Update SYMBOL
  updated = update_constants(
    updated,
    bcs.string().serialize(symbol).toBytes(),
    bcs.string().serialize("TMPL").toBytes(),
    "Vector(U8)",
  );

  // Update NAME
  updated = update_constants(
    updated,
    bcs.string().serialize(name).toBytes(),
    bcs.string().serialize("template_coin").toBytes(),
    "Vector(U8)",
  );

  // Update DESCRIPTION
  updated = update_constants(
    updated,
    bcs.string().serialize(description).toBytes(),
    bcs.string().serialize("template_coin description").toBytes(),
    "Vector(U8)",
  );

  // Update ICON_URL
  updated = update_constants(
    updated,
    bcs.string().serialize(imageUrl).toBytes(),
    bcs.string().serialize("template_icon_url").toBytes(),
    "Vector(U8)",
  );

  const base64Encoded = toBase64(updated);
  const tx = new Transaction();

  tx.setSender(address);

  const [upgrade_cap] = tx.publish({
    modules: [base64Encoded],
    dependencies: ["0x1", "0x2"],
  });

  tx.transferObjects([upgrade_cap], address);
  tx.setGasBudget(200000000);

  console.log(tx);

  // const response = await suiClient.signAndExecuteTransaction({
  // 	transaction: tx,
  // 	signer: signer,
  // 	options: {
  // 		showBalanceChanges: true,
  // 		showEffects: true,
  // 		showEvents: true,
  // 		showInput: true,
  // 		showObjectChanges: true,
  // 		showRawEffects: true,
  // 		showRawInput: true,
  // 	},
  // });

  const response = await signAndExecuteTransaction({
    transaction: tx,
  });

  console.log("Template created successfully!");
  return response;
};

export default updateTemplate;
