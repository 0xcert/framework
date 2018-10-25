import { Spec } from '@hayspec/spec';
import { isInfinite } from '../..';

const spec = new Spec();

spec.test('perform tests', (ctx) => {
  ctx.is(isInfinite(Infinity), true);
  ctx.is(isInfinite(0), false);
  ctx.is(isInfinite(''), false);
});

export default spec;
