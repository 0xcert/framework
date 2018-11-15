import { Spec } from '@hayspec/spec';
import { sha256 } from '@0xcert/crypto';
import { Merkle } from '../../..';

interface Data {
  merkle: Merkle;
}

const spec = new Spec<Data>();

spec.before(async (ctx) => {
  ctx.set('merkle', new Merkle({ hasher: sha256 }));
});

spec.only('recreate from from A, B, C, D, E, F, G, H with exposed indexes 4, 8, 11', async (ctx) => {
  const values = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  const expose = [4, 8, 11];
  const recipe = await ctx.get('merkle').buildRecipe(values);
  const evidence = await ctx.get('merkle').buildEvidence(recipe, expose);
  const imprint = await ctx.get('merkle').buildImprint(evidence);
  ctx.is(imprint, recipe.nodes[0].hash);
});

spec.only('recreate from from A, B, C, D, E, F, G, H with exposed indexes 3, 5, 6', async (ctx) => {
  const values = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  const expose = [3, 5, 6];
  const recipe = await ctx.get('merkle').buildRecipe(values);
  const evidence = await ctx.get('merkle').buildEvidence(recipe, expose);
  const imprint = await ctx.get('merkle').buildImprint(evidence);
  ctx.is(imprint, recipe.nodes[0].hash);
});

spec.only('recreate from from A, B, C, D, E, F, G, H with exposed indexes 11', async (ctx) => {
  const values = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  const expose = [11];
  const recipe = await ctx.get('merkle').buildRecipe(values);
  const evidence = await ctx.get('merkle').buildEvidence(recipe, expose);
  const imprint = await ctx.get('merkle').buildImprint(evidence);
  ctx.is(imprint, recipe.nodes[0].hash);
});

export default spec;
