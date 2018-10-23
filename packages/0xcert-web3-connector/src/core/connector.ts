import * as Web3 from 'web3';
import { ConnectorBase, QueryKind, MutationKind, FolderCheckAbilityRecipe,
  FolderReadSupplyRecipe, FolderReadMetadataRecipe, FolderReadCapabilitiesRecipe,
  FolderCheckTransferStateRecipe, FolderReadCapabilitiesQuery, FolderCheckAbilityQuery,
  FolderCheckTransferStateQuery, FolderReadMetadataQuery, FolderReadSupplyQuery,
  FolderSetTransferStateRecipe, FolderSetTransferStateMutation, FolderCheckApprovalRecipe,
  FolderCheckApprovalQuery, FolderSetUriBaseRecipe, FolderSetUriBaseMutation,
  ExchangeSwapRecipe, ExchangeSwapClaim } from '@0xcert/connector';
import { FolderCheckAbilityIntent } from '../queries/folder-check-ability';
import { FolderCheckApprovalIntent } from '../queries/folder-check-approval';
import { FolderReadMetadataIntent } from '../queries/folder-read-metadata';
import { FolderReadSupplyIntent } from '../queries/folder-read-supply';
import { FolderCheckTransferStateIntent } from '../queries/folder-check-transfer-state';
import { FolderReadCapabilitiesIntent } from '../queries/folder-read-capabilities';
import { FolderSetTransferStateIntent } from '../mutations/folder-set-transfer-state';
import { FolderSetUriBaseIntent } from '../mutations/folder-set-uri-base';
import { MinterCreateAssetRecipe, MinterCreateAssetClaim, ClaimKind } from '@0xcert/connector/dist/core/claim';
import { MinterCreateAssetGenerator } from '../claims/minter-create-asset';
import { ExchangeSwapGenerator } from '../claims/exchange-swap';

/**
 * Signature kinds
 */
export enum SignatureKind {
  ETH_SIGN = 1,
  TREZOR = 2,
  EIP712 = 3,
}

/**
 * Web3 connector configuration.
 */
export interface ConnectorConfig {
  web3?: Web3;
  approvalConfirmationsCount?: number;
  signatureKind?: SignatureKind;
  minterAddress?: string;
  tokenTransferProxyAddress?: string;
  nftTransferProxyAddress?: string;
}

/**
 * Web3 connector.
 */
export class Connector implements ConnectorBase {
  readonly web3: Web3;
  readonly config: ConnectorConfig;

  /**
   * Class constructor.
   * @param web3 Web3 object instance or web3 provider object.
   */
  public constructor(config?: ConnectorConfig) {
    this.config = { 
      approvalConfirmationsCount: 15,
      signatureKind: SignatureKind.ETH_SIGN,
      ...config,
    };
    this.web3 = this.buildWeb3(config.web3);
  }

  /**
   * Returns a new Query object.
   * @param recipe Query recipe definition.
   */
  public createQuery(recipe: FolderCheckAbilityRecipe): FolderCheckAbilityQuery;
  public createQuery(recipe: FolderCheckApprovalRecipe): FolderCheckApprovalQuery;
  public createQuery(recipe: FolderCheckTransferStateRecipe): FolderCheckTransferStateQuery;
  public createQuery(recipe: FolderReadCapabilitiesRecipe): FolderReadCapabilitiesQuery;
  public createQuery(recipe: FolderReadMetadataRecipe): FolderReadMetadataQuery;
  public createQuery(recipe: FolderReadSupplyRecipe): FolderReadSupplyQuery;
  public createQuery(recipe) {
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
  public createMutation(recipe: FolderSetUriBaseRecipe): FolderSetUriBaseMutation;
  public createMutation(recipe) {
    switch (recipe.mutationKind) {
      case MutationKind.FOLDER_SET_TRANSFER_STATE:
        return new FolderSetTransferStateIntent(this, recipe) as FolderSetTransferStateMutation;
      case MutationKind.FOLDER_SET_URI_BASE:
        return new FolderSetUriBaseIntent(this, recipe) as FolderSetUriBaseMutation;
      default:
        return null;
    }
  }

  /**
   * Generates a new claim.
   * @param recipe Claim recipe definition.
   */
  public createClaim(recipe: MinterCreateAssetRecipe): MinterCreateAssetClaim;
  public createClaim(recipe: ExchangeSwapRecipe): ExchangeSwapClaim;
  public createClaim(recipe) {
    switch (recipe.claimKind) {
      case ClaimKind.MINTER_CREATE_ASSET:
        return new MinterCreateAssetGenerator(this, recipe).generate();
      case ClaimKind.EXCHANGE_SWAP:
        return new ExchangeSwapGenerator(this, recipe).generate();
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
