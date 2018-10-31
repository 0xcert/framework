import { FolderBase, FolderTransferState, MutationOptions, GetTransferStateResult,
  GetSupplyResult } from "@0xcert/folder";
import { Query, Mutation } from '@0xcert/web3-intents';
import * as env from '../config/env';

/**
 * 
 */
export interface FolderConfig {
  web3: any;
  confirmations?: number;
  makerId?: string;
  folderId?: string;
}

/**
 * 
 */
export class Folder implements FolderBase {
  protected config: FolderConfig;
  protected contract: any;

  /**
   * 
   */
  public constructor(config: FolderConfig) {
    this.config = config;
    this.contract = new config.web3.eth.Contract(env.xcertAbi, config.folderId, { gas: 6000000 });
  }

  /**
   * 
   */
  public async getSupply() {
    return new Query<GetSupplyResult>().resolve(
      async () => {
        const total = parseInt(await this.contract.methods.totalSupply().call());
        return { total };
      }
    );
  }

  /**
   * 
   */
  public async getTransferState() {
    return new Query<GetTransferStateResult>().resolve(
      async () => {
        const paused = await this.contract.methods.isPaused().call();
        const state = paused ? FolderTransferState.DISABLED : FolderTransferState.ENABLED;
        return { state };
      }
    );
  }

  /**
   * 
   */
  public async setTransferState(state: FolderTransferState, options: MutationOptions = {}) {
    const paused = state !== FolderTransferState.ENABLED;
    const from = await this.findMakerId(options);

    return new Mutation(this.config).resolve(
      () => {
        return this.contract.methods.setPause(paused).send({ from });
      },
    );
  }

  /**
   * 
   */
  protected async findMakerId(options?: MutationOptions) {
    const config = { ...this.config, ...options };
    return (
      config.makerId
      || await this.config.web3.eth.getAccounts().then((a) => a[0])
    );
  }

}
