import { Spec } from '@specron/spec';

/**
 * Spec context interfaces.
 */

interface Data {
  abilitable?: any;
  owner?: string;
  bob?: string;
  jane?: string;
  sara?: string;
}

/**
 * Spec stack instances.
 */

const spec = new Spec<Data>();

export default spec;

spec.beforeEach(async (ctx) => {
  const accounts = await ctx.web3.eth.getAccounts();
  ctx.set('owner', accounts[0]);
  ctx.set('bob', accounts[1]);
  ctx.set('jane', accounts[2]);
  ctx.set('sara', accounts[3]);
});

spec.beforeEach(async (ctx) => {
  const abilitable = await ctx.deploy({ 
    src: './build/abilitable-test-mock.json',
    contract: 'AbilitableTestMock',
  });
  ctx.set('abilitable', abilitable);
});

spec.test('check if sender address has zero ability', async (ctx) => {
  const abilitable = ctx.get('abilitable');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const ownerHasAbility0 = await abilitable.methods.isAble(owner, 0).call();
  ctx.is(ownerHasAbility0, true);
  const bobHasAbility0 = await abilitable.methods.isAble(bob, 0).call();
  ctx.is(bobHasAbility0, false);
});

spec.test('successfuly assigns an ability', async (ctx) => {
  const abilitable = ctx.get('abilitable');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');

  let bobHasAbility1 = await abilitable.methods.isAble(bob, 1).call();
  ctx.is(bobHasAbility1, false);
  await ctx.reverts(() => abilitable.methods.ability1().call({ from: bob }), '017001');

  const logs = await abilitable.methods.assignAbilities(bob, [1]).send({ from: owner });
  ctx.not(logs.events.AssignAbility, undefined);

  bobHasAbility1 = await abilitable.methods.isAble(bob, 1).call();
  ctx.is(bobHasAbility1, true);
  await abilitable.methods.ability1().call({ from: bob });
});

spec.test('successfuly assigns zero ability', async (ctx) => {
  const abilitable = ctx.get('abilitable');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const jane = ctx.get('jane');

  let bobHasAbility0 = await abilitable.methods.isAble(bob, 0).call();
  ctx.is(bobHasAbility0, false);
  await ctx.reverts(() => abilitable.methods.assignAbilities(jane, [0]).send({ from: bob }), '017001');

  const logs = await abilitable.methods.assignAbilities(bob, [0]).send({ from: owner });
  ctx.not(logs.events.AssignAbility, undefined);

  bobHasAbility0 = await abilitable.methods.isAble(bob, 0).call();
  ctx.is(bobHasAbility0, true);
});

spec.test('successfuly assigns multiple abilities', async (ctx) => {
  const abilitable = ctx.get('abilitable');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');

  let bobHasAbility0 = await abilitable.methods.isAble(bob, 0).call();
  ctx.is(bobHasAbility0, false);
  let bobHasAbility1 = await abilitable.methods.isAble(bob, 1).call();
  ctx.is(bobHasAbility1, false);
  let bobHasAbility2 = await abilitable.methods.isAble(bob, 2).call();
  ctx.is(bobHasAbility2, false);
  let bobHasAbility60 = await abilitable.methods.isAble(bob, 60).call();
  ctx.is(bobHasAbility60, false);
  await ctx.reverts(() => abilitable.methods.ability1().call({ from: bob }), '017001');
  await ctx.reverts(() => abilitable.methods.ability2().call({ from: bob }), '017001');

  const logs = await abilitable.methods.assignAbilities(bob, [0,1,2,60]).send({ from: owner });
  ctx.is(logs.events.AssignAbility.length, 4);

  bobHasAbility0 = await abilitable.methods.isAble(bob, 0).call();
  ctx.is(bobHasAbility0, true);
  bobHasAbility1 = await abilitable.methods.isAble(bob, 1).call();
  ctx.is(bobHasAbility1, true);
  bobHasAbility2 = await abilitable.methods.isAble(bob, 2).call();
  ctx.is(bobHasAbility2, true);
  bobHasAbility60 = await abilitable.methods.isAble(bob, 60).call();
  ctx.is(bobHasAbility60, true);
  await abilitable.methods.ability1().call({ from: bob });
  await abilitable.methods.ability2().call({ from: bob });
});

spec.test('successfuly revokes an ability', async (ctx) => {
  const abilitable = ctx.get('abilitable');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');

  await abilitable.methods.assignAbilities(bob, [1]).send({ from: owner });
  const logs = await abilitable.methods.revokeAbilities(bob, [1]).send({ from: owner });
  ctx.not(logs.events.RevokeAbility, undefined);

  const bobHasAbility1 = await abilitable.methods.isAble(bob, 1).call();
  ctx.is(bobHasAbility1, false);
  await ctx.reverts(() => abilitable.methods.ability1().call({ from: bob }), '017001');
});

spec.test('successfuly revokes zero ability', async (ctx) => {
  const abilitable = ctx.get('abilitable');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const jane = ctx.get('jane');

  await abilitable.methods.assignAbilities(bob, [0]).send({ from: owner });
  const logs = await abilitable.methods.revokeAbilities(bob, [0]).send({ from: owner });
  ctx.not(logs.events.RevokeAbility, undefined);

  let bobHasAbility0 = await abilitable.methods.isAble(bob, 0).call();
  ctx.is(bobHasAbility0, false);
  await ctx.reverts(() => abilitable.methods.assignAbilities(jane, [0]).send({ from: bob }), '017001');
});

spec.test('successfuly revokes multiple abilities', async (ctx) => {
  const abilitable = ctx.get('abilitable');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');

  await abilitable.methods.assignAbilities(bob, [0,1,2,60]).send({ from: owner });
  const logs = await abilitable.methods.revokeAbilities(bob, [0,2,60]).send({ from: owner });
  ctx.is(logs.events.RevokeAbility.length, 3);

  const bobHasAbility0 = await abilitable.methods.isAble(bob, 0).call();
  ctx.is(bobHasAbility0, false);
  const bobHasAbility1 = await abilitable.methods.isAble(bob, 1).call();
  ctx.is(bobHasAbility1, true);
  const bobHasAbility2 = await abilitable.methods.isAble(bob, 2).call();
  ctx.is(bobHasAbility2, false);
  const bobHasAbility60 = await abilitable.methods.isAble(bob, 60).call();
  ctx.is(bobHasAbility60, false);
  await abilitable.methods.ability1().call({ from: bob });
  await ctx.reverts(() => abilitable.methods.ability2().call({ from: bob }), '017001');
});

spec.test('throws when trying to revoke zero ability when only one account has a zero ability', async (ctx) => {
  const abilitable = ctx.get('abilitable');
  const owner = ctx.get('owner');

  await ctx.reverts(() => abilitable.methods.revokeAbilities(owner, [0]).send({ from: owner }), '017002');
});

spec.test('throws when trying to assing ability array that overflows', async (ctx) => {
  const abilitable = ctx.get('abilitable');
  const owner = ctx.get('owner');
  const array = Array.from({ length: 256 }, (v, i) => i);
  await ctx.throws(() => abilitable.methods.assignAbilities(owner, array).send({ from: owner }));
});