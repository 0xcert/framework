import { GenericProvider } from '@0xcert/ethereum-generic-provider';
import xcertAbi from '../config/xcertAbi';

/**
 * Transfers asset from one account to another while checking if receiving account can actually 
 * receive the asset (it fails if receiver is a smart contract that does not implement 
 * erc721receiver).
 */
export default async function(provider: GenericProvider, ledgerId: string, from: string, to: string, assetId: string, receiverData?: string) {

  const data = [from, to, assetId];
  if(receiverData !== undefined) {
    data.push(receiverData);
  }

  return provider.mutateContract({
    to: ledgerId,
    abi: xcertAbi.find((a) => a.name === 'safeTransferFrom' && a.inputs.length == data.length),
    data,
  });
}
