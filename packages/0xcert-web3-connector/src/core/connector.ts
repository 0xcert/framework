import * as Web3 from 'web3';
import { IConnector, IConnectorRequest, IConnectorResponse, ConnectorAction } from '@0xcert/connector';
import folderReadMetadata from '../resolvers/folder-read-metadata';
import folderReadSupply from '../resolvers/folder-read-supply';
import folderReadCapabilities from '../resolvers/folder-read-capabilities';
import folderCheckIsPaused from '../resolvers/folder-check-is-paused';

/**
 * Web3 connector.
 */
export class Connector implements IConnector {
  readonly web3: Web3;

  /**
   * Class constructor.
   * @param web3 Web3 object instance or web3 provider object.
   */
  public constructor(web3?: any) {
    this.web3 = new Web3(this.getProvider(web3));
  }

  /**
   * Performs action based on the received request object.
   * @param res Protocol request object.
   */
  public perform(req: IConnectorRequest): IConnectorResponse {
    switch (req.action) {
      case ConnectorAction.FOLDER_READ_METADATA:
        return folderReadMetadata.call(this, this, req);
      case ConnectorAction.FOLDER_READ_SUPPLY:
        return folderReadSupply.call(this, this, req);
      case ConnectorAction.FOLDER_READ_CAPABILITIES:
        return folderReadCapabilities.call(this, this, req);
      case ConnectorAction.FOLDER_CHECK_IS_PAUSED:
        return folderCheckIsPaused.call(this, this, req);
      default:
        throw 'Unknown action'; 
    }
  }

  /**
   * Returns best web3 provider.
   * @param web3 Web3 object instance or web3 provider object.
   */
  protected getProvider(web3?: any) {
    if (web3 && web3.currentProvider) {
      return web3.currentProvider;
    } else if (!web3.currentProvider) {
      return 'http://localhost:8545';
    }
  }

}
