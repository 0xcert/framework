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
    { level: 0, index: 0, hash: 'bbbca93ef50c14162855807bf169d26660c1669401db62246cf1ecbb9db1d66e' },
    { level: 1, index: 0, hash: 'c0ee3e916bb2f9b562c76383daeeb47a9844cdcdd204b659d37184027b3cc084' },
    { level: 1, index: 1, hash: '306ca0db44290454c319a7cac70c7bde91844ff934fc3e6f827b08ff4d28393e' },
    { level: 2, index: 0, hash: '13d183be78dbcc966b780df120a1860b5974f42528b180adf2a23bf036839b68' },
    { level: 2, index: 1, hash: 'd0bf2233f0c5110a95f5989b608c632123046eb897cc789f0799960ef31d5e71' },
    { level: 2, index: 2, hash: '306ca0db44290454c319a7cac70c7bde91844ff934fc3e6f827b08ff4d28393e' },
    { level: 3, index: 0, hash: '3acdaa86b3d73e8d18b7019d3f520000531a23db3b6dda7a94ad28db61a9008c' },
    { level: 3, index: 1, hash: '62b0edb16d2fb7beab23da14d2831750820ee0404dc24b82392658efb13b8b34' },
    { level: 3, index: 2, hash: '78716e0ee7fd6fb4421145561981b1d02f94a6a596e86543fea7f8723320051e' },
    { level: 3, index: 3, hash: '546dffd24e26047e732c2b2c9bb9f34dbadb539540e3d08b929795ec3312d60a' },
    { level: 3, index: 4, hash: '306ca0db44290454c319a7cac70c7bde91844ff934fc3e6f827b08ff4d28393e' },
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