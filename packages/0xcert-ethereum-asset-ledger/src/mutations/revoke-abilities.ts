import { Connector } from '@0xcert/ethereum-connector';
import { AssetLedgerAbility } from "@0xcert/scaffold";
import xcertAbi from '../config/xcertAbi';

/**
 * 
 */
export default async function(connector: Connector, ledgerId: string, accountId: string, abilities: AssetLedgerAbility[]) {
  return connector.mutateContract({
    to: ledgerId,
    abi: xcertAbi.find((a) => a.name === 'revokeAbilities'),
    data: [accountId, abilities],
  });
}
