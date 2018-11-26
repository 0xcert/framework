import { Connector } from '@0xcert/ethereum-connector';
import { AssetLedgerBase, AssetLedgerTransferState, AssetLedgerAbility, AssetLedgerCapability } from "@0xcert/scaffold";
import getAbilities from '../queries/get-abilities';
import getCapabilities from '../queries/get-capabilities';
import getInfo from '../queries/get-info';
import getSupply from '../queries/get-supply';
import getTransferState from '../queries/get-transfer-state';
import assignAbilities from '../mutations/assign-abilities';
import revokeAbilities from '../mutations/revoke-abilities';
import setTransferState from '../mutations/set-transfer-state';

/**
 * 
 */
export class AssetLedger /*implements AssetLedgerBase*/ {
  protected connector: Connector;
  readonly id: string;

  /**
   * 
   */
  public constructor(connector: Connector, id: string) {
    this.connector = connector;
    this.id = id;
  }

  /**
   * 
   */
  public async assignAbilities(accountId: string, abilities: AssetLedgerAbility[]) {
    return assignAbilities(this.connector, this.id, accountId, abilities);
  }

  /**
   * 
   */
  public async getAbilities(accountId: string) {
    return getAbilities(this.connector, this.id, accountId);
  }

  /**
   * 
   */
  public async getCapabilities() {
    return getCapabilities(this.connector, this.id);
  }

  /**
   * 
   */
  public async getInfo() {
    return getInfo(this.connector, this.id);
  }

  /**
   * 
   */
  public async getSupply() {
    return getSupply(this.connector, this.id);
  }

  /**
   * 
   */
  public async getTransferState() {
    return getTransferState(this.connector, this.id);
  }

  /**
   * 
   */
  public async revokeAbilities(accountId: string, abilities: AssetLedgerAbility[]) {
    return revokeAbilities(this.connector, this.id, accountId, abilities);
  }

  /**
   * 
   */
  public async setTransferState(state: AssetLedgerTransferState) {
    return setTransferState(this.connector, this.id, state);
  }

}
