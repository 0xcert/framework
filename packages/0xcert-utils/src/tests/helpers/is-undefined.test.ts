import { Spec } from '@hayspec/spec';
import { isUndefined } from '../..';

const spec = new Spec();

spec.test('perform tests', (ctx) => {
  ctx.is(isUndefined(), true);
  ctx.is(isUndefined(undefined), true);
  ctx.is(isUndefined(''), false);
});

export default spec;
