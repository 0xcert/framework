import { Spec } from '@hayspec/spec';
import { isObject } from '../..';

const spec = new Spec();

spec.test('perform tests', (ctx) => {
  ctx.is(isObject({}), true);
  ctx.is(isObject(Infinity), false);
  ctx.is(isObject(NaN), false);
  ctx.is(isObject(null), false);
  ctx.is(isObject(undefined), false);
  ctx.is(isObject(0), false);
  ctx.is(isObject(''), false);
  ctx.is(isObject(new Date()), false);
});

export default spec;
