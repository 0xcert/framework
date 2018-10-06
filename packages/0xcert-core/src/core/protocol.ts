import { IConnector, IRequest, IResponse, ActionId } from '@0xcert/chain';
import { EventEmitter } from '../utils/emitter';

/**
 * Protocol client configuration object.
 */
export interface IProtocolConfig {
  chain: IConnector;
}

/**
 * Protocol client.
 */
export class Protocol extends EventEmitter implements IConnector {
  public chain: IConnector;

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
    switch (req.actionId) {
      case ActionId.READ_FOLDER_METADATA:
      case ActionId.READ_FOLDER_SUPPLY:
      case ActionId.READ_FOLDER_CAPABILITIES:
        return this.chain.perform(req);
      default:
        throw 'Unknown action';
    }
  }

}
