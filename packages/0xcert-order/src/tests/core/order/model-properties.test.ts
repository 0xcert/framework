import { Spec } from '@hayspec/spec';
import { Order, OrderActionKind, CreateAssetOrderAction, TransferAssetOrderAction,
  TransferValueOrderAction } from '../../..';

const spec = new Spec();

spec.test('provides all order properties', async (ctx) => {
  const order = new Order({
    actions: [
      { kind: OrderActionKind.CREATE_ASSET },
      { kind: OrderActionKind.TRANSFER_ASSET },
      { kind: OrderActionKind.TRANSFER_VALUE },
    ],
  });

  ctx.deepEqual(order.serialize(), {
    id: null,
    makerId: null,
    takerId: null,
    actions: [
      {
        kind: 1,
        ledgerId: null,
        senderId: null,
        receiverId: null,
        assetId: null,
        assetProof: null,
      },
      {
        kind: 2,
        ledgerId: null,
        senderId: null,
        receiverId: null,
        assetId: null,
      },
      {
        kind: 3,
        ledgerId: null,
        senderId: null,
        receiverId: null,
        value: null,
      },
    ],
    seed: null,
    expiration: null,
  });

  ctx.true(order.actions[0] instanceof CreateAssetOrderAction);
  ctx.true(order.actions[1] instanceof TransferAssetOrderAction);
  ctx.true(order.actions[2] instanceof TransferValueOrderAction);
});

export default spec;
