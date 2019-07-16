import { Spec } from '@specron/spec';
import * as exchange from '..';

const spec = new Spec();

spec.test('exposes objects', (ctx) => {
  ctx.true(!!exchange.Gateway);
  ctx.true(!!exchange.Order);
});

export default spec;
