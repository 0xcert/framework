import { GenericProvider, Mutation } from '@0xcert/ethereum-generic-provider';
import { bigNumberify, normalizeAddress } from '@0xcert/ethereum-utils';
import { AssetLedgerAbility, AssetLedgerBase, AssetLedgerCapability, AssetLedgerDeployRecipe,
  AssetLedgerInfo, AssetLedgerItem, AssetLedgerItemRecipe,
  AssetLedgerObjectUpdateRecipe, AssetLedgerTransferRecipe,
  AssetLedgerUpdateRecipe, OrderGatewayBase, SuperAssetLedgerAbility } from '@0xcert/scaffold';
import approveAccount from '../mutations/approve-account';
import createAsset from '../mutations/create-asset';
import deploy from '../mutations/deploy';
import destroyAsset from '../mutations/destroy-asset';
import grantAbilities from '../mutations/grant-abilities';
import revokeAbilities from '../mutations/revoke-abilities';
import revokeAsset from '../mutations/revoke-asset';
import safeTransfer from '../mutations/safe-transfer';
import setApprovalForAll from '../mutations/set-approval-for-all';
import setEnabled from '../mutations/set-enabled';
import transfer from '../mutations/transfer';
import update from '../mutations/update';
import updateAsset from '../mutations/update-asset';
import getAbilities from '../queries/get-abilities';
import getAccountAssetIdAt from '../queries/get-account-asset-id-at';
import getApprovedAccount from '../queries/get-approved-account';
import getAsset from '../queries/get-asset';
import getAssetAccount from '../queries/get-asset-account';
import getAssetIdAt from '../queries/get-asset-id-at';
import getBalance from '../queries/get-balance';
import getCapabilities from '../queries/get-capabilities';
import getInfo from '../queries/get-info';
import isApprovedForAll from '../queries/is-approved-for-all';
import isEnabled from '../queries/is-enabled';

/**
 * Ethereum asset ledger implementation.
 */
export class AssetLedger implements AssetLedgerBase {

  /**
   * AssetLedger Id. Address pointing at the smartcontract.
   */
  protected _id: string;

  /**
   * Provider instance.
   */
  protected _provider: GenericProvider;

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
   * Initialize asset ledger.
   * @param provider Provider class with which we comunicate with blockchain.
   * @param id Address of the erc721/xcert smart contract.
   */
  public constructor(provider: GenericProvider, id: string) {
    this._id = normalizeAddress(id);
    this._provider = provider;
  }

  /**
   * Gets the address of the smart contract that represents this asset ledger.
   */
  public get id(): string {
    return this._id;
  }

  /**
   * Gets the provider that is used to comunicate with blockchain.
   */
  public get provider(): GenericProvider {
    return this._provider;
  }

  /**
   * Gets a list of abilities an account has for this asset ledger.
   * @param accountId Account address for wich we want to get abilities.
   */
  public async getAbilities(accountId: string): Promise<AssetLedgerAbility[]> {
    accountId = normalizeAddress(accountId);

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
   * Gets the asset owner account ID.
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
    accountId = normalizeAddress(accountId);

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
   * Gets the ID of the asset at index.
   * @param index Asset index.
   */
  public async getAssetIdAt(index: number): Promise<number> {
    return getAssetIdAt(this, index);
  }

  /**
   * Gets the ID of the asset at index for account.
   * @param accountId Account address.
   * @param index Asset index.
   */
  public async getAccountAssetIdAt(accountId: string, index: number): Promise<number> {
    accountId = normalizeAddress(accountId);

    return getAccountAssetIdAt(this, accountId, index);
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

    accountId = normalizeAddress(accountId as string);

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

    accountId = normalizeAddress(accountId as string);

    return approveAccount(this, accountId, assetId);
  }

  /**
   * Disapproves approved account for a specific asset.
   * @param assetId Asset id.
   */
  public async disapproveAccount(assetId: string): Promise<Mutation> {
    return approveAccount(this, '0x0000000000000000000000000000000000000000', assetId);
  }

  /**
   * Grants abilities of an account.
   * @param accountId Id of the account.
   * @param abilities List of the abilities.
   */
  public async grantAbilities(accountId: string | OrderGatewayBase, abilities: AssetLedgerAbility[]): Promise<Mutation> {
    if (typeof accountId !== 'string') {
      accountId = await (accountId as any).getProxyAccountId(0); // OrderGatewayProxy.XCERT_CREATE
    }

    accountId = normalizeAddress(accountId as string);

    let bitAbilities = bigNumberify(0);
    abilities.forEach((ability) => {
      bitAbilities = bitAbilities.add(ability);
    });

    return grantAbilities(this, accountId, bitAbilities);
  }

  /**
   * Creates a new asset.
   * @param recipe Data from which the new asset is created.
   */
  public async createAsset(recipe: AssetLedgerItemRecipe): Promise<Mutation> {
    const imprint = recipe.imprint || 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855';
    const receiverId = normalizeAddress(recipe.receiverId);

    return createAsset(this, receiverId, recipe.id, `0x${imprint}`);
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
  public async revokeAbilities(accountId: string | OrderGatewayBase, abilities: AssetLedgerAbility[]): Promise<Mutation> {
    if (typeof accountId !== 'string') {
      accountId = await (accountId as any).getProxyAccountId(0); // OrderGatewayProxy.XCERT_CREATE
    }

    let allowSuperRevoke = false;
    if (abilities.indexOf(SuperAssetLedgerAbility.MANAGE_ABILITIES) > 0) {
      allowSuperRevoke = true;
    }

    accountId = normalizeAddress(accountId as string);

    let bitAbilities = bigNumberify(0);
    abilities.forEach((ability) => {
      bitAbilities = bitAbilities.add(ability);
    });

    return revokeAbilities(this, accountId, bitAbilities, allowSuperRevoke);
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
    if (!recipe.senderId) {
      recipe.senderId = this.provider.accountId;
    }

    const senderId = normalizeAddress(recipe.senderId);
    const receiverId = normalizeAddress(recipe.receiverId);

    return this.provider.unsafeRecipientIds.indexOf(recipe.receiverId) !== -1
      ? transfer(this, senderId, receiverId, recipe.id)
      : safeTransfer(this, senderId, receiverId, recipe.id, recipe.data);
  }

  /**
   * Enables transfers of asset on the asset ledger.
   */
  public async enableTransfers(): Promise<Mutation> {
    return setEnabled(this, true);
  }

  /**
   * Disables transfers of asset on the asset ledger.
   */
  public async disableTransfers(): Promise<Mutation> {
    return setEnabled(this, false);
  }

  /**
   * Updates data on an existing asset.
   * @param assetId Id of the asset.
   * @param recipe Data to update asset with.
   */
  public async updateAsset(assetId: string, recipe: AssetLedgerObjectUpdateRecipe): Promise<Mutation> {
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

    accountId = normalizeAddress(accountId as string);

    return setApprovalForAll(this, accountId, true);
  }

  /**
   * Disapproves an account as an operator.
   * @param accountId Account id.
   */
  public async disapproveOperator(accountId: string | OrderGatewayBase): Promise<Mutation> {
    if (typeof accountId !== 'string') {
      accountId = await (accountId as any).getProxyAccountId(this.getProxyId());
    }

    accountId = normalizeAddress(accountId as string);

    return setApprovalForAll(this, accountId, false);
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

    accountId = normalizeAddress(accountId);
    operatorId = normalizeAddress(operatorId as string);

    return isApprovedForAll(this, accountId, operatorId);
  }

  /**
   * Helper function that gets the right proxy id depending on the asset.
   */
  protected getProxyId(): number {
    return this.provider.unsafeRecipientIds.indexOf(this.id) === -1
      ? 3 // OrderGatewayProxy.NFTOKEN_SAFE_TRANSFER
      : 2; // OrderGatewayProxy.NFTOKEN_TRANSFER;
  }

}
