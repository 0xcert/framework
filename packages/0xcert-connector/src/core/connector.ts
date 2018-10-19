import { QueryRecipe, QueryBase } from './query';
import { MutationRecipe, MutationBase } from './mutation';

/**
 * 
 */
export interface ConnectorBase {
  createQuery(recipe: QueryRecipe): QueryBase;
  createMutation(recipe: MutationRecipe): MutationBase;
}
