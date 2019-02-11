import { sha } from '@0xcert/utils';
import { Spec } from '@hayspec/spec';
import { Merkle } from '../../..';

const spec = new Spec<{
  merkle: Merkle;
}>();

spec.before(async (ctx) => {
  ctx.set('merkle', new Merkle({ hasher: (v) => sha(256, v) }));
});

spec.test('recreate from empty array', async (ctx) => {
  const values = [];
  const expose = [];
  const fullRecipe = await ctx.get('merkle').notarize(values);
  const minRecipe = await ctx.get('merkle').disclose(fullRecipe, expose);
  const imprint = await ctx.get('merkle').imprint(minRecipe);
  ctx.is(imprint, fullRecipe.nodes[0].hash);
});

spec.test('recreate from A, B, C, D with exposed indexes 1, 2', async (ctx) => {
  const values = ['A', 'B', 'C', 'D'];
  const expose = [0, 2];
  const fullRecipe = await ctx.get('merkle').notarize(values);
  const minRecipe = await ctx.get('merkle').disclose(fullRecipe, expose);
  const imprint = await ctx.get('merkle').imprint(minRecipe);
  ctx.is(imprint, fullRecipe.nodes[0].hash);
});

spec.test('recreate from from A, B, C, D, E, F, G, H with exposed indexes 7', async (ctx) => {
  const values = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  const expose = [7];
  const fullRecipe = await ctx.get('merkle').notarize(values);
  const minRecipe = await ctx.get('merkle').disclose(fullRecipe, expose);
  const imprint = await ctx.get('merkle').imprint(minRecipe);
  ctx.is(imprint, fullRecipe.nodes[0].hash);
});

spec.test('recreate from from A, B, C, D, E, F, G, H with exposed indexes 3, 5, 6', async (ctx) => {
  const values = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  const expose = [3, 5, 6];
  const fullRecipe = await ctx.get('merkle').notarize(values);
  const minRecipe = await ctx.get('merkle').disclose(fullRecipe, expose);
  const imprint = await ctx.get('merkle').imprint(minRecipe);
  ctx.is(imprint, fullRecipe.nodes[0].hash);
});

export default spec;
