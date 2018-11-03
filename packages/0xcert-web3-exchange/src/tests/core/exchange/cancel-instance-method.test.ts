import { Spec } from '@specron/spec';
import { Protocol } from '@0xcert/web3-sandbox';
import { Connector } from '@0xcert/web3-connector';
import { ExchangeOrder } from '../../../core/order';
import { Exchange } from '../../../core/exchange';

interface Data {
  protocol: Protocol;
  makerConnector: Connector;
  takerConnector: Connector;
  order: ExchangeOrder;
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

  const makerConnector = new Connector();
  await makerConnector.attach({ exchangeId, makerId: coinbase, ...stage });

  const takerConnector = new Connector();
  await takerConnector.attach({ exchangeId, makerId: bob, ...stage });

  stage.set('makerConnector', makerConnector);
  stage.set('takerConnector', takerConnector);
});

spec.before(async (stage) => {
  const coinbase = stage.get('coinbase');
  const sara = stage.get('sara');
  const jane = stage.get('jane');

  const xcert = stage.get('protocol').xcert;
  const xcertMintProxyId = stage.get('protocol').xcertMintProxy.instance.options.address;
  const nftokenTransferProxyId = stage.get('protocol').nftokenTransferProxy.instance.options.address;

  await xcert.instance.methods.assignAbilities(xcertMintProxyId, [1]).send({ from: coinbase });
  await xcert.instance.methods.mint(sara, '100', 'foo').send({ form: coinbase });
  await xcert.instance.methods.mint(jane, '101', 'bar').send({ form: coinbase });
  await xcert.instance.methods.approve(nftokenTransferProxyId, '100').send({ from: sara });
  await xcert.instance.methods.approve(nftokenTransferProxyId, '101').send({ from: jane });
});

spec.before(async (stage) => {
  const connector = stage.get('makerConnector');
  const bob = stage.get('bob');
  const sara = stage.get('sara');
  const jane = stage.get('jane');
  const xcertId = stage.get('protocol').xcert.instance.options.address;

  const order = new ExchangeOrder(connector);
  await order.build({
    takerId: bob,
    transfers: [
      {
        folderId: xcertId,
        senderId: sara,
        receiverId: jane,
        assetId: '100',
      },
      {
        folderId: xcertId,
        senderId: jane,
        receiverId: sara,
        assetId: '101',
      },
    ],
    seed: 1535113220,
    expiration: 1607731200,
  });
  await order.sign();

  stage.set('order', order);
});

spec.test('marks exchange order as canceled on the network which prevents an transfers to be swapped', async (ctx) => {
  const makerConnector = ctx.get('makerConnector');
  const takerConnector = ctx.get('takerConnector');
  const order = ctx.get('order');
  const sara = ctx.get('sara');
  const jane = ctx.get('jane');
  const xcert = ctx.get('protocol').xcert;

  const makerExchange = new Exchange(makerConnector);
  await makerExchange.cancel(order).then(() => ctx.sleep(200));

  const takerExchange = new Exchange(takerConnector);
  await takerExchange.perform(order).then(() => ctx.sleep(200));

  ctx.is(await xcert.instance.methods.ownerOf('100').call(), sara);
  ctx.is(await xcert.instance.methods.ownerOf('101').call(), jane);
});

export default spec;
