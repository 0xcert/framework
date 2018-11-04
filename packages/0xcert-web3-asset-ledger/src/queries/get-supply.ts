import { AssetLedger } from "../core/ledger";

/**
 * 
 */
export default async function(ledger: AssetLedger) {
  return ledger.context.query<number>(async () => {
    const total = parseInt(await ledger.contract.methods.totalSupply().call());

    return total;
  });
}
