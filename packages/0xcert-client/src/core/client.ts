import { GenericProviderBase, Mutation } from "@0xcert/scaffold";
import { Cert } from '@0xcert/cert';
import { MutationTracker } from '@0xcert/mutation-tracker';

/**
 * 
 */
export interface ClientConfig {
  provider: GenericProviderBase;
}

/**
 * 
 */
export class Client {
  protected provider: GenericProviderBase;

  /**
   * 
   */
  public constructor(options: ClientConfig) {
    this.provider = options.provider;
  }

  /**
   * 
   */
  public async sign(val: string) {
    return this.provider.sign(val);
  }

  /**
   * 
   */
  public async getMutation(id: string): Promise<Mutation> {
    return this.provider.getMutation(id);
  }

  /**
   * 
   */
  public async getOrderGateway(id: string = null) {
    return this.provider.getOrderGateway(id);
  }

  /**
   * 
   */
  public async getAssetLedger(id: string) {
    return this.provider.getAssetLedger(id);
  }

  /**
   * 
   */
  public async getValueLedger(id: string) {
    return this.provider.getValueLedger(id);
  }

  /**
   * 
   * @param schema 
   */
  public createQueue(schema) {
    return null;
  }

  /**
   * 
   * @param schema 
   */
  public createCert(schema) {
    return new Cert(schema);
  }

  /**
   * 
   */
  public createMutationTracker() {
    return new MutationTracker(this.provider);
  }

}
