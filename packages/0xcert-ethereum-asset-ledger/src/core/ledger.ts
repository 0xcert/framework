import { GenericProvider } from '@0xcert/ethereum-generic-provider';
import { AssetLedgerBase, AssetLedgerTransferState, AssetLedgerAbility, AssetLedgerCapability } from "@0xcert/scaffold";
import getAbilities from '../queries/get-abilities';
import getCapabilities from '../queries/get-capabilities';
import getInfo from '../queries/get-info';
import getSupply from '../queries/get-supply';
import getTransferState from '../queries/get-transfer-state';
import assignAbilities from '../mutations/assign-abilities';
import revokeAbilities from '../mutations/revoke-abilities';
import setTransferState from '../mutations/set-transfer-state';
import approveAccount from '../mutations/approve-account';
import getApprovedAccount from '../queries/get-approved-account';
import createAsset from '../mutations/create-asset';
import { CreateAssetOptions } from './types';

/**
 * 
 */
export class AssetLedger /*implements AssetLedgerBase*/ {
  protected provider: GenericProvider;
  readonly id: string;

  /**
   * 
   */
  public constructor(provider: GenericProvider, id: string) {
    this.provider = provider;
    this.id = id;
  }

  /**
   * 
   */
  public async assignAbilities(accountId: string, abilities: AssetLedgerAbility[]) {
    return assignAbilities(this.provider, this.id, accountId, abilities);
  }

  /**
   * 
   */
  public async getAbilities(accountId: string) {
    return getAbilities(this.provider, this.id, accountId);
  }

  /**
   * 
   */
  public async getCapabilities() {
    return getCapabilities(this.provider, this.id);
  }

  /**
   * 
   */
  public async getInfo() {
    return getInfo(this.provider, this.id);
  }

  /**
   * 
   */
  public async getSupply() {
    return getSupply(this.provider, this.id);
  }

  /**
   * 
   */
  public async getTransferState() {
    return getTransferState(this.provider, this.id);
  }

  /**
   * 
   */
  public async revokeAbilities(accountId: string, abilities: AssetLedgerAbility[]) {
    return revokeAbilities(this.provider, this.id, accountId, abilities);
  }

  /**
   * 
   */
  public async setTransferState(state: AssetLedgerTransferState) {
    return setTransferState(this.provider, this.id, state);
  }

  /**
   * 
   */
  public async approveAccount(accountId: string, tokenId: string) {
    return approveAccount(this.provider, this.id, accountId, tokenId);
  }

  /**
   * 
   */
  public async getApprovedAccount(assetId: string) {
    return getApprovedAccount(this.provider, this.id, assetId);
  }

  /**
   * 
   */
  public async isApprovedAccount(accountId: string, assetId: string) {
    const account = await getApprovedAccount(this.provider, this.id, assetId);
    return account === accountId;
  }

  /**
   * 
   */
  public async createAsset(data: CreateAssetOptions) {
    // TODO(Kristjan): proof input validation that it is a hex of length 64.
    return await createAsset(this.provider, this.id, data.accountId, data.assetId, data.proof);
  }
}
