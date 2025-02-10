import {
  SuiObjectChange,
  SuiTransactionBlockResponse,
} from "@mysten/sui/client";

const formatCreateTemplateResponse = (
  netWorkResponse: SuiTransactionBlockResponse,
) => {
  if (!netWorkResponse.objectChanges) {
    return { coinType: null, treasuryCap: null, recipient: null };
  }

  const coinTypeObject = netWorkResponse.objectChanges.find((obj) => {
    return obj.type === "published";
  });

  const coinType = coinTypeObject
    ? `${coinTypeObject.packageId}::${
        coinTypeObject.modules[0]
      }::${coinTypeObject.modules[0].toUpperCase()}`
    : null;

  const moduleName = coinTypeObject?.modules[0].toUpperCase() || "";
  const coinAddress = `${coinTypeObject?.packageId}::${coinTypeObject?.modules[0]}::${moduleName}`;

  const treasuryCapObject = netWorkResponse.objectChanges.find(
    (obj: SuiObjectChange) => {
      return (
        obj.type === "created" &&
        obj.objectType.startsWith("0x2::coin::TreasuryCap")
      );
    },
  ) as { objectId: string } | undefined;

  const treasuryCap = treasuryCapObject?.objectId || null;

  const recipient = netWorkResponse.transaction?.data?.sender || null;

  return { coinType, coinAddress, treasuryCap, recipient };
};

export default formatCreateTemplateResponse;
