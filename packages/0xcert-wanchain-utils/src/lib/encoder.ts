import { Encode } from '@0xcert/ethereum-utils';
import { AbiCoder } from 'ethers/utils/abi-coder';
// import { getAddress } from 'ethers/utils/address';

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
   * Converts Wanchain address to checksum format.
   * NOTE: Wanchain uses basically the same mechanism, you only have to inverse
   * lower and upper case on characters.
   */
  public normalizeAddress(address: string): string {
    if (!address) {
      return null;
    }

    // We are using ethers.js for encoding ABI calls. This means that if we send using a Wanchain address,
    // ethers.js will throw an error. Ethers.js 5.0 with subclassing will be available in the following
    // weeks. Until then we just write the address in lowercase and let Ethers.js do its thing. Because of
    // this there is a danger of executing a transaction to an Ethereum address since there is no checksum check.

    return address.toLowerCase();

    // address = normalizeEthereumAddress(address.toLowerCase());

    // return [
    //   '0x',
    //   ...address.substr(2).split('').map((character) => {
    //   return character === character.toLowerCase()
    //      ? character.toUpperCase()
    //      : character.toLowerCase();
    //  }),
    // ].join('');*/
  }
}
