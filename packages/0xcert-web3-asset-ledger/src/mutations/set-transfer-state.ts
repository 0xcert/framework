import { AssetLedgerTransferState } from "@0xcert/scaffold";
import { AssetLedger } from "../core/ledger";

/**
 * 
 */
export default async function(ledger: AssetLedger, state: AssetLedgerTransferState) {
  const paused = state !== AssetLedgerTransferState.ENABLED;

  return ledger.context.mutate(async () => {
    return ledger.contract.methods.setPause(paused);
  });
}
