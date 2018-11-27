import { GenericProvider } from "@0xcert/ethereum-generic-provider";
import erc20Abi from '../config/erc20Abi';

/**
 * 
 */
export default async function(provider: GenericProvider, ledgerId: string) {
  return {
    name: await provider.queryContract({
      to: ledgerId,
      abi: erc20Abi.find((a) => a.name === 'name'),
      tag: 'latest',
    }).then((r) => r[0]),
    symbol: await provider.queryContract({
      to: ledgerId,
      abi: erc20Abi.find((a) => a.name === 'symbol'),
      tag: 'latest',
    }).then((r) => r[0]),
    decimals: await provider.queryContract({
      to: ledgerId,
      abi: erc20Abi.find((a) => a.name === 'decimals'),
      tag: 'latest',
    }).then((r) => parseInt(r[0])),
  };
}
