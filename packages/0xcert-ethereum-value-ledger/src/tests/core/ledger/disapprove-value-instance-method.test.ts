import { GenericProvider } from '@0xcert/ethereum-generic-provider';
import { Protocol } from '@0xcert/ethereum-sandbox';
import { Spec } from '@specron/spec';
import { ValueLedger } from '../../../core/ledger';
import { GatewayMock } from '../../mock/gateway-mock';

const spec = new Spec<{
  provider: GenericProvider
  ledger: ValueLedger;
  gateway: GatewayMock;
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
  stage.set('gateway', new GatewayMock(provider, orderGatewayId));
});

spec.test('disapproves account for value transfer', async (ctx) => {
  const ledger = ctx.get('ledger');
  const coinbase = ctx.get('coinbase');
  const bob = ctx.get('bob');
  const token = ctx.get('protocol').erc20;
  const value = '300000000000000000000000';
  await token.instance.methods.approve(bob, value).send({ from: coinbase });
  await ledger.disapproveValue(bob);
  ctx.is(await token.instance.methods.allowance(coinbase, bob).call(), '0');
});

spec.test('disapproves order gateway proxy for value transfer', async (ctx) => {
  const ledger = ctx.get('ledger');
  const coinbase = ctx.get('coinbase');
  const gateway = ctx.get('gateway');
  const proxyId = ctx.get('protocol').tokenTransferProxy.instance.options.address;
  const token = ctx.get('protocol').erc20;
  const value = '300000000000000000000000';
  await token.instance.methods.approve(proxyId, value).send({ from: coinbase });
  await ledger.disapproveValue(gateway);
  ctx.is(await token.instance.methods.allowance(coinbase, proxyId).call(), '0');
});

export default spec;
