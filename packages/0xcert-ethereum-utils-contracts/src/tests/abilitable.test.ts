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

/**
 * Constants for abilities for better readibility. 
 */
const ABILITY_TO_MANAGE_ABILITIES = 1;
const ABILITY_B = 2;
const ABILITY_C = 4;
const ABILITY_T = 1048576;
const ABILITY_TO_MANAGE_ABILITIES_C_T = ABILITY_TO_MANAGE_ABILITIES + ABILITY_C + ABILITY_T;
const ABILITY_TO_MANAGE_ABILITIES_B_C_T = ABILITY_TO_MANAGE_ABILITIES + ABILITY_B + ABILITY_C + ABILITY_T;

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

spec.test('check if sender address has ability to manage abilities', async (ctx) => {
  const abilitable = ctx.get('abilitable');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const ownerHasAbilityA = await abilitable.instance.methods.isAble(owner, ABILITY_TO_MANAGE_ABILITIES).call();
  ctx.is(ownerHasAbilityA, true);
  const bobHasAbilityA = await abilitable.instance.methods.isAble(bob, ABILITY_TO_MANAGE_ABILITIES).call();
  ctx.is(bobHasAbilityA, false);
});

spec.test('successfuly grants an ability', async (ctx) => {
  const abilitable = ctx.get('abilitable');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');

  let bobHasAbilityA = await abilitable.instance.methods.isAble(bob, ABILITY_TO_MANAGE_ABILITIES).call();
  ctx.is(bobHasAbilityA, false);
  await ctx.reverts(() => abilitable.instance.methods.abilityA().call({ from: bob }), '017001');

  const logs = await abilitable.instance.methods.grantAbilities(bob, ABILITY_TO_MANAGE_ABILITIES).send({ from: owner });
  ctx.not(logs.events.GrantAbilities, undefined);

  bobHasAbilityA = await abilitable.instance.methods.isAble(bob, ABILITY_TO_MANAGE_ABILITIES).call();
  ctx.is(bobHasAbilityA, true);
  await abilitable.instance.methods.abilityA().call({ from: bob });
});

spec.test('successfuly grants ability to manage abilities', async (ctx) => {
  const abilitable = ctx.get('abilitable');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const jane = ctx.get('jane');

  let bobHasAbilityA = await abilitable.instance.methods.isAble(bob, ABILITY_TO_MANAGE_ABILITIES).call();
  ctx.is(bobHasAbilityA, false);
  await ctx.reverts(() => abilitable.instance.methods.grantAbilities(jane, ABILITY_TO_MANAGE_ABILITIES).send({ from: bob }), '017001');

  const logs = await abilitable.instance.methods.grantAbilities(bob, ABILITY_TO_MANAGE_ABILITIES).send({ from: owner });
  ctx.not(logs.events.GrantAbilities, undefined);

  bobHasAbilityA = await abilitable.instance.methods.isAble(bob, ABILITY_TO_MANAGE_ABILITIES).call();
  ctx.is(bobHasAbilityA, true);
});

spec.test('successfuly grants multiple abilities', async (ctx) => {
  const abilitable = ctx.get('abilitable');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');

  /// We will check if bob has abilities A,B,C and T. 
  /// Which are represented by numbers: 1,2,4 and 1048576. We check this with the sum: 1048583

  let bobHasAbilities = await abilitable.instance.methods.isAble(bob, ABILITY_TO_MANAGE_ABILITIES_B_C_T).call();
  ctx.is(bobHasAbilities, false);
  await ctx.reverts(() => abilitable.instance.methods.abilityA().call({ from: bob }), '017001');
  await ctx.reverts(() => abilitable.instance.methods.abilityB().call({ from: bob }), '017001');

  const logs = await abilitable.instance.methods.grantAbilities(bob, ABILITY_TO_MANAGE_ABILITIES_B_C_T).send({ from: owner });
  ctx.not(logs.events.GrantAbilities, undefined);

  bobHasAbilities = await abilitable.instance.methods.isAble(bob, ABILITY_TO_MANAGE_ABILITIES_B_C_T).call();
  ctx.is(bobHasAbilities, true);
  await abilitable.instance.methods.abilityA().call({ from: bob });
  await abilitable.instance.methods.abilityB().call({ from: bob });
});

spec.test('successfuly revokes an ability', async (ctx) => {
  const abilitable = ctx.get('abilitable');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');

  await abilitable.instance.methods.grantAbilities(bob, ABILITY_TO_MANAGE_ABILITIES).send({ from: owner });
  const logs = await abilitable.instance.methods.revokeAbilities(bob, ABILITY_TO_MANAGE_ABILITIES).send({ from: owner });
  ctx.not(logs.events.RevokeAbilities, undefined);

  const bobHasAbilityA = await abilitable.instance.methods.isAble(bob, ABILITY_TO_MANAGE_ABILITIES).call();
  ctx.is(bobHasAbilityA, false);
  await ctx.reverts(() => abilitable.instance.methods.abilityA().call({ from: bob }), '017001');
});

spec.test('successfuly revokes ability to manage abilities', async (ctx) => {
  const abilitable = ctx.get('abilitable');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const jane = ctx.get('jane');

  await abilitable.instance.methods.grantAbilities(bob, 1).send({ from: owner });
  const logs = await abilitable.instance.methods.revokeAbilities(bob, 1).send({ from: owner });
  ctx.not(logs.events.RevokeAbilities, undefined);

  let bobHasAbilityA = await abilitable.instance.methods.isAble(bob, 1).call();
  ctx.is(bobHasAbilityA, false);
  await ctx.reverts(() => abilitable.instance.methods.grantAbilities(jane, 1).send({ from: bob }), '017001');
});

spec.test('successfuly revokes multiple abilities', async (ctx) => {
  const abilitable = ctx.get('abilitable');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');

  // Abilities A,B,C,T
  await abilitable.instance.methods.grantAbilities(bob, ABILITY_TO_MANAGE_ABILITIES_B_C_T).send({ from: owner });
  // Abilities A,C,T
  const logs = await abilitable.instance.methods.revokeAbilities(bob, ABILITY_TO_MANAGE_ABILITIES_C_T).send({ from: owner });
  ctx.not(logs.events.RevokeAbilities, undefined);

  const bobHasAbilityB = await abilitable.instance.methods.isAble(bob, ABILITY_B).call();
  ctx.is(bobHasAbilityB, true);
  const bobHasAbilityA_C_T = await abilitable.instance.methods.isAble(bob, ABILITY_TO_MANAGE_ABILITIES_C_T).call();
  ctx.is(bobHasAbilityA_C_T, false);
  await abilitable.instance.methods.abilityB().call({ from: bob });
  await ctx.reverts(() => abilitable.instance.methods.abilityA().call({ from: bob }), '017001');
});

spec.test('throws when trying to revoke ability a when only one account has ability to manage abilities', async (ctx) => {
  const abilitable = ctx.get('abilitable');
  const owner = ctx.get('owner');

  await ctx.reverts(() => abilitable.instance.methods.revokeAbilities(owner, ABILITY_TO_MANAGE_ABILITIES).send({ from: owner }), '017002');
});

spec.test('throws when trying to check ability 0', async (ctx) => {
  const abilitable = ctx.get('abilitable');
  const owner = ctx.get('owner');

  await ctx.reverts(() => abilitable.instance.methods.isAble(owner, 0).call(), '017003');
});