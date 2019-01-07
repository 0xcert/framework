import { Spec } from '@specron/spec';
import { Protocol } from '@0xcert/ethereum-sandbox';
import { Order, OrderActionKind } from '@0xcert/scaffold';
import { GenericProvider } from '@0xcert/ethereum-generic-provider';
import { OrderGateway } from '../../..';

interface Data {
  protocol: Protocol;
  makerGenericProvider: GenericProvider;
  takerGenericProvider: GenericProvider;
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
  const bob = stage.get('bob');

  const xcert = stage.get('protocol').xcert;
  const nftokenSafeTransferProxy = stage.get('protocol').nftokenSafeTransferProxy.instance.options.address;
  const xcertCreateProxy = stage.get('protocol').xcertCreateProxy.instance.options.address;

  await xcert.instance.methods.create(coinbase, '100', '0x0').send({ form: coinbase });
  await xcert.instance.methods.create(bob, '101', '0x0').send({ form: coinbase });
  await xcert.instance.methods.approve(nftokenSafeTransferProxy, '100').send({ from: coinbase });
  await xcert.instance.methods.assignAbilities(xcertCreateProxy, [1]).send({ from: coinbase });
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
        kind: OrderActionKind.CREATE_ASSET,
        ledgerId: xcertId,
        senderId: coinbase,
        receiverId: bob,
        assetId: '102',
        assetImprint: '0x0'
      },
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
  const orderGatewayId = stage.get('protocol').orderGateway.instance.options.address;
  const provider = stage.get('makerGenericProvider');
  const orderGateway = new OrderGateway(provider, orderGatewayId);
  const order = stage.get('order');
  
  stage.set('claim', await orderGateway.claim(order));
});

spec.test('submits orderGateway order to the network which executes transfers', async (ctx) => {
  const orderGatewayId = ctx.get('protocol').orderGateway.instance.options.address;
  const provider = ctx.get('takerGenericProvider');
  const order = ctx.get('order');
  const claim = ctx.get('claim');
  const bob = ctx.get('bob');
  const coinbase = ctx.get('coinbase');
  const xcert = ctx.get('protocol').xcert;

  const orderGateway = new OrderGateway(provider, orderGatewayId);
  await orderGateway.perform(order, claim).then(() => ctx.sleep(200));

  ctx.is(await xcert.instance.methods.ownerOf('100').call(), bob);
  ctx.is(await xcert.instance.methods.ownerOf('101').call(), coinbase);
  ctx.is(await xcert.instance.methods.ownerOf('102').call(), bob);
});

export default spec;
