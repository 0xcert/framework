import { VaultGetInfoResult } from "@0xcert/scaffold";
import { Vault } from "../core/vault";

/**
 * 
 */
export default async function(vault: Vault) {
  return vault.connector.query<VaultGetInfoResult>(async () => {
    const name = await vault.contract.methods.name().call();
    const symbol = await vault.contract.methods.symbol().call();
    const decimals = parseInt(await vault.contract.methods.decimals().call());

    return { name, symbol, decimals };
  });
}
