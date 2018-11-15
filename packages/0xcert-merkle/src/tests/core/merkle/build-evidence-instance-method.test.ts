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

spec.test('exposes 4, 8, 11 from A, B, C, D, E, F, G, H', async (ctx) => {
  const values = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  const expose = [4, 8, 11];
  const recipe = await ctx.get('merkle').buildRecipe(values);
  const evidence = await ctx.get('merkle').buildEvidence(recipe, expose);
  ctx.deepEqual(evidence, {
    values: [
      { index: 4, value: 'E' },
      { index: 8, value: '-' },
      { index: 11, value: '-' },
    ],
    proofs: [
      { index: 2, hash: '6b23c0d5f35d1b11f9b683f0b0a617355deb11277d91ae091d399c655b87940d' },
      { index: 3, hash: '3f39d5c348e5b79d06e842c114e6cc571583bbf44e4b0ebfda1a01ec05745d43' },
      { index: 5, hash: 'f67ab10ad4e4c53121b6a5fe4da9c10ddee905b978d3788d2723d7bfacbe28a9' },
      { index: 6, hash: '333e0a1e27815d0ceee55c473fe3dc93d56c63e3bee2b3b4aee8eed6d70191a3' },
      { index: 7, hash: '44bd7ae60f478fae1061e11a7739f4b94d1daf917982d33b6fc8a01a63f89c21' },
      { index: 9, hash: '3973e022e93220f9212c18d0d0c543ae7c309e46640da93a4a0314de999f5112' },
      { index: 10, hash: '3973e022e93220f9212c18d0d0c543ae7c309e46640da93a4a0314de999f5112' },
      { index: 12, hash: '3973e022e93220f9212c18d0d0c543ae7c309e46640da93a4a0314de999f5112' },
      { index: 13, hash: '3973e022e93220f9212c18d0d0c543ae7c309e46640da93a4a0314de999f5112' },
    ],
    nodes: [
      { index: 1, hash: 'b30ab174f7459cdd40a3acdf15d0c9444fec2adcfb9d579aa154c084885edd0a' },
      { index: 6, hash: '3973e022e93220f9212c18d0d0c543ae7c309e46640da93a4a0314de999f5112' },
    ],
  });
});

spec.test('exposes 10 from A, B, C, D, E, F, G, H', async (ctx) => {
  const values = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  const expose = [10];
  const recipe = await ctx.get('merkle').buildRecipe(values);
  const evidence = await ctx.get('merkle').buildEvidence(recipe, expose);
  ctx.deepEqual(evidence, {
    values: [
      { index: 10, value: '-' },
    ],
    proofs: [
      { index: 6, hash: '333e0a1e27815d0ceee55c473fe3dc93d56c63e3bee2b3b4aee8eed6d70191a3' },
      { index: 7, hash: '44bd7ae60f478fae1061e11a7739f4b94d1daf917982d33b6fc8a01a63f89c21' },
      { index: 8, hash: '3973e022e93220f9212c18d0d0c543ae7c309e46640da93a4a0314de999f5112' },
      { index: 9, hash: '3973e022e93220f9212c18d0d0c543ae7c309e46640da93a4a0314de999f5112' },
      { index: 11, hash: '3973e022e93220f9212c18d0d0c543ae7c309e46640da93a4a0314de999f5112' },
      { index: 12, hash: '3973e022e93220f9212c18d0d0c543ae7c309e46640da93a4a0314de999f5112' },
      { index: 13, hash: '3973e022e93220f9212c18d0d0c543ae7c309e46640da93a4a0314de999f5112' },
    ],
    nodes: [
      { index: 1, hash: 'b30ab174f7459cdd40a3acdf15d0c9444fec2adcfb9d579aa154c084885edd0a' },
      { index: 3, hash: 'c00016b7d63ebaa78b9de8b03749003fe537eb53a33d659aa90391b5eec92b7f' },
      { index: 6, hash: '3973e022e93220f9212c18d0d0c543ae7c309e46640da93a4a0314de999f5112' },
    ],
  });
});

spec.test('exposes 5 from A, B, C, D, E, F, G, H', async (ctx) => {
  const values = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  const expose = [5];
  const recipe = await ctx.get('merkle').buildRecipe(values);
  const evidence = await ctx.get('merkle').buildEvidence(recipe, expose);
  ctx.deepEqual(evidence, {
    values: [
      { index: 5, value: 'F' },
    ],
    proofs: [
      { index: 2, hash: '6b23c0d5f35d1b11f9b683f0b0a617355deb11277d91ae091d399c655b87940d' },
      { index: 3, hash: '3f39d5c348e5b79d06e842c114e6cc571583bbf44e4b0ebfda1a01ec05745d43' },
      { index: 4, hash: 'a9f51566bd6705f7ea6ad54bb9deb449f795582d6529a0e22207b8981233ec58' },
    ],
    nodes: [
      { index: 1, hash: 'b30ab174f7459cdd40a3acdf15d0c9444fec2adcfb9d579aa154c084885edd0a' },
      { index: 4, hash: '4e162e205f1730dcc8625b6448b8050a4db0a8eac728ff9a48cc58f9594c7266' },
    ],
  });
});

export default spec;
