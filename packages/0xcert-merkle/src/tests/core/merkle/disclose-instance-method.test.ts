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
      { index: 0, hash: 'b16c961cbfca86d7b78cd687729bae18f1015c742e7319d91088502a892ba166' },
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
      { index: 0, value: 'A', nonce: '' },
      { index: 2, value: 'C', nonce: '' },
    ],
    nodes: [
      { index: 3, hash: 'acab60e972cca11cd0571b8d08fe9bfc6521565c601a3785c5f5fb0a406279e6' },
      { index: 6, hash: '1bfcb70acfee69c7ef93ea300e3127715dcced515022daf9f149d395610b2cc4' },
    ],
  });
});

export default spec;
