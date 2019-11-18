import { Spec } from '@specron/spec';
import * as view from '..';

const spec = new Spec();

spec.test('exposes objects', (ctx) => {
  ctx.true(!!view.GenericProvider);
  ctx.true(!!view.SignMethod);
  ctx.true(!!view.buildGatewayConfig);
  ctx.true(!!view.NetworkKind);
});

export default spec;
