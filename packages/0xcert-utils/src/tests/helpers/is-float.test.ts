import { Spec } from '@hayspec/spec';
import { isFloat } from '../..';

const spec = new Spec();

spec.test('perform tests', (ctx) => {
  ctx.is(isFloat(0), true);
  ctx.is(isFloat(-100), true);
  ctx.is(isFloat(100), true);
  ctx.is(isFloat(0.1), true);
  ctx.is(isFloat(-0.1), true);
  ctx.is(isFloat(Infinity), false);
  ctx.is(isFloat(NaN), false);
  ctx.is(isFloat(null), false);
  ctx.is(isFloat(undefined), false);
});

export default spec;
