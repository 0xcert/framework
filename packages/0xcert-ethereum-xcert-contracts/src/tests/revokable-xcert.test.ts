import { Spec } from '@specron/spec';

/**
 * Spec context interfaces.
 */

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
  uriBase?: string;
  imprint1?: string;
  imprint2?: string;
  imprint3?: string;
}

const spec = new Spec<Data>();

export default spec;

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
  ctx.set('uriBase', 'http://0xcert.org/');
  ctx.set('imprint1', '0x973124ffc4a03e66d6a4458e587d5d6146f71fc57f359c8d516e0b12a50ab0d9');
  ctx.set('imprint2', '0x6f25b3f4bc7eadafb8f57d69f8a59db3b23f198151dbf3c66ac3082381518329');
  ctx.set('imprint3', '0xc77a290be17f8a4ef301c4ca46497c5beb4a0556ec2d5a04dce4ce6ebd439ad1');
});

spec.beforeEach(async (ctx) => {
  const owner = ctx.get('owner');
  const uriBase = ctx.get('uriBase');
  const xcert = await ctx.deploy({ 
    src: './build/xcert-mock.json',
    contract: 'XcertMock',
    args: ['Foo','F',uriBase,'0x9c22ff5f21f0b81b113e63f7db6da94fedef11b2119b4088b89664fb9a3cb658', ['0x20c5429b']]
  });

  await xcert.instance.methods.assignAbilities(owner, [1,2]).send({ from: owner });
  ctx.set('xcert', xcert);
});

spec.test('successfuly revokes an xcert', async (ctx) => {
  const xcert = ctx.get('xcert');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const id1 = ctx.get('id1');
  const id2 = ctx.get('id2');
  const imprint1 = ctx.get('imprint1');
  const imprint2 = ctx.get('imprint2');

  await xcert.instance.methods.create(bob, id1, imprint1).send({ from: owner });
  await xcert.instance.methods.create(bob, id2, imprint2).send({ from: owner });
  const logs = await xcert.instance.methods.revoke(id1).send({ from: owner });
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

spec.test('throws when trying to revoke an already revoked xcert', async (ctx) => {
  const xcert = ctx.get('xcert');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const id1 = ctx.get('id1');
  const imprint1 = ctx.get('imprint1');

  await xcert.instance.methods.create(bob, id1, imprint1).send({ from: owner });
  await xcert.instance.methods.revoke(id1).send({ from: owner});
  await ctx.reverts(() => xcert.instance.methods.revoke(id1).send({ from: owner }), '006002');
});

spec.test('throws when a third party tries to revoke a xcert', async (ctx) => {
  const xcert = ctx.get('xcert');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const id1 = ctx.get('id1');
  const imprint1 = ctx.get('imprint1');

  await xcert.instance.methods.create(bob, id1, imprint1).send({ from: owner });
  await ctx.reverts(() => xcert.instance.methods.revoke(id1).send({ from: bob }));
});
