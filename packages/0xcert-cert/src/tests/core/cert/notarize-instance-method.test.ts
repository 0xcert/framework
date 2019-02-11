import { Spec } from '@hayspec/spec';
import { Cert } from '../../../core/cert';
import { exampleData, exampleSchema } from '../helpers/schema';

const spec = new Spec();

spec.test('returns recipes for a complete a complete schema', async (ctx) => {
  const cert = new Cert({
    schema: exampleSchema,
  });
  const recipes = await cert.notarize(exampleData);
  ctx.deepEqual(recipes, [
    {
      path: [],
      values: [
        { index: 0, value: 'c1efb9bf8e6978a28cff273179451de36230018d752bae4e21219163bc9e5c66' },
        { index: 1, value: 'A' },
        { index: 2, value: 'cecf5f228b718ed5c43c8781a64b88f00977dcfc052c2d87d07e3418530b3fea' },
        { index: 3, value: 'B' },
        { index: 4, value: '88679538d4803d86aa7ac35affdb9db6cec12cd7eab6cbb46426520a61fa0d5b' },
      ],
      nodes: [
        { index: 0, hash: 'fe3ea95fa6bda2001c58fd13d5c7655f83b8c8bf225b9dfa7b8c7311b8b68933' },
        { index: 1, hash: 'd747e6ffd1aa3f83efef2931e3cc22c653ea97a32c1ee7289e4966b6964ecdfb' },
        { index: 2, hash: '61e89ff7d9f3a0003d56b3f83b9053ecdb587b71a3ccf1d3329b9aae7314926d' },
        { index: 3, hash: '559aead08264d5795d3909718cdd05abd49572e84fe55590eef31a88a08fdffd' },
        { index: 4, hash: '3edeca6a414053b46d1d0e997abd6cf13aea3588764658e6cbfce4ab098d6ab3' },
        { index: 5, hash: 'ab7a1a25348448f245bb0dcff7508d2a499051bfdb3e68d703bc5112199b20b0' },
        { index: 6, hash: '14287058a78ef3a7d0c5b0417bc252de066942bcd65259d62ef26b05271587be' },
        { index: 7, hash: 'df7e70e5021544f4834bbee64a9e3789febc4be81470df629cad6ddb03320a5c' },
        { index: 8, hash: '27939152348bd40d93319d31a98c99efd13d3234ef5c9abd1982902f4a1dae8c' },
        { index: 9, hash: 'e1de55ba9db368876d2093261f3c6fcde581a43fbe4892f2a58a44460c7e27b8' },
        { index: 10, hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855' },
      ],
    },
    {
      path: ['books'],
      values: [
        { index: 0, value: 'a30ed94f8603d4a7d4e0d3a10684a3dc5773b1b0a38032dc23d77533875f8eda' },
        { index: 1, value: '614a57acb8c26b0cc5e111a7875080f9b4ceaf7f577d9515981b3b746fab4cb7' },
      ],
      nodes: [
        { index: 0, hash: 'c1efb9bf8e6978a28cff273179451de36230018d752bae4e21219163bc9e5c66' },
        { index: 1, hash: 'a547d071f837cd3d8c297696ecadaed3c02242ab22c6724c9ee7ad07437ddb91' },
        { index: 2, hash: '0e77ab0f64c0604dc9fdf49f99f36a96556753047c3dba5a653a15945a892315' },
        { index: 3, hash: '3f3ef9a0b1414cecf219ec20194bf6ca5f6b620fd4f7dd56756af124d7b744b4' },
        { index: 4, hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855' },
      ],
    },
    {
      path: ['books', 0],
      values: [
        { index: 0, value: 'A0' },
        { index: 1, value: 'B0' },
      ],
      nodes: [
        { index: 0, hash: 'a30ed94f8603d4a7d4e0d3a10684a3dc5773b1b0a38032dc23d77533875f8eda' },
        { index: 1, hash: 'aa508c2187fca56f397ff75adc52b94e02f38122cdd48bd42105106e5e0f8e14' },
        { index: 2, hash: '7c5c705cc6dcf7a82b658ef0cdaeff61c080ba2f024abd4a779139f73a005751' },
        { index: 3, hash: '05816a1560db947d6ff798e30909816f400f14230e9a06afac8f8b213127aa21' },
        { index: 4, hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855' },
      ],
    },
    {
      path: ['books', 1],
      values: [
        { index: 0, value: 'A1' },
        { index: 1, value: 'B1' },
      ],
      nodes: [
        { index: 0, hash: '614a57acb8c26b0cc5e111a7875080f9b4ceaf7f577d9515981b3b746fab4cb7' },
        { index: 1, hash: '16a36e86f6fed5d465ff332511a0ce1a863b55d364b25a7cdaa25db19abf9648' },
        { index: 2, hash: '24f60dbcc5ef66f2b3c55b3fecb414bafe51caa6298f22a5249e091bd2192255' },
        { index: 3, hash: '5b950e77941d01cdf246d00b1ece546bc95234b77d98b44c9187e2733afa696a' },
        { index: 4, hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855' },
      ],
    },
    {
      path: ['event'],
      values: [
        { index: 0, value: 'b79f2e3f88dea9c1f218073dae360348a46d2a32062820e20ded9664b949a132' },
        { index: 1, value: 'A' },
      ],
      nodes: [
        { index: 0, hash: 'cecf5f228b718ed5c43c8781a64b88f00977dcfc052c2d87d07e3418530b3fea' },
        { index: 1, hash: '8a65b8d264d31aa00b86838256f8af9a574bd7722280c4093dfb721ccbf8e5b2' },
        { index: 2, hash: 'ec07adc6a372d96b68ab8d8facc84c8242ebb3444330847f9f7c7ff7f138e87f' },
        { index: 3, hash: '559aead08264d5795d3909718cdd05abd49572e84fe55590eef31a88a08fdffd' },
        { index: 4, hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855' },
      ],
    },
    {
      path: ['event', 'organizer'],
      values: [
        { index: 0, value: 'A' },
        { index: 1, value: 'B' },
      ],
      nodes: [
        { index: 0, hash: 'b79f2e3f88dea9c1f218073dae360348a46d2a32062820e20ded9664b949a132' },
        { index: 1, hash: '559aead08264d5795d3909718cdd05abd49572e84fe55590eef31a88a08fdffd' },
        { index: 2, hash: '76c2e52ac1afbedc7dfd7a36a8aace41bdf1537524678d1744ef42d41bb8e912' },
        { index: 3, hash: 'df7e70e5021544f4834bbee64a9e3789febc4be81470df629cad6ddb03320a5c' },
        { index: 4, hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855' },
      ],
    },
    {
      path: ['tags'],
      values: [
        { index: 0, value: 1 },
        { index: 1, value: 2 },
      ],
      nodes: [
        { index: 0, hash: '88679538d4803d86aa7ac35affdb9db6cec12cd7eab6cbb46426520a61fa0d5b' },
        { index: 1, hash: '6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b' },
        { index: 2, hash: '8db6634b1a8ec05f8e49b9a4405212b5f4143d24b99b7e9d32501003f5dd86c8' },
        { index: 3, hash: 'd4735e3a265e16eee03f59718b9b5d03019c07d8b6c51f90da3a666eec13ab35' },
        { index: 4, hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855' },
      ],
    },
  ]);
});

export default spec;
