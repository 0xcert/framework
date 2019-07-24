import { Spec } from '@hayspec/spec';
import * as view from '..';

const spec = new Spec();

spec.test('exposes objects', (ctx) => {
  ctx.true(!!view.BitskiProvider);
  ctx.true(!!view.buildGatewayConfig);
});

export default spec;
