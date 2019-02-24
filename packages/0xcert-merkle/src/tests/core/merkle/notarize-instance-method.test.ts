import { sha } from '@0xcert/utils';
import { Spec } from '@hayspec/spec';
import { Merkle } from '../../..';

const spec = new Spec<{
  merkle: Merkle;
}>();

spec.before(async (ctx) => {
  ctx.set('merkle', new Merkle({ hasher: (v) => sha(256, v) }));
});

spec.test('empty array', async (ctx) => {
  const values = [];
  const recipe = await ctx.get('merkle').notarize(values);
  ctx.deepEqual(recipe, {
    values: [],
    nodes: [
      { index: 0, hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855' },
    ],
  });
});

spec.test('array with element A', async (ctx) => {
  const values = ['A'];
  const recipe = await ctx.get('merkle').notarize(values);
  ctx.deepEqual(recipe, {
    values: [
      { index: 0, value: 'A', nonce: '' },
    ],
    nodes: [
      { index: 0, hash: 'fa9d30c7925ca4305d62103567a008ffb47745ba05182f5415a3d8220b138d7d' },
      { index: 1, hash: '599d48457e4996df84cbfeb973cd109827c0de9fa211c0d062eab13584ea6bb8' },
      { index: 2, hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855' },
    ],
  });
});

spec.test('recipe for values A,B,C,D', async (ctx) => {
  const values = ['A', 'B', 'C', 'D'];
  const recipe = await ctx.get('merkle').notarize(values);
  ctx.deepEqual(recipe, {
    values: [
      { index: 0, value: 'A', nonce: '' },
      { index: 1, value: 'B', nonce: '' },
      { index: 2, value: 'C', nonce: '' },
      { index: 3, value: 'D', nonce: '' },
    ],
    nodes: [
      { index: 0, hash: 'b16c961cbfca86d7b78cd687729bae18f1015c742e7319d91088502a892ba166' },
      { index: 1, hash: '599d48457e4996df84cbfeb973cd109827c0de9fa211c0d062eab13584ea6bb8' },
      { index: 2, hash: 'fbf22fbe34dbbe4cf87cf04686686232a734cdc2bed00cdcce43ff5dec556e99' },
      { index: 3, hash: 'acab60e972cca11cd0571b8d08fe9bfc6521565c601a3785c5f5fb0a406279e6' },
      { index: 4, hash: '227a317d283d63a271e3860f70c8801a457276def0724852dd75365abd9cc180' },
      { index: 5, hash: 'a208c3b59eecf373c4ef50b06a4236cba1002b2919651677c7c520b67627aa2a' },
      { index: 6, hash: '1bfcb70acfee69c7ef93ea300e3127715dcced515022daf9f149d395610b2cc4' },
      { index: 7, hash: '2aba75fea2a102a5a28b92cc3b8115a989769dea4be62ef04cef08c2757435dc' },
      { index: 8, hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855' },
    ],
  });
});

spec.test('hasher function receives value, path and position parameters', async (ctx) => {
  const values = ['A', 'B'];
  const hashings = [];
  const merkle = new Merkle({
    hasher: (v, p, n) => {
      hashings.push([v, p, n]);
      return v;
    },
  });
  await merkle.notarize(values);
  ctx.deepEqual(hashings, [
    ['', [2], 2],
    ['B', [1], 0],
    ['B', [1], 1],
    ['B', [1], 2],
    ['A', [0], 0],
    ['A', [0], 1],
    ['AB', [0], 2],
  ]);
});

spec.test('with prepended path', async (ctx) => {
  const values = ['A'];
  const hashings = [];
  const merkle = new Merkle({
    hasher: (v, p, n) => {
      hashings.push([v, p, n]);
      return v;
    },
  });
  await merkle.notarize(values, ['a', 1]);
  ctx.deepEqual(hashings, [
    ['', ['a', 1, 1], 2],
    ['A', ['a', 1, 0], 0],
    ['A', ['a', 1, 0], 1],
    ['A', ['a', 1, 0], 2],
  ]);
});

spec.test('recipe with custom noncer function', async (ctx) => {
  const values = ['A', 'B'];
  const merkle = new Merkle({
    hasher: (v) => sha(256, v),
    noncer: (p) => p.join('.'),
  });
  const recipe = await merkle.notarize(values);
  ctx.deepEqual(recipe, {
    values: [
      { index: 0, value: 'A', nonce: '0' },
      { index: 1, value: 'B', nonce: '1' },
    ],
    nodes: [
      { index: 0, hash: '0443f36082b49f6398628f1771e6aa4012f3b117769d26e0f310173a05412d68' },
      { index: 1, hash: 'b9a5664f3a31dca64676b87cb545361635bbe44b46ef50c20a93418a7cfe268b' },
      { index: 2, hash: 'd6acec654d71648341c30c724f077b8ff2cdfdb320bb6d2a7691b9d167d1217c' },
      { index: 3, hash: 'feb193d6d935421a62cf7228db7c3330992b925b283a31b5105101b8f7596e20' },
      { index: 4, hash: 'd4735e3a265e16eee03f59718b9b5d03019c07d8b6c51f90da3a666eec13ab35' },
    ],
  });
});

spec.test('noncer function receives path parameter', async (ctx) => {
  const values = ['A', 'B'];
  const noncing = [];
  const merkle = new Merkle({
    noncer: (p) => {
      noncing.push(p);
      return '';
    },
  });
  await merkle.notarize(values);
  ctx.deepEqual(noncing, [
    [2],
    [1],
    [0],
  ]);
});

export default spec;
