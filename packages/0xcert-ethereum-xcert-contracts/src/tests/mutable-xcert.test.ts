import { Spec } from '@specron/spec';

interface Data {
  xcert?: any;
  owner?: string;
  bob?: string;
  jane?: string;
  sara?: string;
  zeroAddress?: string;
  id1?: string;
  id2?: string;
  id3?: string;
  uriPrefix?: string;
  uriPostfix?: string;
  imprint1?: string;
  imprint2?: string;
  imprint3?: string;
}

const spec = new Spec<Data>();

spec.beforeEach(async (ctx) => {
  const accounts = await ctx.web3.eth.getAccounts();
  ctx.set('owner', accounts[0]);
  ctx.set('bob', accounts[1]);
  ctx.set('jane', accounts[2]);
  ctx.set('sara', accounts[3]);
  ctx.set('zeroAddress', '0x0000000000000000000000000000000000000000');
});

spec.beforeEach(async (ctx) => {
  ctx.set('id1', '123');
  ctx.set('id2', '124');
  ctx.set('id3', '125');
  ctx.set('uriPrefix', 'https://0xcert.org/');
  ctx.set('uriPostfix', '.json');
  ctx.set('imprint1', '0x973124ffc4a03e66d6a4458e587d5d6146f71fc57f359c8d516e0b12a50ab0d9');
  ctx.set('imprint2', '0x6f25b3f4bc7eadafb8f57d69f8a59db3b23f198151dbf3c66ac3082381518329');
  ctx.set('imprint3', '0xc77a290be17f8a4ef301c4ca46497c5beb4a0556ec2d5a04dce4ce6ebd439ad1');
});

spec.beforeEach(async (ctx) => {
  const uriPrefix = ctx.get('uriPrefix');
  const uriPostfix = ctx.get('uriPostfix');
  const xcert = await ctx.deploy({
    src: './build/xcert-mock.json',
    contract: 'XcertMock',
    args: ['Foo', 'F', uriPrefix, uriPostfix, '0x9c22ff5f21f0b81b113e63f7db6da94fedef11b2119b4088b89664fb9a3cb658', ['0x0d04c3b8']],
  });

  ctx.set('xcert', xcert);
});

spec.test('successfully updates imprint', async (ctx) => {
  const xcert = ctx.get('xcert');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const id = ctx.get('id1');
  const imprint = ctx.get('imprint1');
  const newImprint = ctx.get('imprint2');

  await xcert.instance.methods.create(bob, id, imprint).send({ from: owner });
  const logs = await xcert.instance.methods.updateTokenURIIntegrityDigest(id, newImprint).send({ from: owner });
  ctx.not(logs.events.TokenURIIntegrityDigestUpdate, undefined);
  const xcertId1Imprint = await xcert.instance.methods.tokenURIIntegrity(id).call();
  ctx.is(xcertId1Imprint.digest, newImprint);
});

spec.test('throws when a third party tries to update imprint', async (ctx) => {
  const xcert = ctx.get('xcert');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const sara = ctx.get('sara');
  const id = ctx.get('id1');
  const imprint = ctx.get('imprint1');
  const newImprint = ctx.get('imprint2');

  await xcert.instance.methods.create(bob, id, imprint).send({ from: owner });
  await ctx.reverts(() => xcert.instance.methods.updateTokenURIIntegrityDigest(id, newImprint).send({ from: sara }));
});

spec.test('throws when trying to update Xcert that does not exist', async (ctx) => {
  const xcert = ctx.get('xcert');
  const owner = ctx.get('owner');
  const id = ctx.get('id1');
  const imprint = ctx.get('imprint1');

  await ctx.reverts(() => xcert.instance.methods.updateTokenURIIntegrityDigest(id, imprint).send({ from: owner }), '007003');
});

export default spec;
