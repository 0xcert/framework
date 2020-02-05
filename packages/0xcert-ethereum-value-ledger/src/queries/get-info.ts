import { ValueLedger } from '../core/ledger';

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
    signature: '0x313ce567',
    inputTypes: [],
    outputTypes: ['uint8'],
  },
  {
    signature: '0x18160ddd',
    inputTypes: [],
    outputTypes: ['uint256'],
  },
];

/**
 * Gets information (name, symbol, decimals, totalSupply) about value ledger.
 * @param ledger Value ledger instance.
 */
export default async function(ledger: ValueLedger) {
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
    decimals: info[2],
    supply: info[3],
  };
}
