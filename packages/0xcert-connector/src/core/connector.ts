import { QueryRecipe, QueryBase } from './query';
import { MutationRecipe, MutationIntent } from './mutation';

/**
 * 
 */
export interface ConnectorBase {
  createQuery(recipe: QueryRecipe): QueryBase;
  createMutation(recipe: MutationRecipe): MutationIntent;
}
