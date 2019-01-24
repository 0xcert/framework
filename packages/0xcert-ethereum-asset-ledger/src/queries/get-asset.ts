import { decodeParameters, encodeParameters } from '@0xcert/ethereum-utils';
import { AssetLedger } from '../core/ledger';

const functions = [
  {
    signature: '0xc87b56dd',
    inputTypes: ['uint256'],
    outputTypes: ['string'],
  },
  {
    signature: '0x70c31afc',
    inputTypes: ['uint256'],
    outputTypes: ['bytes32'],
  },
];

/**
 * Gets information(id, uri, imprint) about a specific asset.
 * @param ledger Asset ledger instance.
 * @param assetId Asset id.
 */
export default async function(ledger: AssetLedger, assetId: string) {
  const data = await Promise.all(
    functions.map(async (f) => {
      try {
        const attrs = {
          to: ledger.id,
          data: f.signature + encodeParameters(f.inputTypes, [assetId]).substr(2),
        };
        const res = await ledger.provider.post({
          method: 'eth_call',
          params: [attrs, 'latest'],
        });
        return decodeParameters(f.outputTypes, res.result)[0];
      } catch (error) {
        return null;
      }
    }),
  );
  return {
    id: assetId,
    uri: data[0],
    imprint: data[1] ? data[1].substr(2) : data[1],
  };
}
