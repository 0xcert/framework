import { Spec } from '@hayspec/spec';
import { sha } from '@0xcert/utils';
import { Merkle } from '../../..';

interface Data {
  merkle: Merkle;
}

const spec = new Spec<Data>();

spec.before(async (ctx) => {
  ctx.set('merkle', new Merkle({ hasher: (v) => sha(256, v) }));
});

spec.test('recreate from from empty array', async (ctx) => {
  const values = [];
  const expose = [];
  const recipe = await ctx.get('merkle').notarize(values);
  const evidence = await ctx.get('merkle').disclose(recipe, expose);
  const imprint = await ctx.get('merkle').imprint(evidence);
  ctx.is(imprint, recipe.nodes[0].hash);
});

spec.test('recreate from from A, B, C, D with exposed indexes 1, 2', async (ctx) => {
  const values = ['A', 'B', 'C', 'D'];
  const expose = [0, 2];
  const recipe = await ctx.get('merkle').notarize(values);
  const evidence = await ctx.get('merkle').disclose(recipe, expose);
  const imprint = await ctx.get('merkle').imprint(evidence);
  ctx.is(imprint, recipe.nodes[0].hash);
});

spec.test('recreate from from A, B, C, D, E, F, G, H with exposed indexes 7', async (ctx) => {
  const values = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  const expose = [7];
  const recipe = await ctx.get('merkle').notarize(values);
  const evidence = await ctx.get('merkle').disclose(recipe, expose);
  const imprint = await ctx.get('merkle').imprint(evidence);
  ctx.is(imprint, recipe.nodes[0].hash);
});

spec.test('recreate from from A, B, C, D, E, F, G, H with exposed indexes 3, 5, 6', async (ctx) => {
  const values = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  const expose = [3, 5, 6];
  const recipe = await ctx.get('merkle').notarize(values);
  const evidence = await ctx.get('merkle').disclose(recipe, expose);
  const imprint = await ctx.get('merkle').imprint(evidence);
  ctx.is(imprint, recipe.nodes[0].hash);
});

export default spec;
