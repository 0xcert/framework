import { QueryBase, QueryRecipe, QueryResult } from '@0xcert/connector';
import { Connector } from './connector';
import * as env from '../config/env';
import { EventEmitter } from 'events';

/**
 * Abstract Web3 query class.
 */
export abstract class Web3Query extends EventEmitter implements QueryBase {
  protected connector: Connector;
  protected recipe: QueryRecipe;
  protected result: QueryResult;

  /**
   * Class constructor.
   * @param connector Connector class instance.
   * @param recipe Query recipe.
   */
  public constructor(connector: Connector, recipe: QueryRecipe) {
    super();
    this.connector = connector;
    this.recipe = recipe;
  }

  /**
   * Returns serialized query data.
   */
  public serialize(): QueryResult {
    return this.result;
  }

  /**
   * Performs query resolver.
   * NOTE: This method should be overriden!
   */
  public async resolve(): Promise<this> {
    throw 'Not implemented!';
  }

  /**
   * Returns Xcert smart contract instance.
   */
  protected getFolder(folderId: string) {
    return new this.connector.web3.eth.Contract(env.xcertAbi, folderId);
  }

}
