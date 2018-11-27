import { GenericProvider } from "@0xcert/ethereum-generic-provider";
import { AssetLedgerTransferState } from "@0xcert/scaffold";
import xcertAbi from '../config/xcertAbi';

/**
 * 
 */
export default async function(provider: GenericProvider, ledgerId: string) {
  return provider.queryContract({
    to: ledgerId,
    abi: xcertAbi.find((a) => a.name === 'isPaused'),
    tag: 'latest',
  }).then((r) => {
    return r[0] ? AssetLedgerTransferState.DISABLED : AssetLedgerTransferState.ENABLED;
  });
}
