import { ValueLedgerGetInfoResult } from "@0xcert/scaffold";
import { ValueLedger } from "../core/ledger";

/**
 * 
 */
export default async function(ledger: ValueLedger) {
  return ledger.context.query<ValueLedgerGetInfoResult>(async () => {
    const name = await ledger.contract.methods.name().call();
    const symbol = await ledger.contract.methods.symbol().call();
    const decimals = parseInt(await ledger.contract.methods.decimals().call());

    return { name, symbol, decimals };
  });
}
