import { GenericProvider } from '@0xcert/ethereum-generic-provider';
import { Protocol } from '@0xcert/ethereum-sandbox';
import { Spec } from '@specron/spec';
import { AssetLedger } from '../../../core/ledger';

const spec = new Spec<{
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

spec.test('returns ledger transfer state', async (ctx) => {
  const provider = ctx.get('provider');
  const ledgerId = ctx.get('protocol').xcertPausable.instance.options.address;
  const ledger = new AssetLedger(provider, ledgerId);
  ctx.true(await ledger.isTransferable());
});

spec.test('returns null transfer state on contract that does not support transfer states', async (ctx) => {
  const provider = ctx.get('provider');
  const ledgerId = ctx.get('protocol').erc721Enumerable.instance.options.address;
  const ledger = new AssetLedger(provider, ledgerId);
  ctx.is(await ledger.isTransferable(), null);
});

export default spec;
