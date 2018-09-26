import { Spec } from '@specron/spec';

/**
 * Spec context interfaces.
 */

interface Data {
  xcert?: any;
  owner?: string;
  bob?: string;
  sara?: string;
  id1?: string;
  url1?: string;
  proof1?: string;
}

const spec = new Spec<Data>();

export default spec;

spec.beforeEach(async (ctx) => {
  const accounts = await ctx.web3.eth.getAccounts();
  ctx.set('owner', accounts[0]);
  ctx.set('bob', accounts[1]);
  ctx.set('sara', accounts[2]);
});

spec.beforeEach(async (ctx) => {
  ctx.set('id1', '123');
  ctx.set('url1', 'http://0xcert.org/1');
  ctx.set('proof1', '973124FFC4A03E66D6A4458E587D5D6146F71FC57F359C8D516E0B12A50AB0D9');
});

spec.beforeEach(async (ctx) => {
  const xcert = await ctx.deploy({ 
    src: './build/pausable-xcert-mock.json',
    contract: 'PausableXcertMock',
    args: ['Foo','F','0x9c22ff5f21f0b81b113e63f7db6da94fedef11b2119b4088b89664fb9a3cb658']
  });
  ctx.set('xcert', xcert);
});

spec.test('successfuly changes paused state', async (ctx) => {
  const xcert = ctx.get('xcert');
  const owner = ctx.get('owner');

  let pauseState = await xcert.methods.isPaused().call();
  ctx.is(pauseState, false);

  const logs = await xcert.methods.setPause(true).send({ from: owner });
  ctx.not(logs.events.IsPaused, undefined);
    
  pauseState = await xcert.methods.isPaused().call();
  ctx.is(pauseState, true);

  await xcert.methods.setPause(false).send({ from: owner });
    
  pauseState = await xcert.methods.isPaused().call();
  ctx.is(pauseState, false);
});

spec.test('reverts when a third party tries to change pause state', async (ctx) => {
  const xcert = ctx.get('xcert');
  const bob = ctx.get('bob');

  await ctx.reverts(() => xcert.methods.setPause(true).send({ from: bob }));
});

spec.test('successfully transfers when Xcert is not paused', async (ctx) => {
  const xcert = ctx.get('xcert');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const sara = ctx.get('sara');
  const id1 = ctx.get('id1');
  const url1 = ctx.get('url1');
  const proof1 = ctx.get('proof1');

  await xcert.methods.mint(bob, id1, url1, proof1).send({ from: owner });
  const logs = await xcert.methods.transferFrom(bob, sara, id1).send({ from: bob });
  ctx.not(logs.events.Transfer, undefined);

  const bobBalance = await xcert.methods.balanceOf(bob).call();
  const saraBalance = await xcert.methods.balanceOf(sara).call();
  const ownerOfId1 =  await xcert.methods.ownerOf(id1).call();

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
  const url1 = ctx.get('url1');
  const proof1 = ctx.get('proof1');

  await xcert.methods.mint(bob, id1, url1, proof1).send({ from: owner });
  const logs = await xcert.methods.safeTransferFrom(bob, sara, id1).send({ from: bob });
  ctx.not(logs.events.Transfer, undefined);

  const bobBalance = await xcert.methods.balanceOf(bob).call();
  const saraBalance = await xcert.methods.balanceOf(sara).call();
  const ownerOfId1 =  await xcert.methods.ownerOf(id1).call();

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
  const url1 = ctx.get('url1');
  const proof1 = ctx.get('proof1');

  await xcert.methods.setPause(true).send({ from: owner });
  await xcert.methods.mint(bob, id1, url1, proof1).send({ from: owner });
  await ctx.reverts(() => xcert.methods.transferFrom(bob, sara, id1).send({ from: bob }));
});

spec.test('throws when trying to safe transfer an Xcert when contract is paused', async (ctx) => {
  const xcert = ctx.get('xcert');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const sara = ctx.get('sara');
  const id1 = ctx.get('id1');
  const url1 = ctx.get('url1');
  const proof1 = ctx.get('proof1');

  await xcert.methods.setPause(true).send({ from: owner });
  await xcert.methods.mint(bob, id1, url1, proof1).send({ from: owner });
  await ctx.reverts(() => xcert.methods.safeTransferFrom(bob, sara, id1).send({ from: bob }));
});
