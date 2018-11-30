import { GenericProvider, Mutation } from '@0xcert/ethereum-generic-provider';
import { AssetLedgerBase, AssetLedgerTransferState, AssetLedgerAbility,
  AssetLedgerCapability } from "@0xcert/scaffold";
import { CreateAssetOptions, UpdateAssetOptions, UpdateOptions,TransferAssetOptions,
  AssetLedgerDeployOptions, AssetObject, InfoObject } from './types';
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
import updateAsset from '../mutations/update-asset';
import destroyAsset from '../mutations/destroy-asset';
import revokeAsset from '../mutations/revoke-asset';
import update from '../mutations/update';
import transfer from '../mutations/transfer';
import safeTransfer from '../mutations/safe-transfer';
import getBalance from '../queries/get-balance';
import getAssetAccount from '../queries/get-asset-account';
import getAsset from '../queries/get-asset';
import deploy from '../mutations/deploy';

/**
 * 
 */
export class AssetLedger /*implements AssetLedgerBase*/ {
  readonly provider: GenericProvider;
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
  public static async deploy(provider: GenericProvider, options: AssetLedgerDeployOptions): Promise<Mutation> {
    return deploy(provider, options);
  }

  /**
   * 
   */
  public static getInstance(provider: GenericProvider, id: string): AssetLedger {
    return new AssetLedger(provider, id);
  }

  /**
   * 
   */
  public async getAbilities(accountId: string): Promise<AssetLedgerAbility[]> {
    return getAbilities(this, accountId);
  }

  /**
   * 
   */
  public async getApprovedAccount(assetId: string): Promise<string> {
    return getApprovedAccount(this, assetId);
  }

  /**
   * 
   */
  public async getAssetAccount(assetId: string): Promise<string> {
    return getAssetAccount(this, assetId);
  }

  /**
   * 
   */
  public async getAsset(assetId: string): Promise<AssetObject> {
    return getAsset(this, assetId);
  }

  /**
   * 
   */
  public async getBalance(accountId: string): Promise<string> {
    return getBalance(this, accountId);
  }

  /**
   * 
   */
  public async getCapabilities(): Promise<AssetLedgerCapability[]> {
    return getCapabilities(this);
  }

  /**
   * 
   */
  public async getInfo(): Promise<InfoObject> {
    return getInfo(this);
  }

  /**
   * 
   */
  public async getSupply(): Promise<string> {
    return getSupply(this);
  }

  /**
   * 
   */
  public async getTransferState(): Promise<AssetLedgerTransferState> {
    return getTransferState(this);
  }

  /**
   * 
   */
  public async isApprovedAccount(accountId: string, assetId: string): Promise<boolean> {
    return accountId === await getApprovedAccount(this, assetId);
  }

  /**
   * 
   */
  public async approveAccount(accountId: string, tokenId: string): Promise<Mutation> {
    return approveAccount(this, accountId, tokenId);
  }

  /**
   * 
   */
  public async assignAbilities(accountId: string, abilities: AssetLedgerAbility[]): Promise<Mutation> {
    return assignAbilities(this, accountId, abilities);
  }

  /**
   * 
   */
  public async createAsset(data: CreateAssetOptions): Promise<Mutation> {
    // TODO(Kristjan): proof input validation that it is a hex of length 64.
    return createAsset(this, data.accountId, data.assetId, data.proof);
  }

  /**
   * 
   */
  public async destroyAsset(assetId: string): Promise<Mutation> {
    return destroyAsset(this, assetId);
  }

  /**
   * 
   */
  public async revokeAbilities(accountId: string, abilities: AssetLedgerAbility[]): Promise<Mutation> {
    return revokeAbilities(this, accountId, abilities);
  }

  /**
   * 
   */
  public async revokeAsset(assetId: string): Promise<Mutation> {
    return revokeAsset(this, assetId);
  }

  /**
   * 
   */
  public async transferAsset(data: TransferAssetOptions): Promise<Mutation> {
    // TODO(Kristjan): validate data.data param if exists.
    if (true) { // TODO(Kristjan): check provider for "unsafe" exceptions.
      return safeTransfer(this, data.to, data.id, data.data);
    }
    else {
      return transfer(this, data.to, data.id);
    }
  }

  /**
   * 
   */
  public async setTransferState(state: AssetLedgerTransferState): Promise<Mutation> {
    return setTransferState(this, state);
  }

  /**
   * 
   */
  public async updateAsset(assetId: string, data: UpdateAssetOptions): Promise<Mutation> {
    // TODO(Kristjan): proof input validation that it is a hex of length 64.
    return updateAsset(this, assetId, data.proof);
  }

  /**
   * 
   */
  public async update(data: UpdateOptions): Promise<Mutation> {
    return update(this, data.uriBase);
  }

}
