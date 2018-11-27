import { GenericProvider } from "@0xcert/ethereum-generic-provider";
import erc20Abi from '../config/erc20Abi';

/**
 * 
 */
export default async function(provider: GenericProvider, ledgerId: string) {
  return provider.queryContract({
    to: ledgerId,
    abi: erc20Abi.find((a) => a.name === 'totalSupply'),
    tag: 'latest',
  }).then((r) => parseInt(r[0]));
}
