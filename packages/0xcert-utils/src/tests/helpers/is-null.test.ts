import { Spec } from '@hayspec/spec';
import { isNull } from '../..';

const spec = new Spec();

spec.test('perform tests', (ctx) => {
  ctx.is(isNull(null), true);
  ctx.is(isNull(undefined), false);
  ctx.is(isNull(''), false);
});

export default spec;
