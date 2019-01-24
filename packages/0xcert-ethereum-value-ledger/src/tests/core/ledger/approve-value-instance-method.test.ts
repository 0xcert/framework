import { GenericProvider } from '@0xcert/ethereum-generic-provider';
import { OrderGateway } from '@0xcert/ethereum-order-gateway';
import { Protocol } from '@0xcert/ethereum-sandbox';
import { Spec } from '@specron/spec';
import { ValueLedger } from '../../../core/ledger';

const spec = new Spec<{
  provider: GenericProvider
  ledger: ValueLedger;
  gateway: OrderGateway;
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
  });
  stage.set('provider', provider);
});

spec.before(async (stage) => {
  const provider = stage.get('provider');
  const ledgerId = stage.get('protocol').erc20.instance.options.address;
  const orderGatewayId = stage.get('protocol').orderGateway.instance.options.address;
  stage.set('ledger', new ValueLedger(provider, ledgerId));
  stage.set('gateway', new OrderGateway(provider, orderGatewayId));
});

spec.test('approves account for value transfer', async (ctx) => {
  const ledger = ctx.get('ledger');
  const coinbase = ctx.get('coinbase');
  const bob = ctx.get('bob');
  const token = ctx.get('protocol').erc20;
  const value = '300000000000000000000000';
  await ledger.approveValue(value, bob);
  ctx.is(await token.instance.methods.allowance(coinbase, bob).call(), value);
});

spec.test('approves order gateway proxy for value transfer', async (ctx) => {
  const ledger = ctx.get('ledger');
  const coinbase = ctx.get('coinbase');
  const gateway = ctx.get('gateway');
  const proxyId = ctx.get('protocol').tokenTransferProxy.instance.options.address;
  const token = ctx.get('protocol').erc20;
  const value = '300000000000000000000000';
  await ledger.approveValue(value, gateway);
  ctx.is(await token.instance.methods.allowance(coinbase, proxyId).call(), value);
});

export default spec;
