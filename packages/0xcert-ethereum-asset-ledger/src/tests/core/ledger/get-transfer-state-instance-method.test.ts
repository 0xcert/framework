import { Spec } from '@specron/spec';
import { GenericProvider } from '@0xcert/ethereum-generic-provider';
import { Protocol } from '@0xcert/ethereum-sandbox';
import { AssetLedger } from '../../../core/ledger';

interface Data {
  provider: GenericProvider;
  protocol: Protocol;
}

const spec = new Spec<Data>();

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
  const enabled = await ledger.isTransferable();
  ctx.true(enabled);
});

spec.test('returns null transfer state on contract that does not support transfer states', async (ctx) => {
  const provider = ctx.get('provider');
  const ledgerId = ctx.get('protocol').erc721Enumerable.instance.options.address;

  const ledger = new AssetLedger(provider, ledgerId);
  const enabled = await ledger.isTransferable();
  ctx.is(enabled, null);
});


export default spec;
