import { GenericProvider } from '@0xcert/ethereum-generic-provider';
import { AssetLedgerCapability } from "@0xcert/scaffold";
import xcertAbi from '../config/xcertAbi';

/**
 * Gets all the asset ledger capabilities.
 */
export default async function(provider: GenericProvider, ledgerId: string) {
  return Promise.all(
    [ [AssetLedgerCapability.BURNABLE, '0x42966c68'],
      [AssetLedgerCapability.MUTABLE, '0x5e2161af'],
      [AssetLedgerCapability.PAUSABLE, '0xbedb86fb'],
      [AssetLedgerCapability.REVOKABLE, '0x20c5429b'],
    ].map(async (capability) => {
      return provider.queryContract({
        to: ledgerId,
        abi: xcertAbi.find((a) => a.name === 'supportsInterface'),
        data: [capability[1]],
        tag: 'latest',
      }).then((s) => {
        return s[0] ? capability[0] : -1;
      });
    })
  ).then((abilities) => {
    return abilities.filter((a) => a !== -1).sort();
  });
}
