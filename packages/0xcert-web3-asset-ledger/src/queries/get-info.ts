import { AssetLedgerGetInfoResult } from "@0xcert/scaffold";
import { AssetLedger } from "../core/ledger";

/**
 * 
 */
export default async function(ledger: AssetLedger) {
  return ledger.context.query<AssetLedgerGetInfoResult>(async () => {
    const name = await ledger.contract.methods.name().call();
    const symbol = await ledger.contract.methods.symbol().call();
    const uriBase = await ledger.contract.methods.uriBase().call();
    const conventionId = await ledger.contract.methods.symbol().call();

    return { name, symbol, uriBase, conventionId };
  });
}
