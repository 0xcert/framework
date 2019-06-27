import { Spec } from '@hayspec/spec';
import * as exchange from '..';

const spec = new Spec();

spec.test('exposes objects', (ctx) => {
  ctx.true(!!exchange.DeployGateway);
  ctx.true(!!exchange.Deploy);
});

export default spec;
