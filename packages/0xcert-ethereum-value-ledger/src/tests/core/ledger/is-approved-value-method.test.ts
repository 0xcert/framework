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

spec.test('returns if account has the approved amount', async (ctx) => {
  const ledger = ctx.get('ledger');
  const coinbase = ctx.get('coinbase');
  const bob = ctx.get('bob');
  const token = ctx.get('protocol').erc20;
  const approveAmount = '5000000000000000000';
  ctx.is(await ledger.isApprovedValue(approveAmount, coinbase, bob), false);
  await token.instance.methods.approve(bob, approveAmount).send({from: coinbase});
  ctx.is(await ledger.isApprovedValue(approveAmount, coinbase, bob), true);
});

spec.test('checks if order gateway proxy is approved', async (ctx) => {
  const ledger = ctx.get('ledger');
  const coinbase = ctx.get('coinbase');
  const token = ctx.get('protocol').erc20;
  const approveAmount = '5000000000000000000';
  const gateway = ctx.get('gateway');
  const tokenTransferProxyId = ctx.get('protocol').tokenTransferProxy.instance.options.address;
  ctx.false(await ledger.isApprovedValue(approveAmount, coinbase, gateway));
  await token.instance.methods.approve(tokenTransferProxyId, approveAmount).send({from: coinbase});
  ctx.true(await ledger.isApprovedValue(approveAmount, coinbase, gateway));
  await token.instance.methods.approve(tokenTransferProxyId, '0').send({from: coinbase});
  ctx.false(await ledger.isApprovedValue(approveAmount, coinbase, gateway));
});

export default spec;
