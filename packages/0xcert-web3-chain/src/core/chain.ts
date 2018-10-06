import * as Web3 from 'web3';
import { IChain, IChainRequest, IChainResponse, ChainAction } from '@0xcert/chain';
import folderReadMetadata from '../resolvers/folder-read-metadata';
import folderReadSupply from '../resolvers/folder-read-supply';
import folderReadCapabilities from '../resolvers/folder-read-capabilities';

/**
 * Web3 chain connector.
 */
export class Chain implements IChain {
  readonly web3: Web3;

  /**
   * Class constructor.
   * @param web3 Web3 object instance or web3 provider object.
   */
  public constructor(web3?: any) {
    this.web3 = new Web3(this.getProvider(web3));
  }

  /**
   * Performs chain action based on the received request object.
   * @param res Protocol request object.
   */
  public perform(req: IChainRequest): IChainResponse {
    switch (req.action) {
      case ChainAction.FOLDER_READ_METADATA: 
        return folderReadMetadata.call(this, this, req);
      case ChainAction.FOLDER_READ_SUPPLY: 
        return folderReadSupply.call(this, this, req);
      case ChainAction.FOLDER_READ_CAPABILITIES: 
        return folderReadCapabilities.call(this, this, req);
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
