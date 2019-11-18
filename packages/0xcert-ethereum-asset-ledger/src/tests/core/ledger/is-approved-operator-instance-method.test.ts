import { GenericProvider } from '@0xcert/ethereum-generic-provider';
import { Protocol } from '@0xcert/ethereum-sandbox';
import { Spec } from '@specron/spec';
import { AssetLedger } from '../../../core/ledger';

const spec = new Spec<{
  protocol: Protocol;
  provider: GenericProvider;
  ledger: AssetLedger;
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
    accountId: await stage.web3.eth.getCoinbase(),
  });
  stage.set('provider', provider);
});

spec.before(async (stage) => {
  const provider = stage.get('provider');
  const ledgerId = stage.get('protocol').xcert.instance.options.address;
  stage.set('ledger', new AssetLedger(provider, ledgerId));
});

spec.test('checks if account is operator', async (ctx) => {
  const xcert = ctx.get('protocol').xcert;
  const bob = ctx.get('bob');
  const coinbase = ctx.get('coinbase');
  const ledger = ctx.get('ledger');
  await xcert.instance.methods.setApprovalForAll(bob, true).send({ from: coinbase });
  ctx.true(await ledger.isApprovedOperator(coinbase, bob));
});

spec.test('return null when checking contract that does not support operators', async (ctx) => {
  const bob = ctx.get('bob');
  const coinbase = ctx.get('coinbase');
  const provider = ctx.get('provider');
  const ledgerId = ctx.get('protocol').erc20.instance.options.address;
  const ledger = new AssetLedger(provider, ledgerId);
  ctx.is(await ledger.isApprovedOperator(coinbase, bob), null);
});

export default spec;
