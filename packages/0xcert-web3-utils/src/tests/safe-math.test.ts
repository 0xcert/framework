import { Spec } from '@specron/spec';

/**
 * Spec context interfaces.
 */

interface Data {
  safeMath?: any;
}

/**
 * Spec stack instances.
 */

const spec = new Spec<Data>();

export default spec;

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

spec.test('should throw an error if subtraction result would be negative', async (ctx) => {
  const safeMath = ctx.get('safeMath');
  const a = 1234;
  const b = 5678;
  await ctx.throws(() => safeMath.instance.methods.subtract(a, b).send());
});

spec.test('should throw an error on addition overflow', async (ctx) => {
  const safeMath = ctx.get('safeMath');
  const a = 115792089237316195423570985008687907853269984665640564039457584007913129639935;
  const b = 1;
  await ctx.throws(() => safeMath.instance.methods.add(a, b).send());
});

spec.test('should throw an error on multiplication overflow', async (ctx) => {
  const safeMath = ctx.get('safeMath');
  const a = 115792089237316195423570985008687907853269984665640564039457584007913129639933;
  const b = 2;
  await ctx.throws(() => safeMath.instance.methods.multiply(a, b).send());
});