import { Spec } from '@specron/spec';

interface Data {
  abilitable?: any;
  owner?: string;
  bob?: string;
  jane?: string;
  sara?: string;
  abilityManageAbilities?: number;
  abilityB?: number;
  abilityC?: number;
  abilityT?: number;
  abilityManageAbilitiesCT?: number;
  abilityManageAbilitiesBCT?: number;
}

const spec = new Spec<Data>();

spec.before(async (ctx) => {
  const abilityManageAbilities = 1;
  const abilityB = 2;
  const abilityC = 4;
  const abilityT = 1048576;
  const abilityManageAbilitiesCT = abilityManageAbilities + abilityC + abilityT;
  const abilityManageAbilitiesBCT = abilityManageAbilities + abilityB + abilityC + abilityT;

  ctx.set('abilityManageAbilities', abilityManageAbilities);
  ctx.set('abilityB', abilityB);
  ctx.set('abilityC', abilityC);
  ctx.set('abilityT', abilityT);
  ctx.set('abilityManageAbilitiesCT', abilityManageAbilitiesCT);
  ctx.set('abilityManageAbilitiesBCT', abilityManageAbilitiesBCT);
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

spec.test('check if sender address has ability to manage abilities', async (ctx) => {
  const abilitable = ctx.get('abilitable');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const abilityManageAbilities = ctx.get('abilityManageAbilities');
  const ownerHasAbilityA = await abilitable.instance.methods.isAble(owner, abilityManageAbilities).call();
  ctx.is(ownerHasAbilityA, true);
  const bobHasAbilityA = await abilitable.instance.methods.isAble(bob, abilityManageAbilities).call();
  ctx.is(bobHasAbilityA, false);
});

spec.test('successfuly grants an ability', async (ctx) => {
  const abilitable = ctx.get('abilitable');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const abilityManageAbilities = ctx.get('abilityManageAbilities');

  let bobHasAbilityA = await abilitable.instance.methods.isAble(bob, abilityManageAbilities).call();
  ctx.is(bobHasAbilityA, false);
  await ctx.reverts(() => abilitable.instance.methods.abilityA().call({ from: bob }), '017001');

  const logs = await abilitable.instance.methods.grantAbilities(bob, abilityManageAbilities).send({ from: owner });
  ctx.not(logs.events.GrantAbilities, undefined);

  bobHasAbilityA = await abilitable.instance.methods.isAble(bob, abilityManageAbilities).call();
  ctx.is(bobHasAbilityA, true);
  await abilitable.instance.methods.abilityA().call({ from: bob });
});

spec.test('successfuly grants ability to manage abilities', async (ctx) => {
  const abilitable = ctx.get('abilitable');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const jane = ctx.get('jane');
  const abilityManageAbilities = ctx.get('abilityManageAbilities');

  let bobHasAbilityA = await abilitable.instance.methods.isAble(bob, abilityManageAbilities).call();
  ctx.is(bobHasAbilityA, false);
  await ctx.reverts(() => abilitable.instance.methods.grantAbilities(jane, abilityManageAbilities).send({ from: bob }), '017001');

  const logs = await abilitable.instance.methods.grantAbilities(bob, abilityManageAbilities).send({ from: owner });
  ctx.not(logs.events.GrantAbilities, undefined);

  bobHasAbilityA = await abilitable.instance.methods.isAble(bob, abilityManageAbilities).call();
  ctx.is(bobHasAbilityA, true);
});

spec.test('successfuly grants multiple abilities', async (ctx) => {
  const abilitable = ctx.get('abilitable');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const abilityManageAbilitiesBCT = ctx.get('abilityManageAbilitiesBCT');

  // We will check if bob has abilities A,B,C and T.
  // Which are represented by numbers: 1,2,4 and 1048576. We check this with the sum: 1048583

  let bobHasAbilities = await abilitable.instance.methods.isAble(bob, abilityManageAbilitiesBCT).call();
  ctx.is(bobHasAbilities, false);
  await ctx.reverts(() => abilitable.instance.methods.abilityA().call({ from: bob }), '017001');
  await ctx.reverts(() => abilitable.instance.methods.abilityB().call({ from: bob }), '017001');

  const logs = await abilitable.instance.methods.grantAbilities(bob, abilityManageAbilitiesBCT).send({ from: owner });
  ctx.not(logs.events.GrantAbilities, undefined);

  bobHasAbilities = await abilitable.instance.methods.isAble(bob, abilityManageAbilitiesBCT).call();
  ctx.is(bobHasAbilities, true);
  await abilitable.instance.methods.abilityA().call({ from: bob });
  await abilitable.instance.methods.abilityB().call({ from: bob });
});

spec.test('successfuly revokes an ability', async (ctx) => {
  const abilitable = ctx.get('abilitable');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const abilityManageAbilities = ctx.get('abilityManageAbilities');

  await abilitable.instance.methods.grantAbilities(bob, abilityManageAbilities).send({ from: owner });
  const logs = await abilitable.instance.methods.revokeAbilities(bob, abilityManageAbilities).send({ from: owner });
  ctx.not(logs.events.RevokeAbilities, undefined);

  const bobHasAbilityA = await abilitable.instance.methods.isAble(bob, abilityManageAbilities).call();
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

  const bobHasAbilityA = await abilitable.instance.methods.isAble(bob, 1).call();
  ctx.is(bobHasAbilityA, false);
  await ctx.reverts(() => abilitable.instance.methods.grantAbilities(jane, 1).send({ from: bob }), '017001');
});

spec.test('successfuly revokes multiple abilities', async (ctx) => {
  const abilitable = ctx.get('abilitable');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const abilityManageAbilitiesBCT = ctx.get('abilityManageAbilitiesBCT');
  const abilityManageAbilitiesCT = ctx.get('abilityManageAbilitiesCT');
  const abilityB = ctx.get('abilityB');

  // Abilities A,B,C,T
  await abilitable.instance.methods.grantAbilities(bob, abilityManageAbilitiesBCT).send({ from: owner });
  // Abilities A,C,T
  const logs = await abilitable.instance.methods.revokeAbilities(bob, abilityManageAbilitiesCT).send({ from: owner });
  ctx.not(logs.events.RevokeAbilities, undefined);

  const bobHasAbilityB = await abilitable.instance.methods.isAble(bob, abilityB).call();
  ctx.is(bobHasAbilityB, true);
  const bobHasAbilityACT = await abilitable.instance.methods.isAble(bob, abilityManageAbilitiesCT).call();
  ctx.is(bobHasAbilityACT, false);
  await abilitable.instance.methods.abilityB().call({ from: bob });
  await ctx.reverts(() => abilitable.instance.methods.abilityA().call({ from: bob }), '017001');
});

spec.test('throws when trying to revoke ability a when only one account has ability to manage abilities', async (ctx) => {
  const abilitable = ctx.get('abilitable');
  const owner = ctx.get('owner');
  const abilityManageAbilities = ctx.get('abilityManageAbilities');

  await ctx.reverts(() => abilitable.instance.methods.revokeAbilities(owner, abilityManageAbilities).send({ from: owner }), '017002');
});

spec.test('throws when trying to check ability 0', async (ctx) => {
  const abilitable = ctx.get('abilitable');
  const owner = ctx.get('owner');

  await ctx.reverts(() => abilitable.instance.methods.isAble(owner, 0).call(), '017003');
});

spec.test('throws when trying to use modifier for ability 0', async (ctx) => {
  const abilitable = ctx.get('abilitable');

  const x = await abilitable.instance.methods.abilityX(1).call();
  ctx.is(x, 'X');
  await ctx.reverts(() => abilitable.instance.methods.abilityX(0).call(), '017003');
});

export default spec;
