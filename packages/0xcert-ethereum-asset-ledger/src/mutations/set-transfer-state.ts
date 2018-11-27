import { GenericProvider } from '@0xcert/ethereum-generic-provider';
import { AssetLedgerTransferState } from "@0xcert/scaffold";
import xcertAbi from '../config/xcertAbi';

/**
 * 
 */
export default async function(provider: GenericProvider, ledgerId: string, state: AssetLedgerTransferState) {
  return provider.mutateContract({
    to: ledgerId,
    abi: xcertAbi.find((a) => a.name === 'setPause'),
    data: [state !== AssetLedgerTransferState.ENABLED],
  });
}
