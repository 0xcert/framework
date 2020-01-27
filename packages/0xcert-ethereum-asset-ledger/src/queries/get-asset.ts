import { AssetLedger } from '../core/ledger';

const functions = [
  {
    signature: '0xc87b56dd',
    inputTypes: ['uint256'],
    outputTypes: ['string'],
  },
  {
    signature: '0x49846680',
    inputTypes: ['uint256'],
    outputTypes: ['bytes', 'string'],
  },
  {
    signature: '0xcaae188e',
    inputTypes: ['uint256'],
    outputTypes: ['bytes', 'string'],
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
          data: f.signature + ledger.provider.encoder.encodeParameters(f.inputTypes, [assetId]).substr(2),
        };
        const res = await ledger.provider.post({
          method: 'eth_call',
          params: [attrs, 'latest'],
        });
        return ledger.provider.encoder.decodeParameters(f.outputTypes, res.result)[0];
      } catch (error) {
        ledger.provider.log(error);
        return null;
      }
    }),
  );
  return {
    id: assetId,
    uri: data[0],
    imprint: data[1] ? data[1].substr(2) : null,
    schemaId: data[2] ? data[2].substr(2) : null,
  };
}
