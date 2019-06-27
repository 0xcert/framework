import { GenericProvider } from '@0xcert/ethereum-generic-provider';
import { AssetLedgerCapability } from '@0xcert/scaffold';
import { Spec } from '@specron/spec';
import { normalizeDeployIds } from '../../../lib/deploy';

const spec = new Spec();

spec.test('converts addresses to checksum addresses', async (ctx) => {
  ctx.deepEqual(normalizeDeployIds({
    makerId: '0x44e44897fc076bc46aae6b06b917d0dfd8b2dae9',
    takerId: '0x44e44897fc076bc46aae6b06b917d0dfd8b2dae9',
    assetLedgerData: {
      name: 'test',
      symbol: 'TST',
      uriBase: 'https://base.com/',
      schemaId: '0x9c22ff5f21f0b81b113e63f7db6da94fedef11b2119b4088b89664fb9a3cb658',
      capabilities: [AssetLedgerCapability.TOGGLE_TRANSFERS, AssetLedgerCapability.DESTROY_ASSET],
      owner: '0x44e44897fc076bc46aae6b06b917d0dfd8b2dae9',
    },
    tokenTransferData: {
      ledgerId: '0x44e44897fc076bc46aae6b06b917d0dfd8b2dae9',
      receiverId: '0x44e44897fc076bc46aae6b06b917d0dfd8b2dae9',
      value: '10000',
    },
    seed: 234,
    expiration: 234,
  }, new GenericProvider({})), {
    makerId: '0x44e44897FC076Bc46AaE6b06b917D0dfD8B2dae9',
    takerId: '0x44e44897FC076Bc46AaE6b06b917D0dfD8B2dae9',
    assetLedgerData: {
      name: 'test',
      symbol: 'TST',
      uriBase: 'https://base.com/',
      schemaId: '0x9c22ff5f21f0b81b113e63f7db6da94fedef11b2119b4088b89664fb9a3cb658',
      capabilities: [AssetLedgerCapability.TOGGLE_TRANSFERS, AssetLedgerCapability.DESTROY_ASSET],
      owner: '0x44e44897FC076Bc46AaE6b06b917D0dfD8B2dae9',
    },
    tokenTransferData: {
      ledgerId: '0x44e44897FC076Bc46AaE6b06b917D0dfD8B2dae9',
      receiverId: '0x44e44897FC076Bc46AaE6b06b917D0dfD8B2dae9',
      value: '10000',
    },
    seed: 234,
    expiration: 234,
  });
});

export default spec;
