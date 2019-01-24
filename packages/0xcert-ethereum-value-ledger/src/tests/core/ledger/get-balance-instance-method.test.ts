import { GenericProvider } from '@0xcert/ethereum-generic-provider';
import { Protocol } from '@0xcert/ethereum-sandbox';
import { Spec } from '@specron/spec';
import { ValueLedger } from '../../../core/ledger';

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

spec.test('returns account balance', async (ctx) => {
  const coinbase = ctx.get('coinbase');
  const provider = ctx.get('provider');
  const ledgerId = ctx.get('protocol').erc20.instance.options.address;
  const ledger =  new ValueLedger(provider, ledgerId);
  const balance = await ledger.getBalance(coinbase);
  ctx.is(balance, '500000000');
});

spec.test('returns null when getting account balance on contract that does not support it', async (ctx) => {
  const coinbase = ctx.get('coinbase');
  const provider = ctx.get('provider');
  const ledgerId = ctx.get('protocol').nftokenReceiver.instance.options.address;
  const ledger =  new ValueLedger(provider, ledgerId);
  const balance = await ledger.getBalance(coinbase);
  ctx.is(balance, null);
});

export default spec;
