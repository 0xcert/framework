import { GenericProvider } from '@0xcert/ethereum-generic-provider';
import { Protocol } from '@0xcert/ethereum-sandbox';
import { Spec } from '@specron/spec';
import { AssetLedger } from '../../../core/ledger';

const spec = new Spec<{
  provider: GenericProvider;
  ledger: AssetLedger;
  protocol: Protocol;
  coinbase: string;
  bob: string;
}>();

spec.before(async (stage) => {
  const protocol = new Protocol(stage.web3);
  stage.set('protocol', await protocol.deploy());
});

spec.before(async (stage) => {
  const accounts = await stage.web3.eth.getAccounts();
  stage.set('coinbase', accounts[0]);
  stage.set('bob', accounts[1]);
});

spec.before(async (stage) => {
  const provider = new GenericProvider({
    client: stage.web3,
    accountId: stage.get('bob'),
    requiredConfirmations: 0,
  });
  stage.set('provider', provider);
});

spec.before(async (stage) => {
  const provider = stage.get('provider');
  const ledgerId = stage.get('protocol').xcertDestroyable.instance.options.address;
  stage.set('ledger', new AssetLedger(provider, ledgerId));
});

spec.test('destoy asset', async (ctx) => {
  const xcert = ctx.get('protocol').xcertDestroyable;
  const ledger = ctx.get('ledger');
  const bob = ctx.get('bob');
  const coinbase = ctx.get('coinbase');
  await xcert.instance.methods.create(bob, '1', '0x973124ffc4a03e66d6a4458e587d5d6146f71fc57f359c8d516e0b12a50ab0d9').send({ from: coinbase });
  const mutation = await ledger.destroyAsset('1');
  await mutation.complete();
  ctx.is((mutation.logs[0]).event, 'Transfer');
  ctx.is(await xcert.instance.methods.balanceOf(bob).call(), '0');
});

export default spec;
