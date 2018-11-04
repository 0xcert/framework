import { Vault } from "../core/vault";

/**
 * 
 */
export default async function(vault: Vault) {
  return vault.context.query<number>(async () => {
    const total = parseInt(await vault.contract.methods.totalSupply().call());

    return total;
  });
}
