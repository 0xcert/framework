import { Spec } from '@specron/spec';

interface Data {
  claimable?: any;
  owner?: string;
  bob?: string;
  jane?: string;
  zeroAddress?: string;
}

const spec = new Spec<Data>();

spec.beforeEach(async (ctx) => {
  const accounts = await ctx.web3.eth.getAccounts();
  ctx.set('owner', accounts[0]);
  ctx.set('bob', accounts[1]);
  ctx.set('jane', accounts[2]);
  ctx.set('zeroAddress', '0x0000000000000000000000000000000000000000');
});

spec.beforeEach(async (ctx) => {
  const claimable = await ctx.deploy({
    src: './build/claimable.json',
    contract: 'Claimable',
  });
  ctx.set('claimable', claimable);
});

spec.test('has a pending owner after transferOwnership', async (ctx) => {
  const claimable = ctx.get('claimable');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  await claimable.instance.methods.transferOwnership(bob).send();
  const pendingOwner = await claimable.instance.methods.pendingOwner().call();
  ctx.is(pendingOwner, bob);
  const contractOwner = await claimable.instance.methods.owner().call();
  ctx.is(contractOwner, owner);
});

spec.test('resets a pending owner', async (ctx) => {
  const claimable = ctx.get('claimable');
  const bob = ctx.get('bob');
  const jane = ctx.get('jane');

  await claimable.instance.methods.transferOwnership(bob).send();
  let pendingOwner = await claimable.instance.methods.pendingOwner().call();
  ctx.is(pendingOwner, bob);

  await claimable.instance.methods.transferOwnership(jane).send();
  pendingOwner = await claimable.instance.methods.pendingOwner().call();
  ctx.is(pendingOwner, jane);
});

spec.test('prevents non-owners from transferring', async (ctx) => {
  const claimable = ctx.get('claimable');
  const bob = ctx.get('bob');
  const jane = ctx.get('jane');

  const contractOwner = await claimable.instance.methods.owner().call();
  ctx.not(contractOwner, bob);

  await ctx.reverts(() => claimable.instance.methods.transferOwnership(jane).send({ from: bob }), '018001');
});

spec.test('prevents non-owners from transferring', async (ctx) => {
  const claimable = ctx.get('claimable');
  const bob = ctx.get('bob');
  const jane = ctx.get('jane');

  const contractOwner = await claimable.instance.methods.owner().call();
  ctx.not(contractOwner, bob);

  await ctx.reverts(() => claimable.instance.methods.transferOwnership(jane).send({ from: bob }), '018001');
});

spec.test('claims pending ownership and re-sets pending ownership to 0', async (ctx) => {
  const claimable = ctx.get('claimable');
  const zeroAddress = ctx.get('zeroAddress');
  const bob = ctx.get('bob');

  await claimable.instance.methods.transferOwnership(bob).send();
  const logs = await claimable.instance.methods.claimOwnership().send({ from: bob });
  ctx.not(logs.events.OwnershipTransferred, undefined);

  const pendingOwner = await claimable.instance.methods.pendingOwner().call();
  ctx.is(pendingOwner, zeroAddress);
  const contractOwner = await claimable.instance.methods.owner().call();
  ctx.is(contractOwner, bob);
});

spec.test('prevents non-approved accounts from claimng', async (ctx) => {
  const claimable = ctx.get('claimable');
  const bob = ctx.get('bob');
  const jane = ctx.get('jane');

  await claimable.instance.methods.transferOwnership(bob).send();
  await ctx.reverts(() => claimable.instance.methods.claimOwnership().send({ from: jane }), '019001');
});

export default spec;
