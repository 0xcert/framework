import { Connector } from "@0xcert/ethereum-connector";
import { AssetLedgerTransferState } from "@0xcert/scaffold";
import xcertAbi from '../config/xcertAbi';

/**
 * 
 */
export default async function(connector: Connector, ledgerId: string) {
  return connector.queryContract({
    to: ledgerId,
    abi: xcertAbi.find((a) => a.name === 'isPaused'),
    tag: 'latest',
  }).then((r) => {
    return r[0] ? AssetLedgerTransferState.DISABLED : AssetLedgerTransferState.ENABLED;
  });
}
