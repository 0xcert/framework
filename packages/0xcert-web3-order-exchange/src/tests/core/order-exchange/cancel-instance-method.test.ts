import { Spec } from '@specron/spec';
import { Protocol } from '@0xcert/web3-sandbox';
import { Context } from '@0xcert/web3-context';
import { Order, OrderActionKind } from '@0xcert/web3-order';
import { OrderExchange } from '../../..';

interface Data {
  protocol: Protocol;
  makerContext: Context;
  takerContext: Context;
  order: Order;
  coinbase: string;
  bob: string;
  sara: string;
  jane: string;
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
  const exchangeId = stage.get('protocol').exchange.instance.options.address;
  const coinbase = stage.get('coinbase');
  const bob = stage.get('bob');

  const makerContext = new Context();
  await makerContext.attach({ exchangeId, makerId: coinbase, ...stage });

  const takerContext = new Context();
  await takerContext.attach({ exchangeId, makerId: bob, ...stage });

  stage.set('makerContext', makerContext);
  stage.set('takerContext', takerContext);
});

spec.before(async (stage) => {
  const coinbase = stage.get('coinbase');
  const sara = stage.get('sara');
  const jane = stage.get('jane');

  const xcert = stage.get('protocol').xcert;
  const nftokenTransferProxyId = stage.get('protocol').nftokenTransferProxy.instance.options.address;

  await xcert.instance.methods.mint(sara, '100', 'foo').send({ form: coinbase });
  await xcert.instance.methods.mint(jane, '101', 'bar').send({ form: coinbase });
  await xcert.instance.methods.approve(nftokenTransferProxyId, '100').send({ from: sara });
  await xcert.instance.methods.approve(nftokenTransferProxyId, '101').send({ from: jane });
});

spec.before(async (stage) => {
  const context = stage.get('makerContext');
  const bob = stage.get('bob');
  const sara = stage.get('sara');
  const jane = stage.get('jane');
  const xcertId = stage.get('protocol').xcert.instance.options.address;

  const order = new Order(context);
  // order.takerId = bob;
  // order.seed = 1535113220;
  // order.expiration = 1535113820;
  // order.actions = [
  //   {
  //     kind: OrderActionKind.TRANSFER_ASSET,
  //     ledgerId: xcertId,
  //     senderId: sara,
  //     receiverId: jane,
  //     assetId: '100',
  //   },
  //   {
  //     kind: OrderActionKind.TRANSFER_ASSET,
  //     ledgerId: xcertId,
  //     senderId: jane,
  //     receiverId: sara,
  //     assetId: '101',
  //   },
  // ];
  // await order.sign();

  stage.set('order', order);
});

spec.test('marks exchange order as canceled on the network which prevents an transfers to be swapped', async (ctx) => {
  const makerContext = ctx.get('makerContext');
  const takerContext = ctx.get('takerContext');
  const order = ctx.get('order');
  const sara = ctx.get('sara');
  const jane = ctx.get('jane');
  const xcert = ctx.get('protocol').xcert;

  // const makerExchange = new OrderExchange(makerContext);
  // await makerExchange.cancel(order).then(() => ctx.sleep(200));

  // const takerExchange = new OrderExchange(takerContext);
  // await takerExchange.perform(order).then(() => ctx.sleep(200));

  // ctx.is(await xcert.instance.methods.ownerOf('100').call(), sara);
  // ctx.is(await xcert.instance.methods.ownerOf('101').call(), jane);
});

export default spec;
