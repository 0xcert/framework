import { AbiCoder } from 'ethers/utils/abi-coder';
import { getAddress } from 'ethers/utils/address';
import { Encode } from '../types/utils';

export class Encoder implements Encode {

  private coder: AbiCoder = new AbiCoder();

  /**
   * Encodes parameters for smart contract call.
   * @param types Input types.
   * @param values Input values.
   */
  public encodeParameters(types: any, values: Array<any>): string {
    return this.coder.encode(types, values);
  }

  /**
   * Decodes parameters from smart contract return.
   * @param types Output types.
   * @param data Output data.
   */
  public decodeParameters(types: any, data: any): any {
    return this.coder.decode(types, data);
  }

  /**
   * Converts ethereum address to checksum format.
   * @see https://github.com/ethereum/EIPs/blob/master/EIPS/eip-55.md
   */
  public normalizeAddress(address: string): string {
    return address ? getAddress(address) : null;
  }

}
