import { Spec } from '@hayspec/spec';
import { isNumber } from '../..';

const spec = new Spec();

spec.test('perform tests', (ctx) => {
  ctx.is(isNumber(0), true);
  ctx.is(isNumber(100.0), true);
  ctx.is(isNumber(-100.0), true);
  ctx.is(isNumber(NaN), true);
  ctx.is(isNumber(Infinity), true);
  ctx.is(isNumber(undefined), false);
  ctx.is(isNumber(null), false);
  ctx.is(isNumber(''), false);
  ctx.is(isNumber('100'), false);
});

export default spec;
