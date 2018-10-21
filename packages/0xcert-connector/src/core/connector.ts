import { FolderCheckAbilityRecipe, FolderCheckTransferStateRecipe, FolderReadCapabilitiesRecipe,
  FolderReadMetadataRecipe, FolderReadSupplyRecipe, FolderCheckAbilityQuery,
  FolderCheckTransferStateQuery, FolderReadCapabilitiesQuery, FolderReadMetadataQuery,
  FolderReadSupplyQuery } from './query';
import { FolderSetTransferStateRecipe, FolderSetTransferStateMutation, FolderSetUriBaseRecipe,
  FolderSetUriBaseMutation } from './mutation';

/**
 * 
 */
export interface ConnectorBase {
  createQuery(recipe: FolderCheckAbilityRecipe): FolderCheckAbilityQuery;
  createQuery(recipe: FolderCheckTransferStateRecipe): FolderCheckTransferStateQuery;
  createQuery(recipe: FolderReadCapabilitiesRecipe): FolderReadCapabilitiesQuery;
  createQuery(recipe: FolderReadMetadataRecipe): FolderReadMetadataQuery;
  createQuery(recipe: FolderReadSupplyRecipe): FolderReadSupplyQuery;
  createMutation(recipe: FolderSetTransferStateRecipe): FolderSetTransferStateMutation;
  createMutation(recipe: FolderSetUriBaseRecipe): FolderSetUriBaseMutation;
}
