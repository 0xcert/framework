import { Spec } from '@specron/spec';

interface Data {
  xcert?: any;
  owner?: string;
  bob?: string;
  jane?: string;
  sara?: string;
  id1?: string;
  id2?: string;
  uriPrefix?: string;
  uriPostfix?: string;
  digest1?: string;
  digest2?: string;
}

const spec = new Spec<Data>();

spec.beforeEach(async (ctx) => {
  const accounts = await ctx.web3.eth.getAccounts();
  ctx.set('owner', accounts[0]);
  ctx.set('bob', accounts[1]);
  ctx.set('jane', accounts[2]);
  ctx.set('sara', accounts[3]);
});

spec.beforeEach(async (ctx) => {
  ctx.set('id1', '123');
  ctx.set('id2', '124');
  ctx.set('uriPrefix', 'https://0xcert.org/');
  ctx.set('uriPostfix', '.json');
  ctx.set('digest1', '0x973124ffc4a03e66d6a4458e587d5d6146f71fc57f359c8d516e0b12a50ab0d9');
  ctx.set('digest2', '0x6f25b3f4bc7eadafb8f57d69f8a59db3b23f198151dbf3c66ac3082381518329');
});

spec.beforeEach(async (ctx) => {
  const uriPrefix = ctx.get('uriPrefix');
  const uriPostfix = ctx.get('uriPostfix');
  const xcert = await ctx.deploy({
    src: './build/xcert-mock.json',
    contract: 'XcertMock',
    args: ['Foo', 'F', uriPrefix, uriPostfix, '0x9c22ff5f21f0b81b113e63f7db6da94fedef11b2119b4088b89664fb9a3cb658', ['0x9d118770']],
  });

  ctx.set('xcert', xcert);
});

spec.test('successfuly destroys an Xcert', async (ctx) => {
  const xcert = ctx.get('xcert');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const id1 = ctx.get('id1');
  const id2 = ctx.get('id2');
  const digest1 = ctx.get('digest1');
  const digest2 = ctx.get('digest2');

  await xcert.instance.methods.create(bob, id1, digest1).send({ from: owner });
  await xcert.instance.methods.create(bob, id2, digest2).send({ from: owner });
  const logs = await xcert.instance.methods.destroy(id1).send({ from: bob });
  ctx.not(logs.events.Transfer, undefined);

  const balance = await xcert.instance.methods.balanceOf(bob).call();
  ctx.is(balance, '1');
  await ctx.reverts(() => xcert.instance.methods.ownerOf(id1).call(), '006002');

  const tokenIndex0 = await xcert.instance.methods.tokenByIndex(0).call();
  ctx.is(tokenIndex0, id2);

  const tokenOwnerIndex0 = await xcert.instance.methods.tokenOfOwnerByIndex(bob, 0).call();
  ctx.is(tokenOwnerIndex0, id2);

  await ctx.reverts(() => xcert.instance.methods.tokenByIndex(1).call(), '006007');
  await ctx.reverts(() => xcert.instance.methods.tokenOfOwnerByIndex(bob, 1).call(), '006007');
});

spec.test('successfuly destroys an Xcert from an operator', async (ctx) => {
  const xcert = ctx.get('xcert');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const sara = ctx.get('sara');
  const id1 = ctx.get('id1');
  const digest1 = ctx.get('digest1');

  await xcert.instance.methods.create(bob, id1, digest1).send({ from: owner });
  await xcert.instance.methods.setApprovalForAll(sara, true).send({ from: bob });

  const logs = await xcert.instance.methods.destroy(id1).send({ from: sara });
  ctx.not(logs.events.Transfer, undefined);
});

spec.test('throws when trying to destroy an already destroyed Xcert', async (ctx) => {
  const xcert = ctx.get('xcert');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const id1 = ctx.get('id1');
  const digest1 = ctx.get('digest1');

  await xcert.instance.methods.create(bob, id1, digest1).send({ from: owner });
  await xcert.instance.methods.destroy(id1).send({ from: bob});
  await ctx.reverts(() => xcert.instance.methods.destroy(id1).send({ from: bob }), '006002');
});

spec.test('throws when a third party tries to destroy a Xcert', async (ctx) => {
  const xcert = ctx.get('xcert');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const sara = ctx.get('sara');
  const id1 = ctx.get('id1');
  const digest1 = ctx.get('digest1');

  await xcert.instance.methods.create(bob, id1, digest1).send({ from: owner });
  await ctx.reverts(() => xcert.instance.methods.destroy(id1).send({ from: sara }, '008001'));
});

export default spec;
