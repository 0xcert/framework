import { Spec } from '@hayspec/spec';
import { isDate } from '../..';

const spec = new Spec();

spec.test('perform tests', (ctx) => {
  ctx.is(isDate(new Date()), true);
  ctx.is(isDate(new Date('ksjlfjsdfjsd')), false);
  ctx.is(isDate(null), false);
  ctx.is(isDate(undefined), false);
  ctx.is(isDate(NaN), false);
  ctx.is(isDate(Infinity), false);
  ctx.is(isDate(0), false);
  ctx.is(isDate(100), false);
  ctx.is(isDate(''), false);
});

export default spec;
