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
 * Ethereum asset ledger implementation.
 */
export class AssetLedger implements AssetLedgerBase {
  protected $id: string;
  protected $provider: GenericProvider;

  /**
   * Initialize asset ledger.
   * @param provider Provider class with which we comunicate with blockchain.
   * @param id Address of the erc721/xcert smart contract.
   */
  public constructor(provider: GenericProvider, id: string) {
    this.$id = normalizeAddress(id);
    this.$provider = provider;
  }

  /**
   * Gets the address of the smart contract that represents this asset ledger.
   */
  public get id() {
    return this.$id;
  }

  /**
   * Gets the provider that is used to comunicate with blockchain.
   */
  public get provider() {
    return this.$provider;
  }

  /**
   * Deploys a new smart contract representing asset ledger to the blockchain. 
   * @param provider Provider class with which we comunicate with blockchain.
   * @param recipe Data needed to deploy a new asset ledger.
   */
  public static async deploy(provider: GenericProvider, recipe: AssetLedgerDeployRecipe): Promise<Mutation> {
    return deploy(provider, recipe);
  }

  /**
   * Gets an instance of already deployed asset ledger.
   * @param provider Provider class with which we comunicate with blockchain.
   * @param id Address of the erc721/xcert smart contract.
   */
  public static getInstance(provider: GenericProvider, id: string): AssetLedger {
    return new AssetLedger(provider, id);
  }

  /**
   * Gets a list of abilities an account has for this asset ledger.
   * @param accountId Account address for wich we want to get abilities.
   */
  public async getAbilities(accountId: string): Promise<AssetLedgerAbility[]> {
    return getAbilities(this, accountId);
  }

  /**
   * Gets accountId if anyone is approved for this asset.
   * @param assetId Id of the asset.
   */
  public async getApprovedAccount(assetId: string): Promise<string> {
    return getApprovedAccount(this, assetId);
  }

  /**
   * Gets the assets owner accountId.
   * @param assetId Id of the asset.
   */
  public async getAssetAccount(assetId: string): Promise<string> {
    return getAssetAccount(this, assetId);
  }

  /**
   * Gets information about the asset(id, uri, imprint).
   * @param assetId Id of the asset.
   */
  public async getAsset(assetId: string): Promise<AssetLedgerItem> {
    return getAsset(this, assetId);
  }

  /**
   * Gets the count of assets an account owns.
   * @param accountId Address for which we want asset count.
   */
  public async getBalance(accountId: string): Promise<string> {
    return getBalance(this, accountId);
  }

  /**
   * Gets a list of all asset ledger capabilities(options). 
   */
  public async getCapabilities(): Promise<AssetLedgerCapability[]> {
    return getCapabilities(this);
  }

  /**
   * Gets information about the asset ledger (name, symbol, uriBase, schemaId, supply).
   */
  public async getInfo(): Promise<AssetLedgerInfo> {
    return getInfo(this);
  }

  /**
   * Checks if a specific account is approved for a specific asset.
   * @param assetId Id of the asset.
   * @param accountId Id of the account.
   */
  public async isApprovedAccount(assetId: string, accountId: string | OrderGatewayBase): Promise<boolean> {
    if (typeof accountId !== 'string') {
      accountId = await (accountId as any).getProxyAccountId(this.getProxyId());
    }
    return accountId === await getApprovedAccount(this, assetId);
  }

  /**
   * Checks if transfers on the asset ledger are enabled.
   */
  public async isTransferable(): Promise<boolean> {
    return isEnabled(this);
  }

  /**
   * Approves another account so it can transfer the specific asset.
   * @param assetId Id of the asset.
   * @param accountId Id of the account.
   */
  public async approveAccount(assetId: string, accountId: string | OrderGatewayBase): Promise<Mutation> {
    if (typeof accountId !== 'string') {
      accountId = await (accountId as any).getProxyAccountId(this.getProxyId());
    }
    return approveAccount(this, accountId as string, assetId);
  }

  /**
   * Disapproves approved account for a specific asset.
   * @param assetId Asset id.
   */
  public async disapproveAccount(assetId: string): Promise<Mutation> {
    return approveAccount(this, '0x0000000000000000000000000000000000000000', assetId);
  }

  /**
   * Gives an account abilities.
   * @param accountId Id of the account.
   * @param abilities List of the abilities.
   */
  public async assignAbilities(accountId: string, abilities: AssetLedgerAbility[]): Promise<Mutation> {
    return assignAbilities(this, accountId, abilities);
  }

  /**
   * Creates a new asset.
   * @param recipe Data from which the new asset is created.
   */
  public async createAsset(recipe: AssetLedgerItemRecipe): Promise<Mutation> {
    // TODO(Kristjan): imprint input validation that it is a hex of length 64.
    return createAsset(this, recipe.receiverId, recipe.id, recipe.imprint);
  }

  /**
   * Destoys an existing asset (only asset owner can do this).
   * @param assetId Id of the asset.
   */
  public async destroyAsset(assetId: string): Promise<Mutation> {
    return destroyAsset(this, assetId);
  }

  /**
   * Removes abilities from account.
   * @param accountId Id of the account.
   * @param abilities List of the abilities.
   */
  public async revokeAbilities(accountId: string, abilities: AssetLedgerAbility[]): Promise<Mutation> {
    return revokeAbilities(this, accountId, abilities);
  }

  /**
   * Destroys an existing asset (only someone with asset ledger revoke ability can do this).
   * @param assetId If of the asset.
   */
  public async revokeAsset(assetId: string): Promise<Mutation> {
    return revokeAsset(this, assetId);
  }

  /**
   * Transfers asset to another account.
   * @param recipe Data needed for the transfer.
   */
  public async transferAsset(recipe: AssetLedgerTransferRecipe): Promise<Mutation> {
    return this.provider.unsafeRecipientIds.indexOf(recipe.receiverId) !== -1
      ? transfer(this, recipe.receiverId, recipe.id)
      : safeTransfer(this, recipe.receiverId, recipe.id, recipe.data);
  }

  /**
   * Enables transfers of asset on the asset ledger.
   */
  public async enableTransfer(): Promise<Mutation> {
    return setEnabled(this, true);
  }

  /**
   * Disables transfers of asset on the asset ledger.
   */
  public async disableTransfer(): Promise<Mutation> {
    return setEnabled(this, false);
  }

  /**
   * Updates data on an existing asset.
   * @param assetId Id of the asset.
   * @param recipe Data to update asset with.
   */
  public async updateAsset(assetId: string, recipe: AssetLedgerObjectUpdateRecipe): Promise<Mutation> {
    // TODO(Kristjan): imprint input validation that it is a hex of length 64.
    return updateAsset(this, assetId, recipe.imprint);
  }

  /**
   * Updates asset ledger data.
   * @param recipe Data to update asset ledger with.
   */
  public async update(recipe: AssetLedgerUpdateRecipe): Promise<Mutation> {
    return update(this, recipe.uriBase);
  }

  /**
   * Approves an account as an operator (meaning he has full controll of all of your assets).
   * @param accountId Account id.
   */
  public async approveOperator(accountId: string | OrderGatewayBase): Promise<Mutation> {
    if (typeof accountId !== 'string') {
      accountId = await (accountId as any).getProxyAccountId(this.getProxyId());
    }
    return setApprovalForAll(this, accountId as string, true);
  }

  /**
   * Disapproves an account as an operator.
   * @param accountId Account id.
   */
  public async disapproveOperator(accountId: string | OrderGatewayBase): Promise<Mutation> {
    if (typeof accountId !== 'string') {
      accountId = await (accountId as any).getProxyAccountId(this.getProxyId());
    }
    return setApprovalForAll(this, accountId as string, false);
  }

  /**
   * Checks if specific account is the operator for specific account.
   * @param accountId Account id.
   * @param operatorId Operator account id.
   */
  public async isApprovedOperator(accountId: string, operatorId: string | OrderGatewayBase): Promise<boolean> {
    if (typeof operatorId !== 'string') {
      operatorId = await (operatorId as any).getProxyAccountId(this.getProxyId());
    }
    return isApprovedForAll(this, accountId, operatorId as string);
  }

  /**
   * Helper function that gets the right proxy id depending on the asset.
   */
  protected getProxyId() {
    return this.provider.unsafeRecipientIds.indexOf(this.id) === -1
      ? 3 // OrderGatewayProxy.NFTOKEN_SAFE_TRANSFER
      : 2 // OrderGatewayProxy.NFTOKEN_TRANSFER;
  }

}
