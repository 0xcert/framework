import { GenericProvider } from '@0xcert/ethereum-generic-provider';
import xcertAbi from '../config/xcertAbi';

/**
 * 
 */
export default async function(provider: GenericProvider, ledgerId: string, from: string, to: string, assetId: string, receiverData?: string) {

  const data = [from, to, assetId];
  if(receiverData !== undefined)
  {
    data.push(receiverData);
  }

  return provider.mutateContract({
    to: ledgerId,
    abi: xcertAbi.find((a) => a.name === 'safeTransferFrom'),
    data,
  });
}
