import { Spec } from '@hayspec/spec';
import { toFloat } from '../..';

const spec = new Spec();

spec.test('converts numbers to floats', (ctx) => {
  ctx.is(toFloat(9000), 9000);
  ctx.is(toFloat(9000.1982), 9000.1982);
  ctx.is(toFloat(0.1982), 0.1982);
  ctx.is(toFloat('10000.124' as any), 10000.124);
});

spec.test('handles non-numeric and other invalid values', (ctx) => {
  ctx.is(toFloat('foo' as any), 0);
  ctx.is(toFloat(null), 0);
  ctx.is(toFloat(undefined), 0);
});

export default spec;
