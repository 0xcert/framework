import { GenericProvider } from '@0xcert/ethereum-generic-provider';
import { Protocol } from '@0xcert/ethereum-sandbox';
import { Spec } from '@specron/spec';
import { ValueLedger } from '../../../core/ledger';

const spec = new Spec<{
  provider: GenericProvider;
  ledger: ValueLedger;
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
    accountId: stage.get('coinbase'),
    requiredConfirmations: 0,
  });
  stage.set('provider', provider);
});

spec.before(async (stage) => {
  const provider = stage.get('provider');
  const ledgerId = stage.get('protocol').erc20.instance.options.address;
  const actionsGatewayId = stage.get('protocol').actionsGateway.instance.options.address;
  stage.set('ledger', new ValueLedger(provider, ledgerId));
});

spec.test('disapproves account for value transfer', async (ctx) => {
  const ledger = ctx.get('ledger');
  const coinbase = ctx.get('coinbase');
  const bob = ctx.get('bob');
  const token = ctx.get('protocol').erc20;
  const value = '300000000000000000000000';
  await token.instance.methods.approve(bob, value).send({ from: coinbase });
  const mutation = await ledger.disapproveValue(bob);
  await mutation.complete();
  ctx.is(mutation.logs[0].event, 'Approval');
  ctx.is(await token.instance.methods.allowance(coinbase, bob).call(), '0');
});

export default spec;
