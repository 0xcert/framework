import { Spec } from '@hayspec/spec';
import { isPresent } from '../..';

const spec = new Spec();

spec.test('perform tests', (ctx) => {
  ctx.is(isPresent(0), true);
  ctx.is(isPresent(Infinity), true);
  ctx.is(isPresent([1]), true);
  ctx.is(isPresent(undefined), false);
  ctx.is(isPresent(null), false);
  ctx.is(isPresent(NaN), false);
  ctx.is(isPresent([]), false);
  ctx.is(isPresent({}), false);
  ctx.is(isPresent(''), false);
});

export default spec;
