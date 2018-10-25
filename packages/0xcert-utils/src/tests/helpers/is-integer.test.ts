import { Spec } from '@hayspec/spec';
import { isInteger } from '../..';

const spec = new Spec();

spec.test('perform tests', (ctx) => {
  ctx.is(isInteger(0), true);
  ctx.is(isInteger(10), true);
  ctx.is(isInteger(-10), true);
  ctx.is(isInteger(10.1), false);
  ctx.is(isInteger(Infinity), false);
  ctx.is(isInteger(NaN), false);
  ctx.is(isInteger(null), false);
  ctx.is(isInteger(undefined), false);
});

export default spec;
