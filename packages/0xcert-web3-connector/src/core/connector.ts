import * as Web3 from 'web3';
import { ConnectorBase, QueryKind, MutationKind, FolderCheckAbilityRecipe,
  FolderReadSupplyRecipe, FolderReadMetadataRecipe, FolderReadCapabilitiesRecipe,
  FolderCheckTransferStateRecipe, FolderReadCapabilitiesQuery, FolderCheckAbilityQuery,
  FolderCheckTransferStateQuery, FolderReadMetadataQuery, FolderReadSupplyQuery,
  FolderSetTransferStateRecipe, FolderSetTransferStateMutation, FolderCheckApprovalRecipe,
  FolderCheckApprovalQuery } from '@0xcert/connector';
import { FolderCheckAbilityIntent } from '../intents/folder-check-ability';
import { FolderCheckApprovalIntent } from '../intents/folder-check-approval';
import { FolderReadMetadataIntent } from '../intents/folder-read-metadata';
import { FolderReadSupplyIntent } from '../intents/folder-read-supply';
import { FolderCheckTransferStateIntent } from '../intents/folder-check-transfer-state';
import { FolderSetTransferStateIntent } from '../intents/folder-set-transfer-state';
import { FolderReadCapabilitiesIntent } from '../intents/folder-read-capabilities';

/**
 * Web3 connector configuration.
 */
export interface ConnectorConfig {
  web3?: Web3;
  approvalConfirmationsCount?: number;
}

/**
 * Web3 connector.
 */
export class Connector implements ConnectorBase {
  readonly web3: Web3;
  public approvalConfirmationsCount?: number;

  /**
   * Class constructor.
   * @param web3 Web3 object instance or web3 provider object.
   */
  public constructor(config?: ConnectorConfig) {
    this.web3 = this.buildWeb3(config.web3);
    this.approvalConfirmationsCount = config.approvalConfirmationsCount || 15;
  }

  /**
   * Returns a new Query object.
   * @param recipe Query recipe definition.
   */
  createQuery(recipe: FolderCheckAbilityRecipe): FolderCheckAbilityQuery;
  createQuery(recipe: FolderCheckApprovalRecipe): FolderCheckApprovalQuery;
  createQuery(recipe: FolderCheckTransferStateRecipe): FolderCheckTransferStateQuery;
  createQuery(recipe: FolderReadCapabilitiesRecipe): FolderReadCapabilitiesQuery;
  createQuery(recipe: FolderReadMetadataRecipe): FolderReadMetadataQuery;
  createQuery(recipe: FolderReadSupplyRecipe): FolderReadSupplyQuery;
  createQuery(recipe) {
    switch (recipe.queryKind) {
      case QueryKind.FOLDER_CHECK_ABILITY:
        return new FolderCheckAbilityIntent(this, recipe) as FolderCheckAbilityQuery;
      case QueryKind.FOLDER_CHECK_APPROVAL:
        return new FolderCheckApprovalIntent(this, recipe) as FolderCheckApprovalQuery;
      case QueryKind.FOLDER_CHECK_TRANSFER_STATE:
        return new FolderCheckTransferStateIntent(this, recipe) as FolderCheckTransferStateQuery;
      case QueryKind.FOLDER_READ_CAPABILITIES:
        return new FolderReadCapabilitiesIntent(this, recipe) as FolderReadCapabilitiesQuery;
      case QueryKind.FOLDER_READ_METADATA:
        return new FolderReadMetadataIntent(this, recipe) as FolderReadMetadataQuery;
      case QueryKind.FOLDER_READ_SUPPLY:
        return new FolderReadSupplyIntent(this, recipe) as FolderReadSupplyQuery;
      default:
        return null;
    }
  }

  /**
   * Returns a new Query object.
   * @param recipe Query recipe definition.
   */
  public createMutation(recipe: FolderSetTransferStateRecipe): FolderSetTransferStateMutation;
  createMutation(recipe: FolderSetTransferStateRecipe) {
    switch (recipe.mutationKind) {
      case MutationKind.FOLDER_SET_TRANSFER_STATE:
        return new FolderSetTransferStateIntent(this, recipe);
      default:
        return null;
    }
  }

  /**
   * Returns a new Web3 instance.
   * @param web3 Web3 object instance or web3 provider object.
   */
  protected buildWeb3(web3?: any) {
    if (web3 && web3.currentProvider) {
      return new Web3(web3.currentProvider);
    } else {
      return new Web3(web3 || 'ws://localhost:8545');
    }
  }

}
