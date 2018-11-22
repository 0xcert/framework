import { Spec } from '@specron/spec';
import { Protocol } from '@0xcert/web3-sandbox';
import { Order, OrderActionKind } from '@0xcert/scaffold';
import { Context } from '@0xcert/web3-context';
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
  const coinbase = stage.get('coinbase');
  const bob = stage.get('bob');

  const makerContext = new Context({ 
    myId: coinbase,
    web3: stage.web3,
  });
  const takerContext = new Context({ 
    myId: bob,
    web3: stage.web3,
  });

  stage.set('makerContext', makerContext);
  stage.set('takerContext', takerContext);
});

spec.before(async (stage) => {
  const coinbase = stage.get('coinbase');
  const bob = stage.get('bob');

  const xcert = stage.get('protocol').xcert;
  const nftokenSafeTransferProxy = stage.get('protocol').nftokenSafeTransferProxy.instance.options.address;

  await xcert.instance.methods.mint(coinbase, '100', '0x0').send({ form: coinbase });
  await xcert.instance.methods.mint(bob, '101', '0x0').send({ form: coinbase });
  await xcert.instance.methods.approve(nftokenSafeTransferProxy, '100').send({ from: coinbase });
  await xcert.instance.methods.approve(nftokenSafeTransferProxy, '101').send({ from: bob });
});

spec.before(async (stage) => {
  const coinbase = stage.get('coinbase');
  const bob = stage.get('bob');
  const xcertId = stage.get('protocol').xcert.instance.options.address;

  const order: Order = {
    makerId: coinbase,
    takerId: bob,
    seed: 1535113220.12345, // should handle floats
    expiration: Date.now() * 60.1234, // should handle floats
    actions: [
      {
        kind: OrderActionKind.TRANSFER_ASSET,
        ledgerId: xcertId,
        senderId: coinbase,
        receiverId: bob,
        assetId: '100',
      },
      {
        kind: OrderActionKind.TRANSFER_ASSET,
        ledgerId: xcertId,
        senderId: bob,
        receiverId: coinbase,
        assetId: '101',
      },
    ],
  };

  stage.set('order', order);
});

spec.before(async (stage) => {
  const exchangeId = stage.get('protocol').exchange.instance.options.address;
  const context = stage.get('makerContext');
  const exchange = new OrderExchange(context, exchangeId);
  const order = stage.get('order');
  
  stage.set('claim', await exchange.claim(order));
});

spec.test('submits exchange order to the network which executes transfers', async (ctx) => {
  const exchangeId = ctx.get('protocol').exchange.instance.options.address;
  const context = ctx.get('takerContext');
  const order = ctx.get('order');
  const claim = ctx.get('claim');
  const bob = ctx.get('bob');
  const coinbase = ctx.get('coinbase');
  const xcert = ctx.get('protocol').xcert;

  const exchange = new OrderExchange(context, exchangeId);
  await exchange.perform(order, claim).then(() => ctx.sleep(200));

  ctx.is(await xcert.instance.methods.ownerOf('100').call(), bob);
  ctx.is(await xcert.instance.methods.ownerOf('101').call(), coinbase);
});

export default spec;
