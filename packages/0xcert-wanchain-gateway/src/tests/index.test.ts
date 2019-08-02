import { Spec } from '@hayspec/spec';
import * as exchange from '..';

const spec = new Spec();

spec.test('exposes objects', (ctx) => {
  ctx.true(!!exchange.Gateway);
  ctx.true(!!exchange.ActionsOrder);
  ctx.true(!!exchange.AssetLedgerDeployOrder);
});

export default spec;
