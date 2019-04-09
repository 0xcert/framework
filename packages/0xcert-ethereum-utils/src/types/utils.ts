export interface Encode {

  /**
   * Converts address to checksum format.
   * @param address Address to covert.
   */
  normalizeAddress(address: string): string;

  /**
   * Encodes parameters for smart contract call.
   * @param types Input types.
   * @param values Input values.
   */
  encodeParameters(types: any, values: Array<any>): string;

  /**
   * Decodes parameters from smart contract return.
   * @param types Output types.
   * @param data Output data.
   */
  decodeParameters(types: any, data: any): any;
}
