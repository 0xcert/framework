import { GenericProvider, Mutation, MutationEventSignature, MutationEventTypeKind } from '@0xcert/ethereum-generic-provider';
import { AssetLedgerAbility, AssetLedgerBase, AssetLedgerCapability, AssetLedgerDeployRecipe,
  AssetLedgerInfo, AssetLedgerItem, AssetLedgerItemRecipe,
  AssetLedgerObjectUpdateRecipe, AssetLedgerTransferRecipe,
  AssetLedgerUpdateRecipe } from '@0xcert/scaffold';
import { getBitfieldFromAbilities } from '..';
import approveAccount from '../mutations/approve-account';
import createAsset from '../mutations/create-asset';
import deploy from '../mutations/deploy';
import destroyAsset from '../mutations/destroy-asset';
import grantAbilities from '../mutations/grant-abilities';
import revokeAbilities from '../mutations/revoke-abilities';
import revokeAsset from '../mutations/revoke-asset';
import safeTransfer from '../mutations/safe-transfer';
import setAbilities from '../mutations/set-abilities';
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
   * AssetLedger Id. Address pointing at the smart contract.
   */
  protected _id: string;

  /**
   * Provider instance.
   */
  protected _provider: GenericProvider;

  /**
   * Deploys a new smart contract representing asset ledger to the blockchain.
   * @param provider Provider class with which we communicate with blockchain.
   * @param recipe Data needed to deploy a new asset ledger.
   */
  public static async deploy(provider: GenericProvider, recipe: AssetLedgerDeployRecipe): Promise<Mutation> {
    return deploy(provider, recipe);
  }

  /**
   * Gets an instance of already deployed asset ledger.
   * @param provider Provider class with which we communicate with blockchain.
   * @param id Address of the erc721/Xcert smart contract.
   */
  public static getInstance(provider: GenericProvider, id: string): AssetLedger {
    return new this(provider, id);
  }

  /**
   * Initialize asset ledger.
   * @param provider Provider class with which we communicate with blockchain.
   * @param id Address of the erc721/Xcert smart contract.
   */
  public constructor(provider: GenericProvider, id: string) {
    this._provider = provider;
    this._id = this._provider.encoder.normalizeAddress(id);
  }

  /**
   * Gets the address of the smart contract that represents this asset ledger.
   */
  public get id(): string {
    return this._id;
  }

  /**
   * Gets the provider that is used to communicate with blockchain.
   */
  public get provider(): GenericProvider {
    return this._provider;
  }

  /**
   * Gets a list of abilities an account has for this asset ledger.
   * @param accountId Account address for which we want to get abilities.
   */
  public async getAbilities(accountId: string): Promise<AssetLedgerAbility[]> {
    accountId = this._provider.encoder.normalizeAddress(accountId);
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
    accountId = this._provider.encoder.normalizeAddress(accountId);
    return getBalance(this, accountId);
  }

  /**
   * Gets a list of all asset ledger capabilities(options).
   */
  public async getCapabilities(): Promise<AssetLedgerCapability[]> {
    return getCapabilities(this);
  }

  /**
   * Gets information about the asset ledger (name, symbol, uriPrefix, supply).
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
    accountId = this._provider.encoder.normalizeAddress(accountId);
    return getAccountAssetIdAt(this, accountId, index);
  }

  /**
   * Checks if a specific account is approved for a specific asset.
   * @param assetId Id of the asset.
   * @param accountId Id of the account.
   */
  public async isApprovedAccount(assetId: string, accountId: string): Promise<boolean> {
    accountId = this._provider.encoder.normalizeAddress(accountId as string);
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
  public async approveAccount(assetId: string, accountId: string): Promise<Mutation> {
    accountId = this._provider.encoder.normalizeAddress(accountId as string);
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
  public async grantAbilities(accountId: string, abilities: AssetLedgerAbility[]): Promise<Mutation> {
    accountId = this._provider.encoder.normalizeAddress(accountId as string);
    return grantAbilities(this, accountId, getBitfieldFromAbilities(abilities));
  }

  /**
   * Sets abilities of an account.
   * @param accountId Id of the account.
   * @param abilities List of the abilities.
   */
  public async setAbilities(accountId: string, abilities: AssetLedgerAbility[]): Promise<Mutation> {
    accountId = this._provider.encoder.normalizeAddress(accountId as string);
    return setAbilities(this, accountId, getBitfieldFromAbilities(abilities));
  }

  /**
   * Creates a new asset.
   * @param recipe Data from which the new asset is created.
   */
  public async createAsset(recipe: AssetLedgerItemRecipe): Promise<Mutation> {
    const receiverId = this._provider.encoder.normalizeAddress(recipe.receiverId);

    return createAsset(this, receiverId, recipe.id, `0x${recipe.imprint}`);
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
    accountId = this._provider.encoder.normalizeAddress(accountId as string);
    return revokeAbilities(this, accountId, getBitfieldFromAbilities(abilities));
  }

  /**
   * Destroys an existing asset (only someone with asset ledger revoke ability can do this).
   * @param assetId Id of the asset.
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

    const senderId = this._provider.encoder.normalizeAddress(recipe.senderId);
    const receiverId = this._provider.encoder.normalizeAddress(recipe.receiverId);

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
    return updateAsset(this, assetId, `0x${recipe.imprint}`);
  }

  /**
   * Updates asset ledger data.
   * @param recipe Data to update asset ledger with.
   */
  public async update(recipe: AssetLedgerUpdateRecipe): Promise<Mutation> {
    return update(this, recipe.uriPrefix, recipe.uriPostfix);
  }

  /**
   * Approves an account as an operator (meaning he has full controll of all of your assets).
   * @param accountId Account id.
   */
  public async approveOperator(accountId: string): Promise<Mutation> {
    accountId = this._provider.encoder.normalizeAddress(accountId as string);
    return setApprovalForAll(this, accountId, true);
  }

  /**
   * Disapproves an account as an operator.
   * @param accountId Account id.
   */
  public async disapproveOperator(accountId: string): Promise<Mutation> {
    accountId = this._provider.encoder.normalizeAddress(accountId as string);
    return setApprovalForAll(this, accountId, false);
  }

  /**
   * Checks if specific account is the operator for specific account.
   * @param accountId Account id.
   * @param operatorId Operator account id.
   */
  public async isApprovedOperator(accountId: string, operatorId: string): Promise<boolean> {
    accountId = this._provider.encoder.normalizeAddress(accountId);
    operatorId = this._provider.encoder.normalizeAddress(operatorId as string);
    return isApprovedForAll(this, accountId, operatorId);
  }

  /**
   * Gets context for mutation event parsing.
   * These are event definitions for Asset Ledger smart contract event parsing. This method is used
   * by the Mutation class to provide log information.
   */
  public getContext(): MutationEventSignature[] {
    return [
      {
        name: 'Transfer',
        topic: '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
        types: [
          {
            kind: MutationEventTypeKind.INDEXED,
            name: 'from',
            type: 'address',
          },
          {
            kind: MutationEventTypeKind.INDEXED,
            name: 'to',
            type: 'address',
          },
          {
            kind: MutationEventTypeKind.INDEXED,
            name: 'tokenId',
            type: 'uint256',
          },
        ],
      },
      {
        name: 'Approval',
        topic: '0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925',
        types: [
          {
            kind: MutationEventTypeKind.INDEXED,
            name: 'owner',
            type: 'address',
          },
          {
            kind: MutationEventTypeKind.INDEXED,
            name: 'approved',
            type: 'address',
          },
          {
            kind: MutationEventTypeKind.INDEXED,
            name: 'tokenId',
            type: 'uint256',
          },
        ],
      },
      {
        name: 'ApprovalForAll',
        topic: '0x17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31',
        types: [
          {
            kind: MutationEventTypeKind.INDEXED,
            name: 'owner',
            type: 'address',
          },
          {
            kind: MutationEventTypeKind.INDEXED,
            name: 'operator',
            type: 'address',
          },
          {
            kind: MutationEventTypeKind.NORMAL,
            name: 'approved',
            type: 'bool',
          },
        ],
      },
      {
        name: 'IsPaused',
        topic: '0xff4a5dbbab6b1963d10f5edd139f33a7987ecb3c4f65969be77ddba28d946594',
        types: [
          {
            kind: MutationEventTypeKind.NORMAL,
            name: 'isPaused',
            type: 'bool',
          },
        ],
      },
      {
        name: 'TokenImprintUpdate',
        topic: '0xda81dc3bdaf65b621535dbd08fc4032c7e22d5ccab12c8aa2ad010611471d627',
        types: [
          {
            kind: MutationEventTypeKind.INDEXED,
            name: 'tokenId',
            type: 'uint256',
          },
          {
            kind: MutationEventTypeKind.NORMAL,
            name: 'imprint',
            type: 'bytes32',
          },
        ],
      },
      {
        name: 'SetAbilities',
        topic: '0xd1d59d2d212a435434e7a4a4676427610dfe2b6268b01e541d280d65bf3d6b90',
        types: [
          {
            kind: MutationEventTypeKind.INDEXED,
            name: 'target',
            type: 'address',
          },
          {
            kind: MutationEventTypeKind.INDEXED,
            name: 'abilities',
            type: 'uint256',
          },
        ],
      },
    ];
  }
}
