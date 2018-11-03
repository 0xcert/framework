import { Spec } from '@hayspec/spec';
import { toBoolean } from '../..';

const spec = new Spec();

spec.test('perform tests', (ctx) => {
  ctx.is(toBoolean(), null);
  ctx.is(toBoolean(undefined), null);
  ctx.is(toBoolean(null), null);
  ctx.is(toBoolean(false), false);
  ctx.is(toBoolean(NaN), false);
  ctx.is(toBoolean(0), false);
  ctx.is(toBoolean(-100), false);
  ctx.is(toBoolean('-'), false);
  ctx.is(toBoolean('0'), false);
  ctx.is(toBoolean('-10'), false);
  ctx.is(toBoolean('false'), false);
  ctx.is(toBoolean(true), true);
  ctx.is(toBoolean(1), true);
  ctx.is(toBoolean(100), true);
  ctx.is(toBoolean(Infinity), true);
  ctx.is(toBoolean('+'), true);
  ctx.is(toBoolean('1'), true);
  ctx.is(toBoolean('100'), true);
  ctx.is(toBoolean('true'), true);
  ctx.is(toBoolean('yes'), true);
});

export default spec;
