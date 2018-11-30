import { encodeFunctionCall, decodeParameters } from '@0xcert/ethereum-utils';
import { AssetLedger } from '../core/ledger';
import xcertAbi from '../config/xcertAbi';

/**
 * Smart contract method abi.
 */
const abis = ['tokenURI', 'tokenProof'].map((name) => {  
  return xcertAbi.find((a) => (
    a.name === name && a.type === 'function'
  ));
});

/**
 * 
 */
export default async function(ledger: AssetLedger, assetId: string) {
  const data = await Promise.all(
    abis.map(async (abi) => {
      const attrs = {
        to: ledger.id,
        data: encodeFunctionCall(abi, [assetId]),
      };
      const res = await ledger.provider.send({
        method: 'eth_call',
        params: [attrs, 'latest'],
      });
      return decodeParameters(abi.outputs, res.result)[0];
    })
  );
  return {
    id: assetId,
    uri: data[0],
    proof: data[1],
  };
}
