import { Spec } from '@specron/spec';

interface Data {
  xcert?: any;
  owner?: string;
  bob?: string;
  sara?: string;
  id1?: string;
  uriPrefix?: string;
  uriPostfix?: string;
  digest1?: string;
}

const spec = new Spec<Data>();

spec.beforeEach(async (ctx) => {
  const accounts = await ctx.web3.eth.getAccounts();
  ctx.set('owner', accounts[0]);
  ctx.set('bob', accounts[1]);
  ctx.set('sara', accounts[2]);
});

spec.beforeEach(async (ctx) => {
  ctx.set('id1', '123');
  ctx.set('uriPrefix', 'https://0xcert.org/');
  ctx.set('uriPostfix', '.json');
  ctx.set('digest1', '0x973124ffc4a03e66d6a4458e587d5d6146f71fc57f359c8d516e0b12a50ab0d9');
});

spec.beforeEach(async (ctx) => {
  const uriPrefix = ctx.get('uriPrefix');
  const uriPostfix = ctx.get('uriPostfix');
  const xcert = await ctx.deploy({
    src: './build/xcert-mock.json',
    contract: 'XcertMock',
    args: ['Foo', 'F', uriPrefix, uriPostfix, '0x9c22ff5f21f0b81b113e63f7db6da94fedef11b2119b4088b89664fb9a3cb658', ['0xbedb86fb']],
  });

  ctx.set('xcert', xcert);
});

spec.test('successfully changes paused state', async (ctx) => {
  const xcert = ctx.get('xcert');
  const owner = ctx.get('owner');

  let pauseState = await xcert.instance.methods.isPaused().call();
  ctx.is(pauseState, false);

  const logs = await xcert.instance.methods.setPause(true).send({ from: owner });
  ctx.not(logs.events.IsPaused, undefined);

  pauseState = await xcert.instance.methods.isPaused().call();
  ctx.is(pauseState, true);

  await xcert.instance.methods.setPause(false).send({ from: owner });

  pauseState = await xcert.instance.methods.isPaused().call();
  ctx.is(pauseState, false);
});

spec.test('reverts when a third party tries to change pause state', async (ctx) => {
  const xcert = ctx.get('xcert');
  const bob = ctx.get('bob');

  await ctx.reverts(() => xcert.instance.methods.setPause(true).send({ from: bob }));
});

spec.test('successfully transfers when Xcert is not paused', async (ctx) => {
  const xcert = ctx.get('xcert');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const sara = ctx.get('sara');
  const id1 = ctx.get('id1');
  const digest1 = ctx.get('digest1');

  await xcert.instance.methods.create(bob, id1, digest1).send({ from: owner });
  const logs = await xcert.instance.methods.transferFrom(bob, sara, id1).send({ from: bob });
  ctx.not(logs.events.Transfer, undefined);

  const bobBalance = await xcert.instance.methods.balanceOf(bob).call();
  const saraBalance = await xcert.instance.methods.balanceOf(sara).call();
  const ownerOfId1 =  await xcert.instance.methods.ownerOf(id1).call();

  ctx.is(bobBalance, '0');
  ctx.is(saraBalance, '1');
  ctx.is(ownerOfId1, sara);
});

spec.test('successfully safe transfers when Xcert is not paused', async (ctx) => {
  const xcert = ctx.get('xcert');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const sara = ctx.get('sara');
  const id1 = ctx.get('id1');
  const digest1 = ctx.get('digest1');

  await xcert.instance.methods.create(bob, id1, digest1).send({ from: owner });
  const logs = await xcert.instance.methods.safeTransferFrom(bob, sara, id1).send({ from: bob });
  ctx.not(logs.events.Transfer, undefined);

  const bobBalance = await xcert.instance.methods.balanceOf(bob).call();
  const saraBalance = await xcert.instance.methods.balanceOf(sara).call();
  const ownerOfId1 =  await xcert.instance.methods.ownerOf(id1).call();

  ctx.is(bobBalance, '0');
  ctx.is(saraBalance, '1');
  ctx.is(ownerOfId1, sara);
});

spec.test('throws when trying to transfer an Xcert when contract is paused', async (ctx) => {
  const xcert = ctx.get('xcert');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const sara = ctx.get('sara');
  const id1 = ctx.get('id1');
  const digest1 = ctx.get('digest1');

  await xcert.instance.methods.setPause(true).send({ from: owner });
  await xcert.instance.methods.create(bob, id1, digest1).send({ from: owner });
  await ctx.reverts(() => xcert.instance.methods.transferFrom(bob, sara, id1).send({ from: bob }), '007002');
});

spec.test('throws when trying to safe transfer an Xcert when contract is paused', async (ctx) => {
  const xcert = ctx.get('xcert');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const sara = ctx.get('sara');
  const id1 = ctx.get('id1');
  const digest1 = ctx.get('digest1');

  await xcert.instance.methods.setPause(true).send({ from: owner });
  await xcert.instance.methods.create(bob, id1, digest1).send({ from: owner });
  await ctx.reverts(() => xcert.instance.methods.safeTransferFrom(bob, sara, id1).send({ from: bob }), '007002');
});

export default spec;
