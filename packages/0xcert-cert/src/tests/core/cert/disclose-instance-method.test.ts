import { Spec } from '@hayspec/spec';
import { Cert } from '../../../core/cert';
import { exampleSchema, exampleData } from '../helpers/schema';

const spec = new Spec();

spec.test('returns proofs from exposed paths `name`', async (ctx) => {
  const cert = new Cert({
    schema: exampleSchema,
  });
  const proofs = await cert.disclose(exampleData, [
    [''],
    ['name'],
  ]);
  ctx.deepEqual(proofs, [
    {
      path: [],
      values: [
        { index: 3, value: 'B' },
      ],
      nodes: [
        { index: 1, hash: 'd747e6ffd1aa3f83efef2931e3cc22c653ea97a32c1ee7289e4966b6964ecdfb' },
        { index: 3, hash: '559aead08264d5795d3909718cdd05abd49572e84fe55590eef31a88a08fdffd' },
        { index: 5, hash: 'ab7a1a25348448f245bb0dcff7508d2a499051bfdb3e68d703bc5112199b20b0' },
        { index: 8, hash: '27939152348bd40d93319d31a98c99efd13d3234ef5c9abd1982902f4a1dae8c' },
      ],
    },
  ]);
});

spec.test('returns proofs from exposed paths `event.organizer.name`', async (ctx) => {
  const cert = new Cert({
    schema: exampleSchema,
  });
  const proofs = await cert.disclose(exampleData, [
    ['event', 'organizer', 'name'],
  ]);
  ctx.deepEqual(proofs, [
    {
      path: [],
      values: [
        { index: 2, value: 'cecf5f228b718ed5c43c8781a64b88f00977dcfc052c2d87d07e3418530b3fea' },
      ],
      nodes: [
        { index: 1, hash: 'd747e6ffd1aa3f83efef2931e3cc22c653ea97a32c1ee7289e4966b6964ecdfb' },
        { index: 3, hash: '559aead08264d5795d3909718cdd05abd49572e84fe55590eef31a88a08fdffd' },
        { index: 6, hash: '14287058a78ef3a7d0c5b0417bc252de066942bcd65259d62ef26b05271587be' },
      ],
    },
    {
      path: ['event'],
      values: [
        { index: 0, value: 'b79f2e3f88dea9c1f218073dae360348a46d2a32062820e20ded9664b949a132' },
      ],
      nodes: [
        { index: 2, hash: 'ec07adc6a372d96b68ab8d8facc84c8242ebb3444330847f9f7c7ff7f138e87f' },
      ],
    },
    {
      path: ['event', 'organizer'],
      values: [
        { index: 1, value: 'B' },
      ],
      nodes: [
        { index: 1, hash: '559aead08264d5795d3909718cdd05abd49572e84fe55590eef31a88a08fdffd' },
        { index: 4, hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855' },
      ],
    },
  ]);
});

export default spec;
