import { Spec } from '@specron/spec';
import { Protocol } from '@0xcert/web3-sandbox';
import { Context } from '@0xcert/web3-context';
import { Order, OrderActionKind } from '@0xcert/order';
import { OrderExchange } from '../../../core/order-exchange';

interface Data {
  protocol: Protocol;
  makerContext: Context;
  takerContext: Context;
  order: Order;
  claim: string;
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

  const makerContext = new Context({ exchangeId, myId: coinbase, ...stage });
  await makerContext.attach();

  const takerContext = new Context({ exchangeId, myId: bob, ...stage });
  await takerContext.attach();

  stage.set('makerContext', makerContext);
  stage.set('takerContext', takerContext);
});

spec.before(async (stage) => {
  const coinbase = stage.get('coinbase');
  const sara = stage.get('sara');
  const jane = stage.get('jane');

  const xcert = stage.get('protocol').xcert;
  const nftokenSafeTransferProxy = stage.get('protocol').nftokenSafeTransferProxy.instance.options.address;

  await xcert.instance.methods.mint(sara, '100', '0x0').send({ form: coinbase });
  await xcert.instance.methods.mint(jane, '101', '0x0').send({ form: coinbase });
  await xcert.instance.methods.approve(nftokenSafeTransferProxy, '100').send({ from: sara });
  await xcert.instance.methods.approve(nftokenSafeTransferProxy, '101').send({ from: jane });
});

spec.before(async (stage) => {
  const context = stage.get('makerContext');
  const coinbase = stage.get('coinbase');
  const bob = stage.get('bob');
  const sara = stage.get('sara');
  const jane = stage.get('jane');
  const xcertId = stage.get('protocol').xcert.instance.options.address;

  const order = new Order(context);
  order.makerId = coinbase;
  order.takerId = bob;
  order.seed = 1535113220;
  order.expiration = Date.now() / 1000 * 60;
  order.actions = [
    {
      kind: OrderActionKind.TRANSFER_ASSET,
      ledgerId: xcertId,
      senderId: sara,
      receiverId: jane,
      assetId: '100',
    },
    {
      kind: OrderActionKind.TRANSFER_ASSET,
      ledgerId: xcertId,
      senderId: jane,
      receiverId: sara,
      assetId: '101',
    },
  ];

  stage.set('order', order);
});

spec.before(async (stage) => {
  const context = stage.get('makerContext');
  const exchange = new OrderExchange(context);
  const order = stage.get('order');
  
  stage.set('claim', await exchange.claim(order));
});

spec.test('submits exchange order to the network which executes transfers', async (ctx) => {
  const context = ctx.get('takerContext');
  const order = ctx.get('order');
  const claim = ctx.get('claim');
  const sara = ctx.get('sara');
  const jane = ctx.get('jane');
  const xcert = ctx.get('protocol').xcert;

  const exchange = new OrderExchange(context);
  await exchange.perform(order, claim).then(() => ctx.sleep(200));

  ctx.is(await xcert.instance.methods.ownerOf('100').call(), jane);
  ctx.is(await xcert.instance.methods.ownerOf('101').call(), sara);
});

export default spec;
