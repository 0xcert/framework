import { Spec } from '@specron/spec';

interface Data {
  ownable?: any;
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
  const ownable = await ctx.deploy({
    src: './build/ownable.json',
    contract: 'Ownable',
  });
  ctx.set('ownable', ownable);
});

spec.test('has an owner', async (ctx) => {
  const ownable = ctx.get('ownable');
  const owner = ctx.get('owner');
  const contractOwner = await ownable.instance.methods.owner().call();
  ctx.is(owner, contractOwner);
});

spec.test('changes owner after transfer', async (ctx) => {
  const ownable = ctx.get('ownable');
  const bob = ctx.get('bob');
  await ownable.instance.methods.transferOwnership(bob).send();
  const contractOwner = await ownable.instance.methods.owner().call();
  ctx.is(bob, contractOwner);
});

spec.test('prevents non-owners from transferring', async (ctx) => {
  const ownable = ctx.get('ownable');
  const bob = ctx.get('bob');
  const jane = ctx.get('jane');

  const contractOwner = await ownable.instance.methods.owner().call();
  ctx.not(jane, contractOwner);

  await ctx.reverts(() => ownable.instance.methods.transferOwnership(bob).send({ from: jane }), '018001');
});

spec.test('guards ownership against stuck state', async (ctx) => {
  const ownable = ctx.get('ownable');
  const zeroAddress = ctx.get('zeroAddress');
  const originalOwner = await ownable.instance.methods.owner().call();

  await ctx.reverts(() => ownable.instance.methods.transferOwnership(zeroAddress).send({ from: originalOwner }), '018002');
});

export default spec;
