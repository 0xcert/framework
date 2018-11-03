import { Spec } from '@hayspec/spec';
import { toFloat } from '../..';

const spec = new Spec();

spec.test('perform tests', (ctx) => {
  ctx.is(toFloat(), null);
  ctx.is(toFloat(undefined), null);
  ctx.is(toFloat(null), null);
  ctx.is(toFloat(false), 0);
  ctx.is(toFloat(NaN), 0);
  ctx.is(toFloat(0), 0);
  ctx.is(toFloat(-100), -100);
  ctx.is(toFloat('-100'), -100);
  ctx.is(toFloat('-100.0'), -100);
  ctx.is(toFloat('-100.99'), -100.99);
  ctx.is(toFloat('false'), 0);
  ctx.is(toFloat(Infinity), 1);
  ctx.is(toFloat('true'), 1);
  ctx.is(toFloat('yes'), 1);
});

export default spec;
