import { GenericProvider } from '@0xcert/ethereum-generic-provider';
import { Protocol } from '@0xcert/ethereum-sandbox';
import { bigNumberify } from '@0xcert/ethereum-utils';
import { Spec } from '@specron/spec';
import { AssetLedger } from '../../../core/ledger';

const spec = new Spec<{
  provider: GenericProvider;
  protocol: Protocol;
  coinbase: string;
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

spec.test('returns asset id', async (ctx) => {
  const xcert = ctx.get('protocol').xcert;
  const coinbase = ctx.get('coinbase');
  const provider = ctx.get('provider');
  const ledgerId = ctx.get('protocol').xcert.instance.options.address;
  const ledger = new AssetLedger(provider, ledgerId);
  await xcert.instance.methods
    .create(coinbase, 1, '0x973124ffc4a03e66d6a4458e587d5d6146f71fc57f359c8d516e0b12a50ab0d9')
    .send({ from: coinbase });

  ctx.is(bigNumberify(await ledger.getAssetIdAt(0)).eq('0x01'), true);

  ctx.is(await ledger.getAssetIdAt(1), null);
});

export default spec;
