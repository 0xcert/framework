import { Spec } from '@hayspec/spec';
import { toString } from '../..';

const spec = new Spec();

spec.test('converts value to string', (ctx) => {
  ctx.is(toString(undefined), null);
  ctx.is(toString(null), null);
  ctx.is(toString(''), '');
  ctx.is(toString(NaN), 'NaN');
  ctx.is(toString(Infinity), 'Infinity');
  ctx.is(toString(true), 'true');
  ctx.is(toString(100.1), '100.1');
  ctx.is(toString([1, 2]), '1,2');
});

export default spec;
