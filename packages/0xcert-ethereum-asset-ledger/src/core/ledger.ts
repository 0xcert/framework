import { GenericProvider, Mutation } from '@0xcert/ethereum-generic-provider';
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
import { CreateAssetOptions, UpdateAssetOptions, UpdateOptions, TransferAssetOptions, AssetLedgerDeployOptions } from './types';
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
  public async getAbilities(accountId: string) {
    // TODO(Kristjan): Available only if xcert.
    return getAbilities(this, accountId);
  }

  /**
   * 
   */
  public async getApprovedAccount(assetId: string) {
    return getApprovedAccount(this, assetId);
  }

  /**
   * 
   */
  public async getAssetAccount(assetId: string) {
    return await getAssetAccount(this, assetId);
  }

  /**
   * 
   */
  public async getAsset(assetId: string) {
    return await getAsset(this, assetId);
  }

  /**
   * 
   */
  public async getBalance(accountId: string) {
    return await getBalance(this, accountId);
  }

  /**
   * 
   */
  public async getCapabilities() {
    // TODO(Kristjan): Available only if xcert.
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
    // TODO(Kristjan): Available only if xcert.
    return getTransferState(this);
  }

  /**
   * 
   */
  public async isApprovedAccount(accountId: string, assetId: string) {
    const account = await getApprovedAccount(this, assetId);
    return account === accountId;
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
    // TODO(Kristjan): Available only if xcert.
    return assignAbilities(this, accountId, abilities);
  }

  /**
   * 
   */
  public async createAsset(data: CreateAssetOptions): Promise<Mutation> {
    // TODO(Kristjan): proof input validation that it is a hex of length 64.
    // TODO(Kristjan): available only if xcert
    return createAsset(this, data.accountId, data.assetId, data.proof);
  }

  /**
   * 
   */
  public async destroyAsset(assetId: string) {
    // TODO(Kristjan): available only if burnable xcert.
    return destroyAsset(this, assetId);
  }

  /**
   * 
   */
  public async revokeAbilities(accountId: string, abilities: AssetLedgerAbility[]): Promise<Mutation> {
    // TODO(Kristjan): Available only if xcert.
    return revokeAbilities(this, accountId, abilities);
  }

  /**
   * 
   */
  public async revokeAsset(assetId: string): Promise<Mutation> {
    // TODO(Kristjan): available only if revokable xcert.
    return revokeAsset(this, assetId);
  }

  /**
   * 
   */
  public async transferAsset(data: TransferAssetOptions): Promise<Mutation> {
    // TODO(Kristjan): validate data.data param if exists.
    if (true) {// TODO(Kristjan): check provider for "unsafe" exceptions.
      return safeTransfer(this, data.to, data.id, data.data);
    }
    else {
      return transfer(this, data.to, data.id);
    }
  }

  /**
   * 
   */
  public async setTransferState(state: AssetLedgerTransferState) {
    // TODO(Kristjan): Available only if pausable xcert.
    return setTransferState(this, state);
  }

  /**
   * 
   */
  public async updateAsset(assetId: string, data: UpdateAssetOptions) {
    // TODO(Kristjan): proof input validation that it is a hex of length 64.
    // TODO(Kristjan): available only if mutable xcert.
    return await updateAsset(this, assetId, data.proof);
  }

  /**
   * 
   */
  public async update(data: UpdateOptions) {
    // TODO(Kristjan): available only if xcert.
    return await update(this, data.uriBase);
  }

}
