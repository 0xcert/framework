import { FolderCheckAbilityRecipe, FolderCheckTransferStateRecipe, FolderReadCapabilitiesRecipe,
  FolderReadMetadataRecipe, FolderReadSupplyRecipe, FolderCheckAbilityQuery,
  FolderCheckTransferStateQuery, FolderReadCapabilitiesQuery, FolderReadMetadataQuery,
  FolderReadSupplyQuery, FolderCheckApprovalRecipe, FolderCheckApprovalQuery} from './query';
import { FolderSetTransferStateRecipe, FolderSetTransferStateMutation, FolderSetUriBaseRecipe,
  FolderSetUriBaseMutation } from './mutation';
import { MinterCreateAssetRecipe, MinterCreateAssetClaim, ExchangeSwapRecipe,
  ExchangeSwapClaim } from './claim';

/**
 * 
 */
export interface ConnectorBase {
  createQuery(recipe: FolderCheckAbilityRecipe): FolderCheckAbilityQuery;
  createQuery(recipe: FolderCheckApprovalRecipe): FolderCheckApprovalQuery;
  createQuery(recipe: FolderCheckTransferStateRecipe): FolderCheckTransferStateQuery;
  createQuery(recipe: FolderReadCapabilitiesRecipe): FolderReadCapabilitiesQuery;
  createQuery(recipe: FolderReadMetadataRecipe): FolderReadMetadataQuery;
  createQuery(recipe: FolderReadSupplyRecipe): FolderReadSupplyQuery;
  createMutation(recipe: FolderSetTransferStateRecipe): FolderSetTransferStateMutation;
  createMutation(recipe: FolderSetUriBaseRecipe): FolderSetUriBaseMutation;
  createClaim(recipe: MinterCreateAssetRecipe): MinterCreateAssetClaim;
  createClaim(recipe: ExchangeSwapRecipe): ExchangeSwapClaim;
}
