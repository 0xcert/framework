import { Spec } from '@hayspec/spec';
import { isBoolean } from '../..';

const spec = new Spec();

spec.test('perform tests', (ctx) => {
  ctx.is(isBoolean(true), true);
  ctx.is(isBoolean(false), true);
  ctx.is(isBoolean('true'), false);
});

export default spec;
