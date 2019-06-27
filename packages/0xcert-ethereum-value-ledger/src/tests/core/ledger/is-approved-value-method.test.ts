import { DeployGateway } from '@0xcert/ethereum-deploy-gateway';
import { GenericProvider } from '@0xcert/ethereum-generic-provider';
import { OrderGateway } from '@0xcert/ethereum-order-gateway';
import { Protocol } from '@0xcert/ethereum-sandbox';
import { Spec } from '@specron/spec';
import { ValueLedger } from '../../../core/ledger';

const spec = new Spec<{
  provider: GenericProvider
  ledger: ValueLedger;
  orderGateway: OrderGateway;
  deployGateway: DeployGateway;
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
  const deployGatewayId = stage.get('protocol').deployGateway.instance.options.address;
  stage.set('ledger', new ValueLedger(provider, ledgerId));
  stage.set('orderGateway', new OrderGateway(provider, orderGatewayId));
  stage.set('deployGateway', new DeployGateway(provider, deployGatewayId));
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
  const gateway = ctx.get('orderGateway');
  const tokenTransferProxyId = ctx.get('protocol').tokenTransferProxy.instance.options.address;
  ctx.false(await ledger.isApprovedValue(approveAmount, coinbase, gateway));
  await token.instance.methods.approve(tokenTransferProxyId, approveAmount).send({from: coinbase});
  ctx.true(await ledger.isApprovedValue(approveAmount, coinbase, gateway));
  await token.instance.methods.approve(tokenTransferProxyId, '0').send({from: coinbase});
  ctx.false(await ledger.isApprovedValue(approveAmount, coinbase, gateway));
});

spec.test('checks if deploy gateway proxy is approved', async (ctx) => {
  const ledger = ctx.get('ledger');
  const coinbase = ctx.get('coinbase');
  const token = ctx.get('protocol').erc20;
  const approveAmount = '5000000000000000000';
  const gateway = ctx.get('deployGateway');
  const tokenTransferProxyId = ctx.get('protocol').tokenTransferProxy.instance.options.address;
  ctx.false(await ledger.isApprovedValue(approveAmount, coinbase, gateway));
  await token.instance.methods.approve(tokenTransferProxyId, approveAmount).send({from: coinbase});
  ctx.true(await ledger.isApprovedValue(approveAmount, coinbase, gateway));
  await token.instance.methods.approve(tokenTransferProxyId, '0').send({from: coinbase});
  ctx.false(await ledger.isApprovedValue(approveAmount, coinbase, gateway));
});

export default spec;
