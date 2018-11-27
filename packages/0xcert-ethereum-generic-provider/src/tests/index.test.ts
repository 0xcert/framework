import { Spec } from '@specron/spec';
import * as view from '..';

const spec = new Spec();

spec.test('exposes objects', (ctx) => {
  ctx.true(!!view.GenericProvider);
  ctx.true(!!view.SignMethod);
});

export default spec;
