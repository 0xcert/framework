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
    signature: '0x62b99ad4',
    inputTypes: [],
    outputTypes: ['string'],
  },
  {
    signature: '0xc298bba5',
    inputTypes: [],
    outputTypes: ['string'],
  },
  {
    signature: '0x18160ddd',
    inputTypes: [],
    outputTypes: ['uint256'],
  },
];

/**
 * Gets information(name, symbol, uriPrefix, uriPostfix, schemaId, supply) of the asset ledger.
 * @param ledger Asset ledger instance.
 */
export default async function(ledger: AssetLedger) {
  const info = await Promise.all(
    functions.map(async (f) => {
      try {
        const attrs = {
          to: ledger.id,
          data: f.signature + ledger.provider.encoder.encodeParameters(f.inputTypes, []).substr(2),
        };
        const res = await ledger.provider.post({
          method: 'eth_call',
          params: [attrs, 'latest'],
        });
        return ledger.provider.encoder.decodeParameters(f.outputTypes, res.result)[0].toString();
      } catch (error) {
        ledger.provider.log(error);
        return null;
      }
    }),
  );
  return {
    name: info[0],
    symbol: info[1],
    uriPrefix: info[2],
    uriPostfix: info[3],
    supply: info[4],
  };
}
