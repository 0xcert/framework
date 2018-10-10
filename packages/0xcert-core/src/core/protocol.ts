import { IConnector, IRequest, IResponse, ActionId } from './types';
import { EventEmitter } from '../utils/emitter';

/**
 * Protocol client configuration object.
 */
export interface IProtocolConfig {
  connector?: IConnector;
}

/**
 * Protocol client.
 */
export class Protocol extends EventEmitter {
  readonly connector: IConnector;

  /**
   * Class constructor.
   * @param config 
   */
  public constructor(config: IProtocolConfig) {
    super();
    this.connector = config.connector;
  }

  /**
   * Performs protocol action based on the received request object.
   * @param res Protocol request object.
   */
  public async perform(req: IRequest): Promise<IResponse> {
    switch (req.actionId) {
      case ActionId.FOLDER_READ_METADATA:
      case ActionId.FOLDER_READ_SUPPLY:
      case ActionId.FOLDER_READ_CAPABILITIES:
      case ActionId.FOLDER_CHECK_IS_PAUSED:
        return this.connector.perform(req);
      default:
        throw 'Unknown action';
    }
  }

}
