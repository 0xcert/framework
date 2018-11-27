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

spec.test('empty array', async (ctx) => {
  const values = [];
  const evidence = await ctx.get('merkle').notarize(values);
  ctx.deepEqual(evidence, {
    values: [],
    nodes: [
      { index: 0, hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855' },
    ],
  });
});

spec.test('array with element A', async (ctx) => {
  const values = ['A'];
  const evidence = await ctx.get('merkle').notarize(values);
  ctx.deepEqual(evidence, {
    values: [
      { index: 0, value: 'A' },
    ],
    nodes: [
      { index: 0, hash: 'ec07adc6a372d96b68ab8d8facc84c8242ebb3444330847f9f7c7ff7f138e87f' },
      { index: 1, hash: '559aead08264d5795d3909718cdd05abd49572e84fe55590eef31a88a08fdffd' },
      { index: 2, hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855' },
    ],
  });
});

spec.test('builds evidence for values A,B,C,D', async (ctx) => {
  const values = ['A', 'B', 'C', 'D'];
  const evidence = await ctx.get('merkle').notarize(values);
  ctx.deepEqual(evidence, {
    values: [
      { index: 0, value: 'A' },
      { index: 1, value: 'B' },
      { index: 2, value: 'C' },
      { index: 3, value: 'D' },
    ],
    nodes: [
      { index: 0, hash: '0bcec31a258c3f9aa814efe53d638648df413a1fe35470b5be5341a2a9fd30a9' },
      { index: 1, hash: '559aead08264d5795d3909718cdd05abd49572e84fe55590eef31a88a08fdffd' },
      { index: 2, hash: '0d3cbba6d77aac238ec246f9973b01c7183b71a56a06127e1bf699f1327aafea' },
      { index: 3, hash: 'df7e70e5021544f4834bbee64a9e3789febc4be81470df629cad6ddb03320a5c' },
      { index: 4, hash: '2deb44a999dcba4d19540f77611516cdd82cca3a91ce0981fdaf67988304afa3' },
      { index: 5, hash: '6b23c0d5f35d1b11f9b683f0b0a617355deb11277d91ae091d399c655b87940d' },
      { index: 6, hash: 'dbf687a59392a9b4a1c1fe1527b776a85b971c583ea22a88e41cebf91215930c' },
      { index: 7, hash: '3f39d5c348e5b79d06e842c114e6cc571583bbf44e4b0ebfda1a01ec05745d43' },
      { index: 8, hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855' },
    ],
  });
});

export default spec;
