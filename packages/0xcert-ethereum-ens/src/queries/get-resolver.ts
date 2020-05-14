import { Ens } from '../core/ens';

const functionSignature = '0x0178b8bf';
const inputTypes = ['bytes32'];
const outputTypes = ['address'];

/**
 * Gets the amount of assets the account owns.
 * @param ens Ens instance.
 * @param node ENS node.
 */
export default async function(ens: Ens, node: string) {
  try {
    const attrs = {
      to: ens.id,
      data: functionSignature + ens.provider.encoder.encodeParameters(inputTypes, [node]).substr(2),
    };
    const res = await ens.provider.post({
      method: 'eth_call',
      params: [attrs, 'latest'],
    });
    return ens.provider.encoder.decodeParameters(outputTypes, res.result)[0].toString();
  } catch (error) {
    ens.provider.log(error);
    return null;
  }
}
