import { Spec } from '@hayspec/spec';
import { isFunction } from '../..';

const spec = new Spec();

spec.test('perform tests', (ctx) => {
  ctx.is(isFunction(undefined), false);
  ctx.is(isFunction(null), false);
  ctx.is(isFunction(NaN), false);
  ctx.is(isFunction(() => {}), true);
  ctx.is(isFunction(function() {}), true);
  ctx.is(isFunction(class {}), true);
});

export default spec;
