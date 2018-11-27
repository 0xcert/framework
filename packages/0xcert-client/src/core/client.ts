import { ConnectorBase, Mutation } from "@0xcert/scaffold";
import { Cert } from '@0xcert/certification';
import { MutationTracker } from '@0xcert/mutation-tracker';

/**
 * 
 */
export interface ClientConfig {
  connector: ConnectorBase;
}

/**
 * 
 */
export class Client {
  protected connector: ConnectorBase;

  /**
   * 
   */
  public constructor(options: ClientConfig) {
    this.connector = options.connector;
  }

  /**
   * 
   */
  public async sign(val: string) {
    return this.connector.sign(val);
  }

  /**
   * 
   */
  public async getMutation(id: string): Promise<Mutation> {
    return this.connector.getMutation(id);
  }

  /**
   * 
   */
  public async getOrderGateway(id: string = null) {
    return this.connector.getOrderGateway(id);
  }

  /**
   * 
   */
  public async getAssetLedger(id: string) {
    return this.connector.getAssetLedger(id);
  }

  /**
   * 
   */
  public async getValueLedger(id: string) {
    return this.connector.getValueLedger(id);
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
    return new MutationTracker(this.connector);
  }

}
