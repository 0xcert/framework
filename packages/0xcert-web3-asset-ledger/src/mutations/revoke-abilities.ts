import { AssetLedgerAbility } from "@0xcert/scaffold";
import { AssetLedger } from "../core/ledger";

/**
 * 
 */
export default async function(ledger: AssetLedger, accountId: string, abilities: AssetLedgerAbility[]) {
  return ledger.context.mutate(async () => {
    return ledger.contract.methods.revokeAbilities(accountId, abilities);
  });
}
