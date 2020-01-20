import { GenericProvider } from '@0xcert/ethereum-generic-provider';
import { Protocol } from '@0xcert/ethereum-sandbox';
import { ActionsOrderActionKind, FixedActionsOrder, OrderKind } from '@0xcert/scaffold';
import { Spec } from '@specron/spec';
import { Gateway } from '../../../../core/gateway';

interface Data {
  protocol: Protocol;
  makerGenericProvider: GenericProvider;
  takerGenericProvider: GenericProvider;
  order: FixedActionsOrder;
  sign: string;
  coinbase: string;
  bob: string;
  sara: string;
  jane: string;
  actionsGatewayId: string;
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
  stage.set('sara', accounts[2]);
  stage.set('jane', accounts[3]);
});

spec.before(async (stage) => {
  const sara = stage.get('sara');
  const jane = stage.get('jane');

  const makerGenericProvider = new GenericProvider({
    client: stage.web3,
    accountId: sara,
    requiredConfirmations: 0,
  });
  const takerGenericProvider = new GenericProvider({
    client: stage.web3,
    accountId: jane,
    requiredConfirmations: 0,
  });

  stage.set('makerGenericProvider', makerGenericProvider);
  stage.set('takerGenericProvider', takerGenericProvider);
});

spec.before(async (stage) => {
  const coinbase = stage.get('coinbase');
  const sara = stage.get('sara');
  const jane = stage.get('jane');

  const xcert = stage.get('protocol').xcert;
  const nftokenSafeTransferProxy = stage.get('protocol').nftokenSafeTransferProxy.instance.options.address;

  await xcert.instance.methods.create(sara, '100', '0x0').send({ form: coinbase });
  await xcert.instance.methods.create(jane, '101', '0x0').send({ form: coinbase });
  await xcert.instance.methods.approve(nftokenSafeTransferProxy, '100').send({ from: sara });
  await xcert.instance.methods.approve(nftokenSafeTransferProxy, '101').send({ from: jane });
});

spec.before(async (stage) => {
  const sara = stage.get('sara');
  const jane = stage.get('jane');
  const xcertId = stage.get('protocol').xcert.instance.options.address;

  const order: FixedActionsOrder = {
    kind: OrderKind.FIXED_ACTIONS_ORDER,
    signers: [sara, jane],
    seed: 1535113220.12345, // should handle floats
    expiration: Date.now() * 60.1234, // should handle floats
    actions: [
      {
        kind: ActionsOrderActionKind.TRANSFER_ASSET,
        ledgerId: xcertId,
        senderId: sara,
        receiverId: jane,
        assetId: '100',
      },
      {
        kind: ActionsOrderActionKind.TRANSFER_ASSET,
        ledgerId: xcertId,
        senderId: jane,
        receiverId: sara,
        assetId: '101',
      },
    ],
  };

  stage.set('order', order);
});

spec.before(async (stage) => {
  const actionsGatewayId = stage.get('protocol').actionsGateway.instance.options.address;
  const provider = stage.get('makerGenericProvider');
  const gateway = new Gateway(provider, { actionsOrderId: actionsGatewayId, assetLedgerDeployOrderId: '', valueLedgerDeployOrderId: '' });
  const order = stage.get('order');

  stage.set('sign', await gateway.sign(order));
});

spec.test('marks gateway order as canceled on the network which prevents transfers from being swapped', async (ctx) => {
  const actionsGatewayId = ctx.get('protocol').actionsGateway.instance.options.address;
  const makerGenericProvider = ctx.get('makerGenericProvider');
  const takerGenericProvider = ctx.get('takerGenericProvider');
  const order = ctx.get('order');
  const sign = ctx.get('sign');
  const sara = ctx.get('sara');
  const jane = ctx.get('jane');
  const xcert = ctx.get('protocol').xcert;

  const makerGateway = new Gateway(makerGenericProvider, { actionsOrderId: actionsGatewayId, assetLedgerDeployOrderId: '', valueLedgerDeployOrderId: '' });

  const mutation = await makerGateway.cancel(order);
  await mutation.complete();

  ctx.is((mutation.logs[0]).event, 'Cancel');

  const takerGateway = new Gateway(takerGenericProvider, { actionsOrderId: actionsGatewayId, assetLedgerDeployOrderId: '', valueLedgerDeployOrderId: '' });
  await ctx.throws(() => takerGateway.perform(order, [sign]).then(() => ctx.sleep(200)));

  ctx.is(await xcert.instance.methods.ownerOf('100').call(), sara);
  ctx.is(await xcert.instance.methods.ownerOf('101').call(), jane);
});

export default spec;
