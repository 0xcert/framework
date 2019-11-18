import { Spec } from '@specron/spec';
import * as exchange from '..';

const spec = new Spec();

spec.test('exposes objects', (ctx) => {
  ctx.true(!!exchange.Gateway);
  ctx.true(!!exchange.DynamicActionsOrder);
  ctx.true(!!exchange.FixedActionsOrder);
  ctx.true(!!exchange.SignedDynamicActionsOrder);
  ctx.true(!!exchange.SignedFixedActionsOrder);
  ctx.true(!!exchange.AssetLedgerDeployOrder);
  ctx.true(!!exchange.ProxyKind);
});

export default spec;
