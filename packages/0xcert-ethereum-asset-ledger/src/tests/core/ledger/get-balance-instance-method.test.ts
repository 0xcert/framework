import { GenericProvider } from '@0xcert/ethereum-generic-provider';
import { Protocol } from '@0xcert/ethereum-sandbox';
import { Spec } from '@specron/spec';
import { AssetLedger } from '../../../core/ledger';

const spec = new Spec<{
  provider: GenericProvider;
  protocol: Protocol;
  bob: string;
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

spec.test('returns accounts balance', async (ctx) => {
  const provider = ctx.get('provider');
  const ledgerId = ctx.get('protocol').xcert.instance.options.address;
  const bob = ctx.get('bob');
  const ledger = new AssetLedger(provider, ledgerId);
  const balance = await ledger.getBalance(bob);
  ctx.is(balance, '0');
});

spec.test('returns null balance on smart contract that does not support getBalance', async (ctx) => {
  const provider = ctx.get('provider');
  const ledgerId = ctx.get('protocol').nftokenReceiver.instance.options.address;
  const bob = ctx.get('bob');
  const ledger = new AssetLedger(provider, ledgerId);
  const balance = await ledger.getBalance(bob);
  ctx.is(balance, null);
});

export default spec;
