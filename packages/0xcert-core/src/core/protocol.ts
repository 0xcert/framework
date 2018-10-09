import { IChain, IRequest, IResponse, ChainAction } from './types';
import { EventEmitter } from '../utils/emitter';

/**
 * Protocol client configuration object.
 */
export interface IProtocolConfig {
  chain?: IChain;
}

/**
 * Protocol client.
 */
export class Protocol extends EventEmitter {
  readonly chain: IChain;

  /**
   * Class constructor.
   * @param config 
   */
  public constructor(config: IProtocolConfig) {
    super();
    this.chain = config.chain;
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
      default:
        throw 'Unknown action';
    }
  }

}
