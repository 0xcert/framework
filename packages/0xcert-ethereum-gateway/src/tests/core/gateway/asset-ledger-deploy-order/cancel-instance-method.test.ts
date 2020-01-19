import { GenericProvider } from '@0xcert/ethereum-generic-provider';
import { Protocol } from '@0xcert/ethereum-sandbox';
import { AssetLedgerCapability, AssetLedgerDeployOrder, OrderKind } from '@0xcert/scaffold';
import { Spec } from '@specron/spec';
import { Gateway } from '../../../../core/gateway';

interface Data {
  protocol: Protocol;
  coinbaseGenericProvider: GenericProvider;
  bobGenericProvider: GenericProvider;
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
  const coinbase = stage.get('coinbase');
  const bob = stage.get('bob');

  const coinbaseGenericProvider = new GenericProvider({
    client: stage.web3,
    accountId: coinbase,
  });
  const bobGenericProvider = new GenericProvider({
    client: stage.web3,
    accountId: bob,
    requiredConfirmations: 0,
  });

  stage.set('coinbaseGenericProvider', coinbaseGenericProvider);
  stage.set('bobGenericProvider', bobGenericProvider);
});

spec.before(async (stage) => {
  const coinbase = stage.get('coinbase');
  const bob = stage.get('bob');

  const erc20 = stage.get('protocol').erc20;
  const tokenTransferProxy = stage.get('protocol').tokenTransferProxy.instance.options.address;

  await erc20.instance.methods.transfer(bob, 100000).send({ form: coinbase });
  await erc20.instance.methods.approve(tokenTransferProxy, 100000).send({ from: bob });
});

spec.test('marks xcertDeployGateway deploy as canceled on the network which prevents the deploy from being performed', async (ctx) => {
  const coinbase = ctx.get('coinbase');
  const bob = ctx.get('bob');
  const token = ctx.get('protocol').erc20;
  const tokenId = ctx.get('protocol').erc20.instance.options.address;
  const bobGenericProvider = ctx.get('bobGenericProvider');
  const coinbaseGenericProvider = ctx.get('coinbaseGenericProvider');

  const order: AssetLedgerDeployOrder = {
    kind: OrderKind.ASSET_LEDGER_DEPLOY_ORDER,
    makerId: bob,
    takerId: coinbase,
    seed: 1535113220.12345, // should handle floats
    expiration: Date.now() * 60.1234, // should handle floats
    assetLedgerData: {
      name: 'test',
      symbol: 'TST',
      uriPrefix: 'https://base.com/',
      uriPostfix: '.json',
      schemaId: '9c22ff5f21f0b81b113e63f7db6da94fedef11b2119b4088b89664fb9a3cb658',
      capabilities: [AssetLedgerCapability.TOGGLE_TRANSFERS, AssetLedgerCapability.DESTROY_ASSET],
      ownerId: bob,
    },
    tokenTransferData: {
      ledgerId: tokenId,
      receiverId: coinbase,
      value: '50000',
    },
  };

  const xcertDeployGatewayId = ctx.get('protocol').xcertDeployGateway.instance.options.address;

  const xcertDeployGatewayBob = new Gateway(bobGenericProvider, { actionsOrderId: '', assetLedgerDeployOrderId: xcertDeployGatewayId, valueLedgerDeployOrderId: '' });
  const sign = await xcertDeployGatewayBob.sign(order);
  const mutation = await xcertDeployGatewayBob.cancel(order);
  await mutation.complete();
  ctx.is((mutation.logs[0]).event, 'Cancel');

  const xcertDeployGatewayCoinbase = new Gateway(coinbaseGenericProvider, xcertDeployGatewayId);
  await ctx.throws(() => xcertDeployGatewayCoinbase.perform(order, sign));

  ctx.is(await token.instance.methods.balanceOf(bob).call(), '100000');
});

export default spec;
