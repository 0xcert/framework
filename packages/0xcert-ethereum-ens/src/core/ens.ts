import { GenericProvider, NetworkKind } from '@0xcert/ethereum-generic-provider';
import { ZERO_ADDRESS } from '@0xcert/ethereum-utils';
import * as namehash from 'eth-ens-namehash';
import { getEnsAddress } from '../lib/contracts';
import getAddress from '../queries/get-address';
import getDomain from '../queries/get-domain';
import getResolver from '../queries/get-resolver';

/**
 * Ethereum value ledger implementation.
 */
export class Ens {

  /**
   * Provider instance.
   */
  protected _provider: GenericProvider;

  /**
   * Ens Id. Address pointing at the smart contract.
   */
  protected _id: string;

  /**
   * Gets an instance of already deployed value ledger.
   * @param provider Provider class with which we communicate with blockchain.
   */
  public static getInstance(provider: GenericProvider, networkKind: NetworkKind) {
    return new this(provider, networkKind);
  }

  /**
   * Initialize value ledger.
   * @param provider Provider class with which we communicate with blockchain.
   */
  public constructor(provider: GenericProvider, networkKind: NetworkKind) {
    this._provider = provider;
    this._id = getEnsAddress(networkKind);
  }

  /**
   * Gets the provider that is used to communicate with blockchain.
   */
  public get provider() {
    return this._provider;
  }

  /**
   * Gets the address of the smart contract that represents this ens.
   */
  public get id(): string {
    return this._id;
  }

  /**
   * Get address from ENS domain.
   * @param input Input from which we want to get address.
   */
  public async getAddress(input: string): Promise<string> {
    try {
      const address = this._provider.encoder.normalizeAddress(input);
      return address;
    } catch {
      const node = namehash.hash(input);
      const resolver = await getResolver(this, node);
      return getAddress(this, resolver, node);
    }
  }

  /**
   * Get ENS domain from address.
   * @param address Address.
   */
  public async getDomain(address: string): Promise<string> {
    try {
      this._provider.encoder.normalizeAddress(address);
      const name = `${address.toLowerCase().substring(2)}.addr.reverse`;
      const node = namehash.hash(name);
      const resolver = await getResolver(this, node);
      if (resolver === ZERO_ADDRESS) {
        return address;
      }
      return getDomain(this, resolver, node);
    } catch {
      return address;
    }
  }
}
