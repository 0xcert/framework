import { Spec } from '@hayspec/spec';
import { toString } from '../../../utils/data';

const spec = new Spec();

spec.test('converts a value to string', async (ctx) => {
  ctx.is(toString(true), 'true');
  ctx.is(toString(false), 'false');
  ctx.is(toString(undefined), '');
  ctx.is(toString(null), '');
  ctx.is(toString(1), '1');
  ctx.is(toString(-1), '-1');
  ctx.is(toString(1.234), '1.234');
  ctx.is(toString(9999999999999999999999999), '1e+25');
  ctx.is(toString(1e+25), '1e+25');
});

export default spec;
