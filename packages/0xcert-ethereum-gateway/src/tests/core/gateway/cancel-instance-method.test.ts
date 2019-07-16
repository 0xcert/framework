import { GenericProvider } from '@0xcert/ethereum-generic-provider';
import { Protocol } from '@0xcert/ethereum-sandbox';
import { MultiOrder, MultiOrderActionKind, OrderKind } from '@0xcert/scaffold';
import { Spec } from '@specron/spec';
import { Gateway } from '../../../core/gateway';

interface Data {
  protocol: Protocol;
  makerGenericProvider: GenericProvider;
  takerGenericProvider: GenericProvider;
  order: MultiOrder;
  claim: string;
  coinbase: string;
  bob: string;
  sara: string;
  jane: string;
  orderGatewayId: string;
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
  const coinbase = stage.get('coinbase');
  const bob = stage.get('bob');

  const makerGenericProvider = new GenericProvider({
    client: stage.web3,
    accountId: coinbase,
  });
  const takerGenericProvider = new GenericProvider({
    client: stage.web3,
    accountId: bob,
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
  const coinbase = stage.get('coinbase');
  const bob = stage.get('bob');
  const sara = stage.get('sara');
  const jane = stage.get('jane');
  const xcertId = stage.get('protocol').xcert.instance.options.address;

  const order: MultiOrder = {
    kind: OrderKind.MULTI_ORDER,
    makerId: coinbase,
    takerId: bob,
    seed: 1535113220.12345, // should handle floats
    expiration: Date.now() * 60.1234, // should handle floats
    actions: [
      {
        kind: MultiOrderActionKind.TRANSFER_ASSET,
        ledgerId: xcertId,
        senderId: sara,
        receiverId: jane,
        assetId: '100',
      },
      {
        kind: MultiOrderActionKind.TRANSFER_ASSET,
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
  const orderGatewayId = stage.get('protocol').orderGateway.instance.options.address;
  const provider = stage.get('makerGenericProvider');
  const orderGateway = new Gateway(provider, orderGatewayId);
  const order = stage.get('order');

  stage.set('claim', await orderGateway.claim(order));
});

spec.test('marks orderGateway order as canceled on the network which prevents an transfers to be swapped', async (ctx) => {
  const orderGatewayId = ctx.get('protocol').orderGateway.instance.options.address;
  const makerGenericProvider = ctx.get('makerGenericProvider');
  const takerGenericProvider = ctx.get('takerGenericProvider');
  const order = ctx.get('order');
  const claim = ctx.get('claim');
  const sara = ctx.get('sara');
  const jane = ctx.get('jane');
  const xcert = ctx.get('protocol').xcert;

  const makerGateway = new Gateway(makerGenericProvider, orderGatewayId);
  await makerGateway.cancel(order).then(() => ctx.sleep(200));

  const takerGateway = new Gateway(takerGenericProvider, orderGatewayId);
  await ctx.throws(() => takerGateway.perform(order, claim).then(() => ctx.sleep(200)));

  ctx.is(await xcert.instance.methods.ownerOf('100').call(), sara);
  ctx.is(await xcert.instance.methods.ownerOf('101').call(), jane);
});

export default spec;
