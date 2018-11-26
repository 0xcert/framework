import { ValueLedgerBase } from '@0xcert/scaffold';
import { EthereumConnector } from '@0xcert/ethereum-connector';
import getInfo from '../queries/get-info';
import getSupply from '../queries/get-supply';

/**
 * 
 */
export class ValueLedger /*implements ValueLedgerBase*/ {
  protected connector: EthereumConnector;
  readonly id: string;

  /**
   * 
   */
  public constructor(connector: EthereumConnector, id: string) {
    this.connector = connector;
    this.id = id;
  }

  /**
   * 
   */
  public async getInfo() {
    return getInfo(this.connector, this.id);
  }

  /**
   * 
   */
  public async getSupply() {
    return getSupply(this.connector, this.id);
  }

}
