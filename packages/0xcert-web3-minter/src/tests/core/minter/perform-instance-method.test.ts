import { Spec } from '@specron/spec';
import { Protocol } from '@0xcert/web3-sandbox';
import { Connector } from '@0xcert/web3-connector';
import { MinterOrder } from '../../../core/order';
import { Minter } from '../../../core/minter';

interface Data {
  protocol: Protocol;
  makerConnector: Connector;
  takerConnector: Connector;
  order: MinterOrder;
  coinbase: string;
  bob: string;
  sara: string;
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
});

spec.before(async (stage) => {
  const minterId = stage.get('protocol').minter.instance.options.address;
  const coinbase = stage.get('coinbase');
  const bob = stage.get('bob');

  const makerConnector = new Connector();
  await makerConnector.attach({ minterId, makerId: coinbase, ...stage });

  const takerConnector = new Connector();
  await takerConnector.attach({ minterId, makerId: bob, ...stage });

  stage.set('makerConnector', makerConnector);
  stage.set('takerConnector', takerConnector);
});

spec.before(async (stage) => {
  const coinbase = stage.get('coinbase');
  const bob = stage.get('bob');

  const xcert = stage.get('protocol').xcert;
  const xcertMintProxyId = stage.get('protocol').xcertMintProxy.instance.options.address;
  const nftokenTransferProxyId = stage.get('protocol').nftokenTransferProxy.instance.options.address;

  await xcert.instance.methods.assignAbilities(xcertMintProxyId, [1]).send({ from: coinbase });
  await xcert.instance.methods.mint(bob, '100', 'foo').send({ form: coinbase });
  await xcert.instance.methods.approve(nftokenTransferProxyId, '100').send({ from: bob });
});

spec.before(async (stage) => {
  const connector = stage.get('makerConnector');
  const bob = stage.get('bob');
  const sara = stage.get('sara');
  const xcertId = stage.get('protocol').xcert.instance.options.address;

  const order = new MinterOrder(connector);
  await order.build({
    takerId: bob,
    asset: {
      folderId: xcertId,
      assetId: '5',
      proof: 'foo',
    },
    transfers: [
      {
        folderId: xcertId,
        senderId: bob,
        receiverId: sara,
        assetId: '100',
      },
    ],
    seed: 1535113220,
    expiration: 1607731200,
  });
  await order.sign();

  stage.set('order', order);
});

spec.test('submits mint order to the network which mints a new asset', async (ctx) => {
  const connector = ctx.get('takerConnector');
  const order = ctx.get('order');
  const bob = ctx.get('bob');
  const sara = ctx.get('sara');
  const xcert = ctx.get('protocol').xcert;

  const minter = new Minter(connector);
  await minter.perform(order).then(() => ctx.sleep(200));

  ctx.is(await xcert.instance.methods.ownerOf('5').call(), bob);
  ctx.is(await xcert.instance.methods.ownerOf('100').call(), sara);
});

export default spec;
