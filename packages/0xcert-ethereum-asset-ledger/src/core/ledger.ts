import { GenericProvider, Mutation } from '@0xcert/ethereum-generic-provider';
import { AssetLedgerBase, AssetLedgerDeployRecipe, AssetLedgerAbility,
  AssetLedgerItem, AssetLedgerCapability, AssetLedgerInfo, AssetLedgerItemRecipe,
  AssetLedgerTransferRecipe, AssetLedgerObjectUpdateRecipe,
  AssetLedgerUpdateRecipe } from "@0xcert/scaffold";
import deploy from '../mutations/deploy';
import getAbilities from '../queries/get-abilities';
import getApprovedAccount from '../queries/get-approved-account';
import getAssetAccount from '../queries/get-asset-account';
import getAsset from '../queries/get-asset';
import getBalance from '../queries/get-balance';
import getCapabilities from '../queries/get-capabilities';
import getInfo from '../queries/get-info';
import getSupply from '../queries/get-supply';
import isEnabled from '../queries/is-enabled';
import approveAccount from '../mutations/approve-account';
import assignAbilities from '../mutations/assign-abilities';
import createAsset from '../mutations/create-asset';
import destroyAsset from '../mutations/destroy-asset';
import revokeAbilities from '../mutations/revoke-abilities';
import revokeAsset from '../mutations/revoke-asset';
import setEnabled from '../mutations/set-enabled';
import safeTransfer from '../mutations/safe-transfer';
import transfer from '../mutations/transfer';
import updateAsset from '../mutations/update-asset';
import update from '../mutations/update';

/**
 * 
 */
export class AssetLedger implements AssetLedgerBase {
  readonly id: string;
  readonly provider: GenericProvider;

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
  public static async deploy(provider: GenericProvider, recipe: AssetLedgerDeployRecipe): Promise<Mutation> {
    return deploy(provider, recipe);
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
  public async getAsset(assetId: string): Promise<AssetLedgerItem> {
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
  public async getInfo(): Promise<AssetLedgerInfo> {
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
  public async isApprovedAccount(accountId: string, assetId: string): Promise<boolean> {
    return accountId === await getApprovedAccount(this, assetId);
  }

    /**
   * 
   */
  public async isEnabled(): Promise<boolean> {
    return isEnabled(this);
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
  public async createAsset(input: AssetLedgerItemRecipe): Promise<Mutation> {
    // TODO(Kristjan): proof input validation that it is a hex of length 64.
    return createAsset(this, input.accountId, input.assetId, input.proof);
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
  public async transferAsset(recipe: AssetLedgerTransferRecipe): Promise<Mutation> {
    // TODO(Kristjan): validate data.data param if exists.
    if (true) { // TODO(Kristjan): check provider for "unsafe" exceptions.
      return safeTransfer(this, recipe.to, recipe.id, recipe.data);
    }
    else {
      return transfer(this, recipe.to, recipe.id);
    }
  }

  /**
   * 
   */
  public async setEnabled(enabled: boolean): Promise<Mutation> {
    return setEnabled(this, enabled);
  }

  /**
   * 
   */
  public async updateAsset(assetId: string, recipe: AssetLedgerObjectUpdateRecipe): Promise<Mutation> {
    // TODO(Kristjan): proof input validation that it is a hex of length 64.
    return updateAsset(this, assetId, recipe.proof);
  }

  /**
   * 
   */
  public async update(recipe: AssetLedgerUpdateRecipe): Promise<Mutation> {
    return update(this, recipe.uriBase);
  }

}
