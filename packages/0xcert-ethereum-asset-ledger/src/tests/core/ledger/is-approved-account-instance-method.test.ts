import { Spec } from '@specron/spec';
import { GenericProvider } from '@0xcert/ethereum-generic-provider';
import { OrderGateway } from '@0xcert/ethereum-order-gateway';
import { Protocol } from '@0xcert/ethereum-sandbox';
import { AssetLedger } from '../../../core/ledger';

interface Data {
  protocol: Protocol;
  provider: GenericProvider;
  ledger: AssetLedger;
  gateway: OrderGateway;
  coinbase: string;
  bob: string;
}

const spec = new Spec<Data>();

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
  const orderGatewayId = stage.get('protocol').orderGateway.instance.options.address;

  stage.set('ledger', new AssetLedger(provider, ledgerId));
  stage.set('gateway', new OrderGateway(provider, orderGatewayId));
});

spec.before(async (stage) => {
  const xcert = stage.get('protocol').xcert;
  const coinbase = stage.get('coinbase');

  await xcert.instance.methods.mint(coinbase, '1', '0x973124ffc4a03e66d6a4458e587d5d6146f71fc57f359c8d516e0b12a50ab0d9').send({ from: coinbase });
  await xcert.instance.methods.mint(coinbase, '2', '0x973124ffc4a03e66d6a4458e587d5d6146f71fc57f359c8d516e0b12a50ab0d9').send({ from: coinbase });
});

spec.test('checks if account is approved', async (ctx) => {
  const coinbase = ctx.get('coinbase');
  const bob = ctx.get('bob');
  const ledger = ctx.get('ledger');
  
  ctx.false(await ledger.isApprovedAccount(bob, '1'));
  await ledger.approveAccount(bob, '1');
  ctx.true(await ledger.isApprovedAccount(bob, '1'));
  await ledger.approveAccount(coinbase, '1');
  ctx.false(await ledger.isApprovedAccount(bob, '1'));
});

spec.test('checks if gateway proxy is approved', async (ctx) => {
  const coinbase = ctx.get('coinbase');
  const bob = ctx.get('bob');
  const ledger = ctx.get('ledger');
  const gateway = ctx.get('gateway');
  
  ctx.false(await ledger.isApprovedAccount(gateway, '2'));
  await ledger.approveAccount(gateway, '2');
  ctx.true(await ledger.isApprovedAccount(gateway, '2'));
  await ledger.approveAccount(coinbase, '2');
  ctx.false(await ledger.isApprovedAccount(gateway, '2'));
});

export default spec;
