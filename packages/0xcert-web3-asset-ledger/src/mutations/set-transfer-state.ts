import { AssetLedgerTransferState } from "@0xcert/scaffold";
import { AssetLedger } from "../core/ledger";

/**
 * 
 */
export default async function(ledger: AssetLedger, state: AssetLedgerTransferState) {
  const from = ledger.context.makerId;
  const paused = state !== AssetLedgerTransferState.ENABLED;

  return ledger.context.mutate(() => {
    return ledger.contract.methods.setPause(paused).send({ from });
  });
}
