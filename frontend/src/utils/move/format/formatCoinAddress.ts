import { SuiTransactionBlockResponse } from "@mysten/sui/client";

const formatCoinAddress = (
  result: SuiTransactionBlockResponse,
  symbol: string,
) => {
  if (!result.balanceChanges) return;
  const coinType = result.balanceChanges.find((change) =>
    change.coinType.includes(symbol),
  )?.coinType;

  return coinType;
};

export default formatCoinAddress;
