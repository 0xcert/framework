import { Spec } from '@hayspec/spec';
import * as view from '..';

const spec = new Spec();

spec.test('exposes objects', (ctx) => {
  ctx.true(!!view.Client);
  ctx.true(!!view.Vue0xcert);
});

export default spec;
