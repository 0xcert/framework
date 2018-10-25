import { Spec } from '@hayspec/spec';
import { isString } from '../..';

const spec = new Spec();

spec.test('perform tests', (ctx) => {
  ctx.is(isString(''), true);
  ctx.is(isString('foo'), true);
  ctx.is(isString(null), false);
});

export default spec;
