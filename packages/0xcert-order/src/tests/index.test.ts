import { Spec } from '@hayspec/spec';
import * as order from '..';

const spec = new Spec();

spec.test('exposes objects', (ctx) => {
  ctx.true(!!order.CreateAssetOrderAction);
  ctx.true(!!order.Order);
  ctx.true(!!order.TransferAssetOrderAction);
  ctx.true(!!order.TransferValueOrderAction);
  ctx.true(!!order.OrderActionKind);
});

export default spec;
