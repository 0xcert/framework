import { Context } from '@0xcert/web3-context';
import { AssetLedgerBase, AssetLedgerTransferState, AssetLedgerAbility, AssetLedgerCapability } from "@0xcert/scaffold";
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
export class AssetLedger implements AssetLedgerBase {
  readonly platform: string = 'web3';
  readonly context: Context;
  readonly contract: any;
  readonly id: string;

  /**
   * 
   */
  public constructor(context: Context, ledgerId: string) {
    this.context = context;
    this.id = ledgerId;

    this.contract = this.getContract(ledgerId);
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
  public async assignAbilities(accountId: string, abilities: AssetLedgerAbility[]) {
    return assignAbilities(this, accountId, abilities);
  }

  /**
   * 
   */
  public async revokeAbilities(accountId: string, abilities: AssetLedgerAbility[]) {
    return revokeAbilities(this, accountId, abilities);
  }

  /**
   * 
   */
  public async setTransferState(state: AssetLedgerTransferState) {
    return setTransferState(this, state);
  }

  /**
   * 
   */
  protected getContract(ledgerId: string) {
    return new this.context.web3.eth.Contract(env.xcertAbi, ledgerId, { gas: 6000000 });
  }

}
