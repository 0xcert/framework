import { encodeFunctionCall, decodeParameters } from '@0xcert/ethereum-utils';
import { ValueLedger } from '../core/ledger';
import erc20Abi from '../config/erc20-abi';

/**
 * Smart contract method abi.
 */
const abis = ['name', 'symbol', 'decimals', 'totalSupply'].map((name) => {  
  return erc20Abi.find((a) => (
    a.name === name && a.type === 'function'
  ));
});

/**
 * 
 */
export default async function(ledger: ValueLedger) {
  const info = await Promise.all(
    abis.map(async (abi) => {
      const attrs = {
        to: ledger.id,
        data: encodeFunctionCall(abi, []),
      };
      const res = await ledger.provider.post({
        method: 'eth_call',
        params: [attrs, 'latest'],
      });
      return decodeParameters(abi.outputs, res.result)[0];
    })
  );
  return {
    name: info[0],
    symbol: info[1],
    decimals: info[2],
    supply: info[3],
  };
}
