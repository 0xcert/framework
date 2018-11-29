import { GenericProvider } from "@0xcert/ethereum-generic-provider";
import erc20Abi from '../config/erc20Abi';
import { BN } from '../core/utils';

/**
 * 
 */
export default async function(provider: GenericProvider, ledgerId: string, accountId: string) {
  return provider.queryContract({
    to: ledgerId,
    abi: erc20Abi.find((a) => a.name === 'balanceOf'),
    data: [accountId],
    tag: 'latest',
  }).then((r) => new BN(r[0]));
}
