import { FolderBase, FolderTransferState, MutationOptions, GetTransferStateResult, GetSupplyResult } from "@0xcert/connector";
import { Context } from "./context";
import { Query } from "./query";
import { Mutation } from "./mutation";
import * as env from '../config/env';

/**
 * 
 */
export class Folder implements FolderBase {
  protected context: Context;
  protected contract: any;

  /**
   * 
   */
  public constructor(folderId, context) {
    this.context = context;
    this.contract = new context.web3.eth.Contract(env.xcertAbi, folderId, { gas: 6000000 });
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

    return new Mutation(options, this.context).resolve(
      (from) => {
        return this.contract.methods.setPause(paused).send({ from });
      },
    );
  }

}
