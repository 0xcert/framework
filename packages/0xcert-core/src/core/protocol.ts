import { IChain, IStore, IRequest, IResponse, ChainAction, StoreAction } from './types';
import { EventEmitter } from '../utils/emitter';

/**
 * Protocol client configuration object.
 */
export interface IProtocolConfig {
  chain?: IChain;
  store?: IStore;
}

/**
 * Protocol client.
 */
export class Protocol extends EventEmitter {
  readonly chain: IChain;
  readonly store: IStore;

  /**
   * Class constructor.
   * @param config 
   */
  public constructor(config: IProtocolConfig) {
    super();
    this.chain = config.chain;
    this.store = config.store;
  }

  /**
   * Performs protocol action based on the received request object.
   * @param res Protocol request object.
   */
  public async perform(req: IRequest): Promise<IResponse> {
    switch (req.action) {
      case ChainAction.FOLDER_READ_METADATA:
      case ChainAction.FOLDER_READ_SUPPLY:
      case ChainAction.FOLDER_READ_CAPABILITIES:
      case ChainAction.FOLDER_CHECK_IS_PAUSED:
        return this.chain.perform(req);
      case StoreAction.FILE_CREATE:
      case StoreAction.FILE_UPDATE:
      case StoreAction.FILE_DELETE:
        return this.store.perform(req);
      default:
        throw 'Unknown action';
    }
  }

}
