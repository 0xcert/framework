import { Spec } from '@hayspec/spec';
import { isArray } from '../..';

const spec = new Spec();

spec.test('perform tests', (ctx) => {
  ctx.is(isArray([]), true);
  ctx.is(isArray([1]), true);
  ctx.is(isArray({}), false);
  ctx.is(isArray(Infinity), false);
  ctx.is(isArray(NaN), false);
  ctx.is(isArray(null), false);
  ctx.is(isArray(undefined), false);
  ctx.is(isArray(0), false);
  ctx.is(isArray(''), false);
});

export default spec;
