import { decodeParameters, encodeParameters } from '@0xcert/ethereum-utils';
import { AssetLedger } from '../core/ledger';

const functions = [
  {
    signature: '0x06fdde03',
    inputTypes: [],
    outputTypes: ['string'],
  },
  {
    signature: '0x95d89b41',
    inputTypes: [],
    outputTypes: ['string'],
  },
  {
    signature: '0xfbca0ce1',
    inputTypes: [],
    outputTypes: ['string'],
  },
  {
    signature: '0x075b1a09',
    inputTypes: [],
    outputTypes: ['bytes32'],
  },
  {
    signature: '0x18160ddd',
    inputTypes: [],
    outputTypes: ['uint256'],
  },
];

/**
 * Gets information(name, symbol, uriBase, schemaId, supply) of the asset ledger.
 * @param ledger Asset ledger instance.
 */
export default async function(ledger: AssetLedger) {
  const info = await Promise.all(
    functions.map(async (f) => {
      try {
        const attrs = {
          to: ledger.id,
          data: f.signature + encodeParameters(f.inputTypes, []).substr(2),
        };
        const res = await ledger.provider.post({
          method: 'eth_call',
          params: [attrs, 'latest'],
        });
        return decodeParameters(f.outputTypes, res.result)[0].toString();
      } catch (error) {
        return null;
      }
    }),
  );
  return {
    name: info[0],
    symbol: info[1],
    uriBase: info[2],
    schemaId: info[3],
    supply: info[4],
  };
}
