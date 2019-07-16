import { GenericProvider } from '@0xcert/ethereum-generic-provider';
import { MultiOrderActionKind, OrderKind } from '@0xcert/scaffold';
import { Spec } from '@specron/spec';
import { normalizeOrderIds } from '../../../lib/multi-order';

const spec = new Spec();

spec.test('converts addresses to checksum addresses', async (ctx) => {
  ctx.deepEqual(normalizeOrderIds({
    kind: OrderKind.MULTI_ORDER,
    makerId: '0x44e44897fc076bc46aae6b06b917d0dfd8b2dae9',
    takerId: '0x44e44897fc076bc46aae6b06b917d0dfd8b2dae9',
    seed: 100,
    expiration: 100,
    actions: [
      {
        kind: MultiOrderActionKind.TRANSFER_ASSET,
        ledgerId: '0x44e44897fc076bc46aae6b06b917d0dfd8b2dae9',
        senderId: '0x44e44897fc076bc46aae6b06b917d0dfd8b2dae9',
        receiverId: '0x44e44897fc076bc46aae6b06b917d0dfd8b2dae9',
        assetId: '100',
      },
    ],
  }, new GenericProvider({})), {
    kind: OrderKind.MULTI_ORDER,
    makerId: '0x44e44897FC076Bc46AaE6b06b917D0dfD8B2dae9',
    takerId: '0x44e44897FC076Bc46AaE6b06b917D0dfD8B2dae9',
    seed: 100,
    expiration: 100,
    actions: [
      {
        kind: MultiOrderActionKind.TRANSFER_ASSET,
        ledgerId: '0x44e44897FC076Bc46AaE6b06b917D0dfD8B2dae9',
        senderId: '0x44e44897FC076Bc46AaE6b06b917D0dfD8B2dae9',
        receiverId: '0x44e44897FC076Bc46AaE6b06b917D0dfD8B2dae9',
        assetId: '100',
      },
    ],
  });
});

export default spec;
