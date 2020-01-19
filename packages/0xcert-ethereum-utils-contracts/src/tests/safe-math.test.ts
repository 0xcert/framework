import { Spec } from '@specron/spec';

interface Data {
  safeMath?: any;
}

const spec = new Spec<Data>();

spec.beforeEach(async (ctx) => {
  const safeMath = await ctx.deploy({
    src: './build/safe-math-test-mock.json',
    contract: 'SafeMathTestMock',
  });
  ctx.set('safeMath', safeMath);
});

spec.test('multiplies correctly', async (ctx) => {
  const safeMath = ctx.get('safeMath');
  const a = 5678;
  const b = 1234;
  await safeMath.instance.methods.multiply(a, b).send();
  const result = await safeMath.instance.methods.result().call();
  ctx.is(result, (a * b).toString());
});

spec.test('adds correctly', async (ctx) => {
  const safeMath = ctx.get('safeMath');
  const a = 5678;
  const b = 1234;
  await safeMath.instance.methods.add(a, b).send();
  const result = await safeMath.instance.methods.result().call();
  ctx.is(result, (a + b).toString());
});

spec.test('subtracts correctly', async (ctx) => {
  const safeMath = ctx.get('safeMath');
  const a = 5678;
  const b = 1234;
  await safeMath.instance.methods.subtract(a, b).send();
  const result = await safeMath.instance.methods.result().call();
  ctx.is(result, (a - b).toString());
});

spec.test('reverts if subtraction result is negative', async (ctx) => {
  const safeMath = ctx.get('safeMath');
  const a = 1234;
  const b = 5678;
  await ctx.reverts(() => safeMath.instance.methods.subtract(a, b).send(), '008002');
});

spec.test('reverts on addition overflow', async (ctx) => {
  const safeMath = ctx.get('safeMath');
  const a = '115792089237316195423570985008687907853269984665640564039457584007913129639935';
  const b = 1;
  await ctx.reverts(() => safeMath.instance.methods.add(a, b).send(), '008001');
});

spec.test('reverts on multiplication overflow', async (ctx) => {
  const safeMath = ctx.get('safeMath');
  const a = '115792089237316195423570985008687907853269984665640564039457584007913129639933';
  const b = 2;
  await ctx.reverts(() => safeMath.instance.methods.multiply(a, b).send(), '008001');
});

spec.test('reverts on division by 0', async (ctx) => {
  const safeMath = ctx.get('safeMath');
  const a = 5;
  const b = 0;
  await ctx.reverts(() => safeMath.instance.methods.div(a, b).send(), '008003');
});

spec.test('reverts on modulo by 0', async (ctx) => {
  const safeMath = ctx.get('safeMath');
  const a = 5;
  const b = 0;
  await ctx.reverts(() => safeMath.instance.methods.mod(a, b).send(), '008003');
});

export default spec;
