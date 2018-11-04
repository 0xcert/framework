import { Connector } from '@0xcert/web3-connector';
import { FolderBase, FolderTransferState, FolderAbility, FolderCapability } from "@0xcert/scaffold";
import getAbilities from '../queries/get-abilities';
import getCapabilities from '../queries/get-capabilities';
import getInfo from '../queries/get-info';
import getSupply from '../queries/get-supply';
import getTransferState from '../queries/get-transfer-state';
import assignAbilities from '../mutations/assign-abilities';
import revokeAbilities from '../mutations/revoke-abilities';
import setTransferState from '../mutations/set-transfer-state';
import * as env from '../config/env';

/**
 * 
 */
export class Folder implements FolderBase {
  readonly platform: string = 'web3';
  readonly connector: Connector;
  readonly contract: any;

  /**
   * 
   */
  public constructor(connector: Connector, folderId: string) {
    this.connector = connector;
    this.contract = this.getFolder(folderId);
  }

  /**
   * 
   */
  public async getAbilities(accountId: string) {
    return getAbilities(this, accountId);
  }

  /**
   * 
   */
  public async getCapabilities() {
    return getCapabilities(this);
  }

  /**
   * 
   */
  public async getInfo() {
    return getInfo(this);
  }

  /**
   * 
   */
  public async getSupply() {
    return getSupply(this);
  }

  /**
   * 
   */
  public async getTransferState() {
    return getTransferState(this);
  }

  /**
   * 
   */
  public async assignAbilities(accountId: string, abilities: FolderAbility[]) {
    return assignAbilities(this, accountId, abilities);
  }

  /**
   * 
   */
  public async revokeAbilities(accountId: string, abilities: FolderAbility[]) {
    return revokeAbilities(this, accountId, abilities);
  }

  /**
   * 
   */
  public async setTransferState(state: FolderTransferState) {
    return setTransferState(this, state);
  }

  /**
   * 
   */
  protected getFolder(folderId: string) {
    return new this.connector.web3.eth.Contract(env.xcertAbi, folderId, { gas: 6000000 });
  }

}
