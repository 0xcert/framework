import { Spec } from '@specron/spec';

interface Data {
  abilitable?: any;
  owner?: string;
  bob?: string;
  jane?: string;
  sara?: string;
  superAbility?: number;
  allowSuperAbility?: number;
  emptySlot1?: number;
  emptySlot2?: number;
  defaultAbilities?: number;
  abilityB?: number;
  abilityC?: number;
  abilityT?: number;
  superAbilityCT?: number;
  superAbilityBCT?: number;
}

const spec = new Spec<Data>();

spec.before(async (ctx) => {
  const superAbility = 1; // a.k.a. abilityA
  const allowSuperAbility = 2;
  const emptySlot1 = 4;
  const emptySlot2 = 8;
  const abilityB = 16;
  const abilityC = 32;
  const abilityT = 1048576;
  const defaultAbilities = superAbility + allowSuperAbility + emptySlot1 + emptySlot2;
  const superAbilityCT = superAbility + abilityC + abilityT;
  const superAbilityBCT = superAbility + abilityB + abilityC + abilityT;

  ctx.set('superAbility', superAbility);
  ctx.set('allowSuperAbility', allowSuperAbility);
  ctx.set('emptySlot1', emptySlot1);
  ctx.set('emptySlot2', emptySlot2);
  ctx.set('defaultAbilities', defaultAbilities);
  ctx.set('abilityB', abilityB);
  ctx.set('abilityC', abilityC);
  ctx.set('abilityT', abilityT);
  ctx.set('superAbilityCT', superAbilityCT);
  ctx.set('superAbilityBCT', superAbilityBCT);
});

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

spec.test('check if sender address has all the default abilitites', async (ctx) => {
  const abilitable = ctx.get('abilitable');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const defaultAbilities = ctx.get('defaultAbilities');
  const superAbility = ctx.get('superAbility');
  const ownerHasDefaultAbilitites = await abilitable.instance.methods.isAble(owner, defaultAbilities).call();
  ctx.is(ownerHasDefaultAbilitites, true);
  const bobHasSuperAbility = await abilitable.instance.methods.isAble(bob, superAbility).call();
  ctx.is(bobHasSuperAbility, false);
});

spec.test('successfuly grants an ability', async (ctx) => {
  const abilitable = ctx.get('abilitable');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const superAbility = ctx.get('superAbility');

  let bobHasAbilityA = await abilitable.instance.methods.isAble(bob, superAbility).call();
  ctx.is(bobHasAbilityA, false);
  await ctx.reverts(() => abilitable.instance.methods.abilityA().call({ from: bob }), '017001');

  const logs = await abilitable.instance.methods.grantAbilities(bob, superAbility).send({ from: owner });
  ctx.not(logs.events.SetAbilities, undefined);

  bobHasAbilityA = await abilitable.instance.methods.isAble(bob, superAbility).call();
  ctx.is(bobHasAbilityA, true);
  await abilitable.instance.methods.abilityA().call({ from: bob });
});

spec.test('successfuly grants ability to manage abilities', async (ctx) => {
  const abilitable = ctx.get('abilitable');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const jane = ctx.get('jane');
  const superAbility = ctx.get('superAbility');

  let bobHasAbilityA = await abilitable.instance.methods.isAble(bob, superAbility).call();
  ctx.is(bobHasAbilityA, false);
  await ctx.reverts(() => abilitable.instance.methods.grantAbilities(jane, superAbility).send({ from: bob }), '017001');

  const logs = await abilitable.instance.methods.grantAbilities(bob, superAbility).send({ from: owner });
  ctx.not(logs.events.SetAbilities, undefined);

  bobHasAbilityA = await abilitable.instance.methods.isAble(bob, superAbility).call();
  ctx.is(bobHasAbilityA, true);
});

spec.test('successfuly grants multiple abilities', async (ctx) => {
  const abilitable = ctx.get('abilitable');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const superAbilityBCT = ctx.get('superAbilityBCT');

  // We will check if bob has abilities A,B,C and T.
  // Which are represented by numbers: 1,16,32 and 1048576. We check this with the sum: 1048625

  let bobHasAbilities = await abilitable.instance.methods.isAble(bob, superAbilityBCT).call();
  ctx.is(bobHasAbilities, false);
  await ctx.reverts(() => abilitable.instance.methods.abilityA().call({ from: bob }), '017001');
  await ctx.reverts(() => abilitable.instance.methods.abilityB().call({ from: bob }), '017001');

  const logs = await abilitable.instance.methods.grantAbilities(bob, superAbilityBCT).send({ from: owner });
  ctx.not(logs.events.SetAbilities, undefined);

  bobHasAbilities = await abilitable.instance.methods.isAble(bob, superAbilityBCT).call();
  ctx.is(bobHasAbilities, true);
  await abilitable.instance.methods.abilityA().call({ from: bob });
  await abilitable.instance.methods.abilityB().call({ from: bob });
});

spec.test('successfuly revokes an ability', async (ctx) => {
  const abilitable = ctx.get('abilitable');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const superAbility = ctx.get('superAbility');

  await abilitable.instance.methods.grantAbilities(bob, superAbility).send({ from: owner });
  const logs = await abilitable.instance.methods.revokeAbilities(bob, superAbility).send({ from: owner });
  ctx.not(logs.events.SetAbilities, undefined);

  const bobHasAbilityA = await abilitable.instance.methods.isAble(bob, superAbility).call();
  ctx.is(bobHasAbilityA, false);
  await ctx.reverts(() => abilitable.instance.methods.abilityA().call({ from: bob }), '017001');
});

spec.test('successfuly revokes multiple abilities', async (ctx) => {
  const abilitable = ctx.get('abilitable');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const superAbilityBCT = ctx.get('superAbilityBCT');
  const superAbilityCT = ctx.get('superAbilityCT');
  const abilityB = ctx.get('abilityB');

  // Abilities A,B,C,T
  await abilitable.instance.methods.grantAbilities(bob, superAbilityBCT).send({ from: owner });
  // Abilities A,C,T
  const logs = await abilitable.instance.methods.revokeAbilities(bob, superAbilityCT).send({ from: owner });
  ctx.not(logs.events.SetAbilities, undefined);

  const bobHasAbilityB = await abilitable.instance.methods.isAble(bob, abilityB).call();
  ctx.is(bobHasAbilityB, true);
  const bobHasAbilityACT = await abilitable.instance.methods.isAble(bob, superAbilityCT).call();
  ctx.is(bobHasAbilityACT, false);
  await abilitable.instance.methods.abilityB().call({ from: bob });
  await ctx.reverts(() => abilitable.instance.methods.abilityA().call({ from: bob }), '017001');
});

spec.test('successfuly revokes own super ability', async (ctx) => {
  const abilitable = ctx.get('abilitable');
  const owner = ctx.get('owner');
  const superAbility = ctx.get('superAbility');

  await abilitable.instance.methods.revokeAbilities(owner, superAbility).send({ from: owner });
  ctx.false(await abilitable.instance.methods.isAble(owner, superAbility).call());
});

spec.test('successfuly sets abilities', async (ctx) => {
  const abilitable = ctx.get('abilitable');
  const owner = ctx.get('owner');
  const emptySlot1 = ctx.get('emptySlot1');
  const superAbilityCT = ctx.get('superAbilityCT');
  const superAbility = ctx.get('superAbility');
  const abilityC = ctx.get('abilityC');
  const abilityT = ctx.get('abilityT');

  ctx.true(await abilitable.instance.methods.isAble(owner, emptySlot1).call());
  await abilitable.instance.methods.setAbilities(owner, superAbilityCT).send({ from: owner });
  ctx.false(await abilitable.instance.methods.isAble(owner, emptySlot1).call());
  ctx.true(await abilitable.instance.methods.isAble(owner, superAbility).call());
  ctx.true(await abilitable.instance.methods.isAble(owner, abilityC).call());
  ctx.true(await abilitable.instance.methods.isAble(owner, abilityT).call());
});

spec.test('throws when trying to check ability 0', async (ctx) => {
  const abilitable = ctx.get('abilitable');
  const owner = ctx.get('owner');

  await ctx.reverts(() => abilitable.instance.methods.isAble(owner, 0).call(), '017002');
});

spec.test('throws when trying to use modifier for ability 0', async (ctx) => {
  const abilitable = ctx.get('abilitable');

  const x = await abilitable.instance.methods.abilityX(1).call();
  ctx.is(x, 'X');
  await ctx.reverts(() => abilitable.instance.methods.abilityX(0).call(), '017002');
});

export default spec;
