import { Connector } from '@0xcert/ethereum-connector';
import { AssetLedgerTransferState } from "@0xcert/scaffold";
import xcertAbi from '../config/xcertAbi';

/**
 * 
 */
export default async function(connector: Connector, ledgerId: string, state: AssetLedgerTransferState) {
  return connector.mutateContract({
    to: ledgerId,
    abi: xcertAbi.find((a) => a.name === 'setPause'),
    data: [state !== AssetLedgerTransferState.ENABLED],
  });
}
