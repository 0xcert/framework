import { Spec } from '@specron/spec';
import { toInteger } from '../..';

const spec = new Spec();

spec.test('converts floats to integers', (ctx) => {
  ctx.is(toInteger(9000), 9000);
  ctx.is(toInteger(9000.1982), 9000);
  ctx.is(toInteger(0.1982), 0);
  ctx.is(toInteger('10000.124' as any), 10000);
});

spec.test('handles non-numeric and other invalid values', (ctx) => {
  ctx.is(toInteger('foo' as any), 0);
  ctx.is(toInteger(null), 0);
  ctx.is(toInteger(undefined), 0);
});

export default spec;
