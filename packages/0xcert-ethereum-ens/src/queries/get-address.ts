import { Ens } from '../core/ens';

const functionSignature = '0x3b3b57de';
const inputTypes = ['bytes32'];
const outputTypes = ['address'];

/**
 * Gets the amount of assets the account owns.
 * @param ens Ens instance.
 * @param domain ENS domain name.
 */
export default async function(ens: Ens, address: string, node: string) {
  try {
    const attrs = {
      to: address,
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
