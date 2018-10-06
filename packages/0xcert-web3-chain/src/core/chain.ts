import * as Web3 from 'web3';
import { IChain, IChainRequest, IChainResponse, ChainAction } from '@0xcert/chain';
import readFolderMetadata from '../resolvers/read-folder-metadata';
import readFolderSupply from '../resolvers/read-folder-supply';
import readFolderCapabilities from '../resolvers/read-folder-capabilities';

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
   * Performs protocol action based on the received request object.
   * @param res Protocol request object.
   */
  public perform(req: IChainRequest): IChainResponse {
    switch (req.action) {
      case ChainAction.FOLDER_READ_METADATA: 
        return readFolderMetadata.call(this, this, req);
      case ChainAction.FOLDER_READ_SUPPLY: 
        return readFolderSupply.call(this, this, req);
      case ChainAction.FOLDER_READ_CAPABILITIES: 
        return readFolderCapabilities.call(this, this, req);
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
