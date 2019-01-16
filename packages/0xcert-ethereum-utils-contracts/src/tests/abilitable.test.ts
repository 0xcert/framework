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

spec.test('check if sender address has ability 1', async (ctx) => {
  const abilitable = ctx.get('abilitable');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const ownerHasAbility0 = await abilitable.instance.methods.isAble(owner, 1).call();
  ctx.is(ownerHasAbility0, true);
  const bobHasAbility0 = await abilitable.instance.methods.isAble(bob, 1).call();
  ctx.is(bobHasAbility0, false);
});

spec.test('successfuly assigns an ability', async (ctx) => {
  const abilitable = ctx.get('abilitable');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');

  let bobHasAbility1 = await abilitable.instance.methods.isAble(bob, 1).call();
  ctx.is(bobHasAbility1, false);
  await ctx.reverts(() => abilitable.instance.methods.ability1().call({ from: bob }), '017001');

  const logs = await abilitable.instance.methods.assignAbilities(bob, 1).send({ from: owner });
  ctx.not(logs.events.AssignAbilities, undefined);

  bobHasAbility1 = await abilitable.instance.methods.isAble(bob, 1).call();
  ctx.is(bobHasAbility1, true);
  await abilitable.instance.methods.ability1().call({ from: bob });
});

spec.test('successfuly assigns ability 1', async (ctx) => {
  const abilitable = ctx.get('abilitable');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const jane = ctx.get('jane');

  let bobHasAbility1 = await abilitable.instance.methods.isAble(bob, 1).call();
  ctx.is(bobHasAbility1, false);
  await ctx.reverts(() => abilitable.instance.methods.assignAbilities(jane, 1).send({ from: bob }), '017001');

  const logs = await abilitable.instance.methods.assignAbilities(bob, 1).send({ from: owner });
  ctx.not(logs.events.AssignAbilities, undefined);

  bobHasAbility1 = await abilitable.instance.methods.isAble(bob, 1).call();
  ctx.is(bobHasAbility1, true);
});

spec.test('successfuly assigns multiple abilities', async (ctx) => {
  const abilitable = ctx.get('abilitable');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');

  /// We will check if bob has abilities 1,2,3 and 20. 
  /// Which are represented by numbers: 1,2,4 and 1048576. We check this with the sum: 1048583

  let bobHasAbilities = await abilitable.instance.methods.isAble(bob, 1048583).call();
  ctx.is(bobHasAbilities, false);
  await ctx.reverts(() => abilitable.instance.methods.ability1().call({ from: bob }), '017001');
  await ctx.reverts(() => abilitable.instance.methods.ability2().call({ from: bob }), '017001');

  const logs = await abilitable.instance.methods.assignAbilities(bob, 1048583).send({ from: owner });
  ctx.not(logs.events.AssignAbilities, undefined);

  bobHasAbilities = await abilitable.instance.methods.isAble(bob, 1048583).call();
  ctx.is(bobHasAbilities, true);
  await abilitable.instance.methods.ability1().call({ from: bob });
  await abilitable.instance.methods.ability2().call({ from: bob });
});

spec.test('successfuly revokes an ability', async (ctx) => {
  const abilitable = ctx.get('abilitable');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');

  await abilitable.instance.methods.assignAbilities(bob, 1).send({ from: owner });
  const logs = await abilitable.instance.methods.revokeAbilities(bob, 1).send({ from: owner });
  ctx.not(logs.events.RevokeAbilities, undefined);

  const bobHasAbility1 = await abilitable.instance.methods.isAble(bob, 1).call();
  ctx.is(bobHasAbility1, false);
  await ctx.reverts(() => abilitable.instance.methods.ability1().call({ from: bob }), '017001');
});

spec.test('successfuly revokes ability 1', async (ctx) => {
  const abilitable = ctx.get('abilitable');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const jane = ctx.get('jane');

  await abilitable.instance.methods.assignAbilities(bob, 1).send({ from: owner });
  const logs = await abilitable.instance.methods.revokeAbilities(bob, 1).send({ from: owner });
  ctx.not(logs.events.RevokeAbilities, undefined);

  let bobHasAbility1 = await abilitable.instance.methods.isAble(bob, 1).call();
  ctx.is(bobHasAbility1, false);
  await ctx.reverts(() => abilitable.instance.methods.assignAbilities(jane, 1).send({ from: bob }), '017001');
});

spec.test('successfuly revokes multiple abilities', async (ctx) => {
  const abilitable = ctx.get('abilitable');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');

  // Abilities 1,2,3,20
  await abilitable.instance.methods.assignAbilities(bob, 1048583).send({ from: owner });
  // Abilities 1,3,20
  const logs = await abilitable.instance.methods.revokeAbilities(bob, 1048581).send({ from: owner });
  ctx.not(logs.events.RevokeAbilities, undefined);

  const bobHasAbility2 = await abilitable.instance.methods.isAble(bob, 2).call();
  ctx.is(bobHasAbility2, true);
  const bobHasAbility1_3_20 = await abilitable.instance.methods.isAble(bob, 1048581).call();
  ctx.is(bobHasAbility1_3_20, false);
  await abilitable.instance.methods.ability2().call({ from: bob });
  await ctx.reverts(() => abilitable.instance.methods.ability1().call({ from: bob }), '017001');
});

spec.test('throws when trying to revoke ability a when only one account has ability a', async (ctx) => {
  const abilitable = ctx.get('abilitable');
  const owner = ctx.get('owner');

  await ctx.reverts(() => abilitable.instance.methods.revokeAbilities(owner, 1).send({ from: owner }), '017002');
});

spec.test('throws when trying to check ability 0', async (ctx) => {
  const abilitable = ctx.get('abilitable');
  const owner = ctx.get('owner');

  await ctx.reverts(() => abilitable.instance.methods.isAble(owner, 0).call(), '017003');
});