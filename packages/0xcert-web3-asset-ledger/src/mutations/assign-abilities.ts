import { AssetLedgerAbility } from "@0xcert/scaffold";
import { AssetLedger } from "../core/ledger";

/**
 * 
 */
export default async function(ledger: AssetLedger, accountId: string, abilities: AssetLedgerAbility[]) {
  const from = ledger.context.makerId;

  return ledger.context.mutate(() => {
    return ledger.contract.methods.assignAbilities(accountId, abilities).send({ from });
  });
}
