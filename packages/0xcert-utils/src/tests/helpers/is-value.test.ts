import { Spec } from '@hayspec/spec';
import { isValue } from '../..';

const spec = new Spec();

spec.test('perform tests', (ctx) => {
  ctx.is(isValue(undefined), false);
  ctx.is(isValue(null), false);
  ctx.is(isValue(NaN), false);
  ctx.is(isValue(Infinity), false);
  ctx.is(isValue(0), true);
  ctx.is(isValue(''), true);
  ctx.is(isValue(new Date()), true);
  ctx.is(isValue([]), true);
  ctx.is(isValue({}), true);
});

export default spec;
