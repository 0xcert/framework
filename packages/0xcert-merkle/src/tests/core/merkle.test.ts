import { Spec } from '@hayspec/spec';
import { sha256 } from '@0xcert/crypto';
import { Merkle, MerkleValue, MerkleNode } from '../..';

/**
 * Root spec initialization.
 */

interface Data {
  merkle: Merkle;
  nodes: MerkleNode[];
  values: MerkleValue[];
}

const spec = new Spec<Data>();

spec.before((stg) => {
  stg.set('merkle', new Merkle({ algo: sha256 }));
  stg.set('nodes', [
    { level: 0, index: 0, hash: 'dea979f026a014fcb2300d6300e73ae1ccfb0dd238835d33895286d610eb7c4f' },
    { level: 1, index: 0, hash: '58c89d709329eb37285837b042ab6ff72c7c8f74de0446b091b6a0131c102cfd' },
    { level: 1, index: 1, hash: '3f79bb7b435b05321651daefd374cdc681dc06faa65e374e38337b88ca046dea' },
    { level: 2, index: 0, hash: '62af5c3cb8da3e4f25061e829ebeea5c7513c54949115b1acc225930a90154da' },
    { level: 2, index: 1, hash: 'd3a0f1c792ccf7f1708d5422696263e35755a86917ea76ef9242bd4a8cf4891a' },
    { level: 2, index: 2, hash: '3f79bb7b435b05321651daefd374cdc681dc06faa65e374e38337b88ca046dea' },
    { level: 3, index: 0, hash: 'ca978112ca1bbdcafac231b39a23dc4da786eff8147c4e72b9807785afee48bb' },
    { level: 3, index: 1, hash: '3e23e8160039594a33894f6564e1b1348bbd7a0088d42c4acb73eeaed59c009d' },
    { level: 3, index: 2, hash: '2e7d2c03a9507ae265ecf5b5356885a53393a2029d241394997265a1a25aefc6' },
    { level: 3, index: 3, hash: '18ac3e7343f016890c510e93f935261169d9e3f565436429830faf0934f4f8e4' },
    { level: 3, index: 4, hash: '3f79bb7b435b05321651daefd374cdc681dc06faa65e374e38337b88ca046dea' },
  ]);
  stg.set('values', [
    { index: 0, value: 'a' },
    { index: 1, value: 'b' },
    { index: 2, value: 'c' },
    { index: 3, value: 'd' },
    { index: 4, value: 'e' },
  ]);
});

/**
 * Testing build() method.
 */

const build = new Spec<Data>();

spec.spec('method build()', build);

build.test('method `build()` returns a complete list of merkle tree nodes', async (ctx) => {
  const res = await ctx.get('merkle').build(ctx.get('values'));
  ctx.deepEqual(res, ctx.get('nodes'));
});

/**
 * Testing pack() method.
 */

const pack = new Spec<Data>();

spec.spec('method `pack()', pack);

pack.test('returns required nodes for exposed value at index 0', async (ctx) => {
  const res = await ctx.get('merkle').pack(ctx.get('nodes'), [0]);
  ctx.deepEqual(res, [
    ctx.get('nodes')[2],
    ctx.get('nodes')[4],
    ctx.get('nodes')[7],
  ]);
});

pack.test('returns required nodes for exposed value at index 1', async (ctx) => {
  const res = await ctx.get('merkle').pack(ctx.get('nodes'), [1]);
  ctx.deepEqual(res, [
    ctx.get('nodes')[2],
    ctx.get('nodes')[4],
    ctx.get('nodes')[6],
  ]);
});

pack.test('returns required nodes for exposed value at index 2', async (ctx) => {
  const res = await ctx.get('merkle').pack(ctx.get('nodes'), [2]);
  ctx.deepEqual(res, [
    ctx.get('nodes')[2],
    ctx.get('nodes')[3],
    ctx.get('nodes')[9],
  ]);
});

pack.test('returns required nodes for exposed value at index 3', async (ctx) => {
  const res = await ctx.get('merkle').pack(ctx.get('nodes'), [3]);
  ctx.deepEqual(res, [
    ctx.get('nodes')[2],
    ctx.get('nodes')[3],
    ctx.get('nodes')[8],
  ]);
});

pack.test('returns required nodes for exposed value at index 4', async (ctx) => {
  const res = await ctx.get('merkle').pack(ctx.get('nodes'), [4]);
  ctx.deepEqual(res, [
    ctx.get('nodes')[1],
  ]);
});

pack.test('returns required nodes for exposed values at index 0 and 1', async (ctx) => {
  const res = await ctx.get('merkle').pack(ctx.get('nodes'), [0, 1]);
  ctx.deepEqual(res, [
    ctx.get('nodes')[2],
    ctx.get('nodes')[4],
  ]);
});

pack.test('returns required nodes for exposed values at index 0 and 2', async (ctx) => {
  const res = await ctx.get('merkle').pack(ctx.get('nodes'), [0, 2]);
  ctx.deepEqual(res, [
    ctx.get('nodes')[2],
    ctx.get('nodes')[7],
    ctx.get('nodes')[9],
  ]);
});

pack.test('returns required nodes for exposed values at index 0 and 3', async (ctx) => {
  const res = await ctx.get('merkle').pack(ctx.get('nodes'), [0, 3]);
  ctx.deepEqual(res, [
    ctx.get('nodes')[2],
    ctx.get('nodes')[7],
    ctx.get('nodes')[8],
  ]);
});

pack.test('returns required nodes for exposed values at index 1 and 2', async (ctx) => {
  const res = await ctx.get('merkle').pack(ctx.get('nodes'), [1, 2]);
  ctx.deepEqual(res, [
    ctx.get('nodes')[2],
    ctx.get('nodes')[6],
    ctx.get('nodes')[9],
  ]);
});

pack.test('returns required nodes for exposed values at index 1 and 3', async (ctx) => {
  const res = await ctx.get('merkle').pack(ctx.get('nodes'), [1, 3]);
  ctx.deepEqual(res, [
    ctx.get('nodes')[2],
    ctx.get('nodes')[6],
    ctx.get('nodes')[8],
  ]);
});

pack.test('returns required nodes for exposed values at index 1 and 4', async (ctx) => {
  const res = await ctx.get('merkle').pack(ctx.get('nodes'), [1, 4]);
  ctx.deepEqual(res, [
    ctx.get('nodes')[4],
    ctx.get('nodes')[6],
  ]);
});

pack.test('returns required nodes for exposed values at index 2 and 3', async (ctx) => {
  const res = await ctx.get('merkle').pack(ctx.get('nodes'), [2, 3]);
  ctx.deepEqual(res, [
    ctx.get('nodes')[2],
    ctx.get('nodes')[3],
  ]);
});

pack.test('returns required nodes for exposed values at index 2 and 4', async (ctx) => {
  const res = await ctx.get('merkle').pack(ctx.get('nodes'), [2, 4]);
  ctx.deepEqual(res, [
    ctx.get('nodes')[3],
    ctx.get('nodes')[9],
  ]);
});

/**
 * Testing calculate() method.
 */

const calculate = new Spec<Data>();

spec.spec('method `calculate()', calculate);

calculate.test('returns root node from value at index 0', async (ctx) => {
  const res = await ctx.get('merkle').calculate([
    ctx.get('values')[0],
  ], [
    ctx.get('nodes')[2],
    ctx.get('nodes')[4],
    ctx.get('nodes')[7],
  ], ctx.get('values').length);
  ctx.deepEqual(res, ctx.get('nodes')[0]);
});

calculate.test('returns root node from value at index 1', async (ctx) => {
  const res = await ctx.get('merkle').calculate([
    ctx.get('values')[1],
  ], [
    ctx.get('nodes')[2],
    ctx.get('nodes')[4],
    ctx.get('nodes')[6],
  ], ctx.get('values').length);
  ctx.deepEqual(res, ctx.get('nodes')[0]);
});

calculate.test('returns root node from value at index 2', async (ctx) => {
  const res = await ctx.get('merkle').calculate([
    ctx.get('values')[2],
  ], [
    ctx.get('nodes')[2],
    ctx.get('nodes')[3],
    ctx.get('nodes')[9],
  ], ctx.get('values').length);
  ctx.deepEqual(res, ctx.get('nodes')[0]);
});

calculate.test('returns root node from value at index 3', async (ctx) => {
  const res = await ctx.get('merkle').calculate([
    ctx.get('values')[3],
  ], [
    ctx.get('nodes')[2],
    ctx.get('nodes')[3],
    ctx.get('nodes')[8],
  ], ctx.get('values').length);
  ctx.deepEqual(res, ctx.get('nodes')[0]);
});

calculate.test('returns root node from value at index 4', async (ctx) => {
  const res = await ctx.get('merkle').calculate([
    ctx.get('values')[4],
  ], [
    ctx.get('nodes')[1],
  ], ctx.get('values').length);
  ctx.deepEqual(res, ctx.get('nodes')[0]);
});

calculate.test('returns root node from values at index 0 and 1', async (ctx) => {
  const res = await ctx.get('merkle').calculate([
    ctx.get('values')[0],
    ctx.get('values')[1],
  ], [
    ctx.get('nodes')[2],
    ctx.get('nodes')[4],
  ], ctx.get('values').length);
  ctx.deepEqual(res, ctx.get('nodes')[0]);
});

calculate.test('returns root node from values at index 0 and 2', async (ctx) => {
  const res = await ctx.get('merkle').calculate([
    ctx.get('values')[0],
    ctx.get('values')[2],
  ], [
    ctx.get('nodes')[2],
    ctx.get('nodes')[7],
    ctx.get('nodes')[9],
  ], ctx.get('values').length);
  ctx.deepEqual(res, ctx.get('nodes')[0]);
});

calculate.test('returns root node from values at index 0 and 3', async (ctx) => {
  const res = await ctx.get('merkle').calculate([
    ctx.get('values')[0],
    ctx.get('values')[3],
  ], [
    ctx.get('nodes')[2],
    ctx.get('nodes')[7],
    ctx.get('nodes')[8],
  ], ctx.get('values').length);
  ctx.deepEqual(res, ctx.get('nodes')[0]);
});

calculate.test('returns root node from values at index 1 and 2', async (ctx) => {
  const res = await ctx.get('merkle').calculate([
    ctx.get('values')[1],
    ctx.get('values')[2],
  ], [
    ctx.get('nodes')[2],
    ctx.get('nodes')[6],
    ctx.get('nodes')[9],
  ], ctx.get('values').length);
  ctx.deepEqual(res, ctx.get('nodes')[0]);
});

calculate.test('returns root node from values at index 1 and 3', async (ctx) => {
  const res = await ctx.get('merkle').calculate([
    ctx.get('values')[1],
    ctx.get('values')[3],
  ], [
    ctx.get('nodes')[2],
    ctx.get('nodes')[6],
    ctx.get('nodes')[8],
  ], ctx.get('values').length);
  ctx.deepEqual(res, ctx.get('nodes')[0]);
});

calculate.test('returns root node from values at index 1 and 4', async (ctx) => {
  const res = await ctx.get('merkle').calculate([
    ctx.get('values')[1],
    ctx.get('values')[4],
  ], [
    ctx.get('nodes')[4],
    ctx.get('nodes')[6],
  ], ctx.get('values').length);
  ctx.deepEqual(res, ctx.get('nodes')[0]);
});

calculate.test('returns root node from values at index 2 and 3', async (ctx) => {
  const res = await ctx.get('merkle').calculate([
    ctx.get('values')[2],
    ctx.get('values')[3],
  ], [
    ctx.get('nodes')[2],
    ctx.get('nodes')[3],
  ], ctx.get('values').length);
  ctx.deepEqual(res, ctx.get('nodes')[0]);
});

calculate.test('returns root node from values at index 2 and 4', async (ctx) => {
  const res = await ctx.get('merkle').calculate([
    ctx.get('values')[2],
    ctx.get('values')[4],
  ], [
    ctx.get('nodes')[3],
    ctx.get('nodes')[9],
  ], ctx.get('values').length);
  ctx.deepEqual(res, ctx.get('nodes')[0]);
});

export default spec;