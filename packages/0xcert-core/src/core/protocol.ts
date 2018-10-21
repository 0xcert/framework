import { ConnectorBase, FolderCheckAbilityRecipe, FolderCheckTransferStateRecipe,
  FolderReadCapabilitiesRecipe, FolderReadMetadataRecipe, FolderReadSupplyRecipe,
  FolderReadSupplyQuery, FolderReadMetadataQuery, FolderReadCapabilitiesQuery,
  FolderCheckTransferStateQuery, FolderCheckAbilityQuery, FolderSetTransferStateRecipe,
  FolderSetTransferStateMutation, FolderCheckApprovalQuery, FolderCheckApprovalRecipe,
  FolderSetUriBaseRecipe, FolderSetUriBaseMutation} from '@0xcert/connector';

/**
 * Protocol client configuration object.
 */
export interface ProtocolConfig {
  connector?: ConnectorBase;
}

/**
 * Protocol client.
 */
export class Protocol implements ConnectorBase {
  readonly connector: ConnectorBase;

  /**
   * Class constructor.
   * @param config 
   */
  public constructor(config: ProtocolConfig) {
    this.connector = config.connector;
  }

  /**
   * Performs protocol read operation.
   * @param recipe Query configuration object.
   */
  public createQuery(recipe: FolderCheckAbilityRecipe): FolderCheckAbilityQuery;
  public createQuery(recipe: FolderCheckApprovalRecipe): FolderCheckApprovalQuery;
  public createQuery(recipe: FolderCheckTransferStateRecipe): FolderCheckTransferStateQuery;
  public createQuery(recipe: FolderReadCapabilitiesRecipe): FolderReadCapabilitiesQuery;
  public createQuery(recipe: FolderReadMetadataRecipe): FolderReadMetadataQuery;
  public createQuery(recipe: FolderReadSupplyRecipe): FolderReadSupplyQuery;
  createQuery(recipe) {
    return this.connector.createQuery(recipe) as any;
  }

  /**
   * Performs protocol mutate operation.
   * @param recipe Mutation configuration object.
   */
  public createMutation(recipe: FolderSetTransferStateRecipe): FolderSetTransferStateMutation;
  public createMutation(recipe: FolderSetUriBaseRecipe): FolderSetUriBaseMutation;
  createMutation(recipe) {
    return this.connector.createMutation(recipe) as any;
  }

}
