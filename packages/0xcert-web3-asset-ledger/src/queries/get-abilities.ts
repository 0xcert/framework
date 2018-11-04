import { AssetLedgerAbility } from "@0xcert/scaffold";
import { AssetLedger } from "../core/ledger";

/**
 * 
 */
export default async function(ledger: AssetLedger, accountId: string) {
  return ledger.context.query<AssetLedgerAbility[]>(async () => {
    return await Promise.all(
      [ AssetLedgerAbility.MANAGE_ABILITIES,
        AssetLedgerAbility.MINT_ASSET,
        AssetLedgerAbility.PAUSE_TRANSFER,
        AssetLedgerAbility.REVOKE_ASSET,
        AssetLedgerAbility.SIGN_MINT_CLAIM,
        AssetLedgerAbility.UPDATE_PROOF,
      ].map(async (ability) => {
        const able = await ledger.contract.methods.isAble(accountId, ability).call();
        return able ? ability : -1;
      })
    ).then((abilities) => {
      return abilities.filter((a) => a !== -1).sort();
    });
  });
}
