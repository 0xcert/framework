import { AssetLedgerTransferState } from "@0xcert/scaffold";
import { AssetLedger } from "../core/ledger";

/**
 * 
 */
export default async function(ledger: AssetLedger) {
  return ledger.context.query<AssetLedgerTransferState>(async () => {
    const paused = await ledger.contract.methods.isPaused().call();
    const state = paused ? AssetLedgerTransferState.DISABLED : AssetLedgerTransferState.ENABLED;

    return state;
  });
}
