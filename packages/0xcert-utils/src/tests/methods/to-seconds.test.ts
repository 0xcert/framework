import { Spec } from '@hayspec/spec';
import { toSeconds } from '../..';

const spec = new Spec();

spec.test('converts milliseconds to seconds', (ctx) => {
  ctx.is(toSeconds(9000), 9);
  ctx.is(toSeconds(9000.1982), 9);
  ctx.is(toSeconds(0.1982), 0);
  ctx.is(toSeconds('10000.124' as any), 10);
});

spec.test('handles non-numeric and other invalid values', (ctx) => {
  ctx.is(toSeconds('foo' as any), 0);
  ctx.is(toSeconds(null), 0);
  ctx.is(toSeconds(undefined), 0);
});

export default spec;
