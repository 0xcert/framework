import { AssetLedgerCapability } from "@0xcert/scaffold";
import { encodeFunctionCall, decodeParameters } from 'web3-eth-abi';
import xcertAbi from '../config/xcertAbi';
import { AssetLedger } from '../core/ledger';

/**
 * 
 */
export default async function(ledger: AssetLedger) {

  const abi = xcertAbi.find((a) => (
    a.name === 'supportsInterface' && a.type === 'function'
  ));

  return Promise.all(
    [ [AssetLedgerCapability.BURNABLE, '0x42966c68'],
      [AssetLedgerCapability.MUTABLE, '0x5e2161af'],
      [AssetLedgerCapability.PAUSABLE, '0xbedb86fb'],
      [AssetLedgerCapability.REVOKABLE, '0x20c5429b'],
    ].map(async (capability) => {
      return ledger.provider.send({
        method: 'eth_call',
        params: [
          {
            to: ledger.id,
            data: encodeFunctionCall(abi, [capability[1]]),
          },
          'latest'
        ],
      }).then(({ result }) => {
        return decodeParameters(abi.outputs, result);
      }).then((s) => {
        return s[0] ? capability[0] : -1;
      });
    })
  ).then((abilities) => {
    return abilities.filter((a) => a !== -1).sort();
  });
}
