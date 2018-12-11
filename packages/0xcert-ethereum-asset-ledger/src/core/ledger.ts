import { GenericProvider, Mutation } from '@0xcert/ethereum-generic-provider';
import { normalizeAddress } from '@0xcert/ethereum-utils';
import { AssetLedgerBase, AssetLedgerDeployRecipe, AssetLedgerAbility,
  AssetLedgerItem, AssetLedgerCapability, AssetLedgerInfo, AssetLedgerItemRecipe,
  AssetLedgerTransferRecipe, AssetLedgerObjectUpdateRecipe,
  AssetLedgerUpdateRecipe, OrderGatewayBase} from "@0xcert/scaffold";
import deploy from '../mutations/deploy';
import getAbilities from '../queries/get-abilities';
import getApprovedAccount from '../queries/get-approved-account';
import getAssetAccount from '../queries/get-asset-account';
import getAsset from '../queries/get-asset';
import getBalance from '../queries/get-balance';
import getCapabilities from '../queries/get-capabilities';
import getInfo from '../queries/get-info';
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
import setApprovalForAll from '../mutations/set-approval-for-all';
import isApprovedForAll from '../queries/is-approved-for-all';

/**
 * 
 */
export class AssetLedger  { // implements AssetLedgerBase
  protected $id: string;
  protected $provider: GenericProvider;

  /**
   * 
   */
  public constructor(provider: GenericProvider, id: string) {
    this.$id = normalizeAddress(id);
    this.$provider = provider;
  }

  /**
   * 
   */
  public get id() {
    return this.$id;
  }

  /**
   * 
   */
  public get provider() {
    return this.$provider;
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
  public async isApprovedAccount(assetId: string, accountId: string | OrderGatewayBase): Promise<boolean> {
    if (typeof accountId !== 'string') {
      accountId = await (accountId as any).getProxyAccountId(this.getProxyId());
    }
    return accountId === await getApprovedAccount(this, assetId);
  }

    /**
   * 
   */
  public async isTransferable(): Promise<boolean> {
    return isEnabled(this);
  }

  /**
   * 
   */
  public async approveAccount(assetId: string, accountId: string | OrderGatewayBase): Promise<Mutation> {
    if (typeof accountId !== 'string') {
      accountId = await (accountId as any).getProxyAccountId(this.getProxyId());
    }
    return approveAccount(this, accountId as string, assetId);
  }

  /**
   * 
   */
  public async disapproveAccount(assetId: string): Promise<Mutation> {
    return approveAccount(this, '0x0000000000000000000000000000000000000000', assetId);
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
  public async createAsset(recipe: AssetLedgerItemRecipe): Promise<Mutation> {
    // TODO(Kristjan): imprint input validation that it is a hex of length 64.
    return createAsset(this, recipe.receiverId, recipe.id, recipe.imprint);
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
    return this.provider.unsafeRecipientIds.indexOf(recipe.receiverId) !== -1
      ? transfer(this, recipe.receiverId, recipe.id)
      : safeTransfer(this, recipe.receiverId, recipe.id, recipe.data);
  }

  /**
   * 
   */
  public async enableTransfer(): Promise<Mutation> {
    return setEnabled(this, true);
  }

  /**
   * 
   */
  public async disableTransfer(): Promise<Mutation> {
    return setEnabled(this, false);
  }

  /**
   * 
   */
  public async updateAsset(assetId: string, recipe: AssetLedgerObjectUpdateRecipe): Promise<Mutation> {
    // TODO(Kristjan): imprint input validation that it is a hex of length 64.
    return updateAsset(this, assetId, recipe.imprint);
  }

  /**
   * 
   */
  public async update(recipe: AssetLedgerUpdateRecipe): Promise<Mutation> {
    return update(this, recipe.uriBase);
  }

  /**
   * 
   */
  public async approveOperator(accountId: string | OrderGatewayBase): Promise<Mutation> {
    if (typeof accountId !== 'string') {
      accountId = await (accountId as any).getProxyAccountId(this.getProxyId());
    }
    return setApprovalForAll(this, accountId as string, true);
  }

  /**
   * 
   */
  public async disapproveOperator(accountId: string | OrderGatewayBase): Promise<Mutation> {
    if (typeof accountId !== 'string') {
      accountId = await (accountId as any).getProxyAccountId(this.getProxyId());
    }
    return setApprovalForAll(this, accountId as string, false);
  }

  /**
   * 
   */
  public async isApprovedOperator(accountId: string, operatorId: string | OrderGatewayBase): Promise<boolean> {
    if (typeof operatorId !== 'string') {
      operatorId = await (operatorId as any).getProxyAccountId(this.getProxyId());
    }
    return isApprovedForAll(this, accountId, operatorId as string);
  }

  /**
   * 
   */
  protected getProxyId() {
    return this.provider.unsafeRecipientIds.indexOf(this.id) === -1
      ? 3 // OrderGatewayProxy.NFTOKEN_SAFE_TRANSFER
      : 2 // OrderGatewayProxy.NFTOKEN_TRANSFER;
  }

}
