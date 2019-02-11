import { sha } from '@0xcert/utils';
import { Spec } from '@hayspec/spec';
import { Merkle } from '../../..';

const spec = new Spec<{
  merkle: Merkle;
}>();

spec.before(async (ctx) => {
  ctx.set('merkle', new Merkle({ hasher: (v) => sha(256, v) }));
});

spec.test('exposes 0 from empty array', async (ctx) => {
  const values = [];
  const expose = [];
  const fullRecipe = await ctx.get('merkle').notarize(values);
  const minRecipe = await ctx.get('merkle').disclose(fullRecipe, expose);
  ctx.deepEqual(minRecipe, {
    values: [],
    nodes: [
      { index: 0, hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855' },
    ],
  });
});

spec.test('exposes 0 from A, B, C, D', async (ctx) => {
  const values = ['A', 'B', 'C', 'D'];
  const expose = [];
  const fullRecipe = await ctx.get('merkle').notarize(values);
  const minRecipe = await ctx.get('merkle').disclose(fullRecipe, expose);
  ctx.deepEqual(minRecipe, {
    values: [],
    nodes: [
      { index: 0, hash: '0bcec31a258c3f9aa814efe53d638648df413a1fe35470b5be5341a2a9fd30a9' },
    ],
  });
});

spec.test('exposes 5 from A, B, C, D', async (ctx) => {
  const values = ['A', 'B', 'C', 'D'];
  const expose = [0, 2];
  const fullRecipe = await ctx.get('merkle').notarize(values);
  const minRecipe = await ctx.get('merkle').disclose(fullRecipe, expose);
  ctx.deepEqual(minRecipe, {
    values: [
      { index: 0, value: 'A' },
      { index: 2, value: 'C' },
    ],
    nodes: [
      { index: 3, hash: 'df7e70e5021544f4834bbee64a9e3789febc4be81470df629cad6ddb03320a5c' },
      { index: 6, hash: 'dbf687a59392a9b4a1c1fe1527b776a85b971c583ea22a88e41cebf91215930c' },
    ],
  });
});

export default spec;
