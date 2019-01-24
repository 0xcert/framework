import { GenericProvider } from '@0xcert/ethereum-generic-provider';
import { Protocol } from '@0xcert/ethereum-sandbox';
import { AssetLedgerCapability } from '@0xcert/scaffold';
import { Spec } from '@specron/spec';
import { AssetLedger } from '../../../core/ledger';

const spec = new Spec<{
  coinbase: string;
  provider: GenericProvider;
  protocol: Protocol;
}>();

spec.before(async (stage) => {
  const protocol = new Protocol(stage.web3);
  stage.set('protocol', await protocol.deploy());
});

spec.before(async (stage) => {
  const provider = new GenericProvider({
    client: stage.web3,
  });
  stage.set('provider', provider);
});

spec.before(async (stage) => {
  const accounts = await stage.web3.eth.getAccounts();
  stage.set('coinbase', accounts[0]);
});

spec.test('returns ledger capabilities', async (ctx) => {
  const provider = ctx.get('provider');
  const destroyableAssetLedgerId = ctx.get('protocol').xcertDestroyable.instance.options.address;
  const mutableAssetLedgerId = ctx.get('protocol').xcertMutable.instance.options.address;
  const pausableAssetLedgerId = ctx.get('protocol').xcertPausable.instance.options.address;
  const revokableAssetLedgerId = ctx.get('protocol').xcertRevokable.instance.options.address;
  const destroyableAssetLedger = new AssetLedger(provider, destroyableAssetLedgerId);
  const mutableAssetLedger = new AssetLedger(provider, mutableAssetLedgerId);
  const pausableAssetLedger = new AssetLedger(provider, pausableAssetLedgerId);
  const revokableAssetLedger = new AssetLedger(provider, revokableAssetLedgerId);
  ctx.deepEqual(
    await destroyableAssetLedger.getCapabilities(),
    [AssetLedgerCapability.DESTROY_ASSET],
  );
  ctx.deepEqual(
    await mutableAssetLedger.getCapabilities(),
    [AssetLedgerCapability.UPDATE_ASSET],
  );
  ctx.deepEqual(
    await pausableAssetLedger.getCapabilities(),
    [AssetLedgerCapability.TOGGLE_TRANSFERS],
  );
  ctx.deepEqual(
    await revokableAssetLedger.getCapabilities(),
    [AssetLedgerCapability.REVOKE_ASSET],
  );
});

spec.test('returns empty ledger capabilities for erc721 smart contract', async (ctx) => {
  const provider = ctx.get('provider');
  const ledgerId = ctx.get('protocol').erc721.instance.options.address;
  const ledger = new AssetLedger(provider, ledgerId);
  ctx.deepEqual(
    await ledger.getCapabilities(), [],
  );
});

export default spec;
