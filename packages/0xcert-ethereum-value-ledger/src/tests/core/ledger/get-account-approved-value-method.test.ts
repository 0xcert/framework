import { GenericProvider } from '@0xcert/ethereum-generic-provider';
import { Protocol } from '@0xcert/ethereum-sandbox';
import { Spec } from '@specron/spec';
import { ValueLedger } from '../../../core/ledger';
import { GatewayMock } from '../../mock/gateway-mock';

const spec = new Spec<{
  provider: GenericProvider
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

spec.test('returns account approved amount', async (ctx) => {
  const provider = ctx.get('provider');
  const ledgerId = ctx.get('protocol').erc20.instance.options.address;
  const ledger =  new ValueLedger(provider, ledgerId);
  const coinbase = ctx.get('coinbase');
  const bob = ctx.get('bob');
  const token = ctx.get('protocol').erc20;
  const approveAmount = '5000000000000000000';
  await token.instance.methods.approve(bob, approveAmount).send({from: coinbase});
  const approvedValue = await ledger.getApprovedValue(coinbase, bob);
  ctx.is(approvedValue, approveAmount);
});

spec.test('returns null when calling getApprovedValue on contract that does not support it', async (ctx) => {
  const provider = ctx.get('provider');
  const ledgerId = ctx.get('protocol').erc721.instance.options.address;
  const ledger =  new ValueLedger(provider, ledgerId);
  const coinbase = ctx.get('coinbase');
  const bob = ctx.get('bob');
  const approvedValue = await ledger.getApprovedValue(coinbase, bob);
  ctx.is(approvedValue, null);
});

spec.test('returns order gateway approved amount', async (ctx) => {
  const provider = ctx.get('provider');
  const ledgerId = ctx.get('protocol').erc20.instance.options.address;
  const ledger =  new ValueLedger(provider, ledgerId);
  const coinbase = ctx.get('coinbase');
  const token = ctx.get('protocol').erc20;

  const approveAmount = '5000000000000000000';
  const orderGatewayId = ctx.get('protocol').orderGateway.instance.options.address;
  const gateway = new GatewayMock(provider, orderGatewayId);

  const tokenTransferProxyId = ctx.get('protocol').tokenTransferProxy.instance.options.address;
  await token.instance.methods.approve(tokenTransferProxyId, approveAmount).send({from: coinbase});

  const approvedValue = await ledger.getApprovedValue(coinbase, gateway);
  ctx.is(approvedValue, approveAmount);
});

export default spec;
