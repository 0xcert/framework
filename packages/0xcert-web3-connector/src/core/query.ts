import { QueryEmitter, QueryEvent, ConnectorError } from '@0xcert/connector';
import { Connector } from './connector';
import { EventEmitter } from 'eventemitter3';
import { parseError } from './errors';

/**
 * Abstract Web3 query class.
 */
export abstract class Web3Query extends EventEmitter {
  protected connector: Connector;

  /**
   * Class constructor.
   * @param connector Connector class instance.
   */
  public constructor(connector: Connector) {
    super();
    this.connector = connector;
  }

  /**
   * Performs the resolver and stores the result to result class variable.
   * @param resolver Mutation resolve function.
   */
  protected async exec(resolver: () => any) {
    try {
      return await resolver();
    } catch (error) {
      throw parseError(error);
    }
  }

}
