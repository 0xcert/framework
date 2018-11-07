import { Spec } from '@hayspec/spec';
import * as order from '..';

const spec = new Spec();

spec.test('exposes objects', (ctx) => {
  ctx.true(!!order.CreateAssetAction);
  ctx.true(!!order.Order);
  ctx.true(!!order.TransferAssetAction);
  ctx.true(!!order.TransferValueAction);
  ctx.true(!!order.ActionKind);
});

export default spec;
