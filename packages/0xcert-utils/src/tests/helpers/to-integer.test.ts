import { Spec } from '@hayspec/spec';
import { toInteger } from '../..';

const spec = new Spec();

spec.test('perform tests', (ctx) => {
  ctx.is(toInteger(), null);
  ctx.is(toInteger(undefined), null);
  ctx.is(toInteger(null), null);
  ctx.is(toInteger(false), 0);
  ctx.is(toInteger(NaN), 0);
  ctx.is(toInteger(0), 0);
  ctx.is(toInteger(-100), -100);
  ctx.is(toInteger('-100'), -100);
  ctx.is(toInteger('-100.0'), -100);
  ctx.is(toInteger('false'), 0);
  ctx.is(toInteger(Infinity), 1);
  ctx.is(toInteger('true'), 1);
  ctx.is(toInteger('yes'), 1);
});

export default spec;
