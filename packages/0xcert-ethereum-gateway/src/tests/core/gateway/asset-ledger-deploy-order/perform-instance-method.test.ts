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
  const xcertDeployGatewayId = stage.get('protocol').xcertDeployGateway.instance.options.address;

  const coinbaseGenericProvider = new GenericProvider({
    client: stage.web3,
    accountId: coinbase,
    gatewayConfig: { actionsOrderId: '', assetLedgerDeployOrderId: xcertDeployGatewayId, valueLedgerDeployOrderId: '' },
    requiredConfirmations: 0,
  });
  const bobGenericProvider = new GenericProvider({
    client: stage.web3,
    accountId: bob,
    gatewayConfig: { actionsOrderId: '', assetLedgerDeployOrderId: xcertDeployGatewayId, valueLedgerDeployOrderId: '' },
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

spec.test('submits gateway asset ledger deploy order to the network which executes transfer and creates a new xcert', async (ctx) => {
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

  const gatewayBob = new Gateway(bobGenericProvider);
  const sign = await gatewayBob.sign(order);

  const gatewayCoinbase = new Gateway(coinbaseGenericProvider);
  const mutation = await gatewayCoinbase.perform(order, sign);
  const receipt = await ctx.web3.eth.getTransactionReceipt(mutation.id);

  const performEvent = receipt.logs.filter((r) => { return r.topics[0] === '0x492318801c2cec532d47019a0b69f83b8d5b499a022b7adb6100a766050644f2'; });
  const xcertAddress = (gatewayCoinbase.provider.encoder.decodeParameters(['address', 'bytes32'], performEvent[0].data))[0];

  const xcert = ctx.get('protocol').xcert;
  xcert.instance.options.address = xcertAddress;

  const xcertName = await xcert.instance.methods.name().call();
  ctx.is(xcertName, 'test');

  ctx.is(await token.instance.methods.balanceOf(bob).call(), '50000');
});

spec.test('submits dynamic asset ledger deploy order to the network which executes transfer and creates a new xcert', async (ctx) => {
  const bob = ctx.get('bob');
  const token = ctx.get('protocol').erc20;
  const tokenId = ctx.get('protocol').erc20.instance.options.address;
  const bobGenericProvider = ctx.get('bobGenericProvider');
  const coinbaseGenericProvider = ctx.get('coinbaseGenericProvider');

  const order: AssetLedgerDeployOrder = {
    kind: OrderKind.ASSET_LEDGER_DEPLOY_ORDER,
    makerId: bob,
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
      value: '50000',
    },
  };

  const gatewayBob = new Gateway(bobGenericProvider);
  const sign = await gatewayBob.sign(order);

  const gatewayCoinbase = new Gateway(coinbaseGenericProvider);
  const mutation = await gatewayCoinbase.perform(order, sign);
  await mutation.complete();

  ctx.is((mutation.logs[0]).event, 'Perform');
  const xcertAddress = (mutation.logs[0]).createdContract;

  const xcert = ctx.get('protocol').xcert;
  xcert.instance.options.address = xcertAddress;

  const xcertName = await xcert.instance.methods.name().call();
  ctx.is(xcertName, 'test');

  ctx.is(await token.instance.methods.balanceOf(bob).call(), '0');
});

spec.test('handles fixed deploy with dynamic token transfer receiver', async (ctx) => {
  const coinbase = ctx.get('coinbase');
  const bob = ctx.get('bob');
  const tokenId = ctx.get('protocol').erc20.instance.options.address;
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
      value: '50000',
    },
  };

  const gatewayCoinbase = new Gateway(coinbaseGenericProvider);
  await ctx.throws(() => gatewayCoinbase.sign(order));
});

export default spec;
