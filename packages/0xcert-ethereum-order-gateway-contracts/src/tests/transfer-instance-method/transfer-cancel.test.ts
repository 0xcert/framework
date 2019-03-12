import { NFTokenSafeTransferProxyAbilities } from '@0xcert/ethereum-proxy-contracts/src/core/types';
import { Spec } from '@specron/spec';
import { OrderGatewayAbilities } from '../../core/types';
import * as common from '../helpers/common';

/**
 * Test definition.
 *
 * ERC721: Cat
 */

/**
 * Spec context interfaces.
 */

interface Data {
  orderGateway?: any;
  nftSafeProxy?: any;
  cat?: any;
  owner?: string;
  bob?: string;
  jane?: string;
  sara?: string;
  signatureTuple?: any;
  dataTuple?: any;
}

/**
 * Spec stack instances.
 */

const spec = new Spec<Data>();

spec.before(async (ctx) => {
  const accounts = await ctx.web3.eth.getAccounts();
  ctx.set('owner', accounts[0]);
  ctx.set('bob', accounts[1]);
  ctx.set('jane', accounts[2]);
  ctx.set('sara', accounts[3]);
});

/**
 * Cat
 * Jane owns: #1, #4
 * Bob owns: #2, #3
 */
spec.beforeEach(async (ctx) => {
  const cat = await ctx.deploy({
    src: '@0xcert/ethereum-erc721-contracts/build/nf-token-metadata-enumerable-mock.json',
    contract: 'NFTokenMetadataEnumerableMock',
    args: ['cat', 'CAT', 'http://0xcert.org/'],
  });
  await cat.instance.methods
    .create(ctx.get('jane'), 1)
    .send({
      from: ctx.get('owner'),
      gas: 4000000,
    });
  await cat.instance.methods
    .create(ctx.get('jane'), 4)
    .send({
      from: ctx.get('owner'),
      gas: 4000000,
    });
  await cat.instance.methods
    .create(ctx.get('bob'), 2)
    .send({
      from: ctx.get('owner'),
      gas: 4000000,
    });
  await cat.instance.methods
    .create(ctx.get('bob'), 3)
    .send({
      from: ctx.get('owner'),
      gas: 4000000,
    });
  ctx.set('cat', cat);
});

spec.beforeEach(async (ctx) => {
  const nftSafeProxy = await ctx.deploy({
    src: '@0xcert/ethereum-proxy-contracts/build/nftoken-safe-transfer-proxy.json',
    contract: 'NFTokenSafeTransferProxy',
  });
  ctx.set('nftSafeProxy', nftSafeProxy);
});

spec.beforeEach(async (ctx) => {
  const nftSafeProxy = ctx.get('nftSafeProxy');
  const owner = ctx.get('owner');
  const orderGateway = await ctx.deploy({
    src: './build/order-gateway.json',
    contract: 'OrderGateway',
  });
  await orderGateway.instance.methods.grantAbilities(owner, OrderGatewayAbilities.SET_PROXIES).send();
  await orderGateway.instance.methods.setProxy(1, nftSafeProxy.receipt._address).send({ from: owner });
  ctx.set('orderGateway', orderGateway);
});

spec.beforeEach(async (ctx) => {
  const nftSafeProxy = ctx.get('nftSafeProxy');
  const orderGateway = ctx.get('orderGateway');
  const owner = ctx.get('owner');
  await nftSafeProxy.instance.methods.grantAbilities(orderGateway.receipt._address, NFTokenSafeTransferProxyAbilities.EXECUTE).send({ from: owner });
});

spec.beforeEach(async (ctx) => {
  const orderGateway = ctx.get('orderGateway');
  const nftSafeProxy = ctx.get('nftSafeProxy');
  const jane = ctx.get('jane');
  const bob = ctx.get('bob');
  const cat = ctx.get('cat');

  const actions = [
    {
      kind: 1,
      proxy: 1,
      token: cat.receipt._address,
      from: jane,
      to: bob,
      value: 1,
    },
    {
      kind: 1,
      proxy: 1,
      token: cat.receipt._address,
      from: bob,
      to: jane,
      value: 2,
    },
  ];
  const orderData = {
    maker: jane,
    taker: bob,
    actions,
    seed: common.getCurrentTime(),
    expiration: common.getCurrentTime() + 600,
  };
  const orderDataTuple = ctx.tuple(orderData);
  const claim = await orderGateway.instance.methods.getOrderDataClaim(orderDataTuple).call();

  const signature = await ctx.web3.eth.sign(claim, jane);
  const signatureData = {
    r: signature.substr(0, 66),
    s: `0x${signature.substr(66, 64)}`,
    v: parseInt(`0x${signature.substr(130, 2)}`) + 27,
    kind: 0,
  };
  const signatureDataTuple = ctx.tuple(signatureData);

  await cat.instance.methods.approve(nftSafeProxy.receipt._address, 1).send({ from: jane });
  await cat.instance.methods.approve(nftSafeProxy.receipt._address, 2).send({ from: bob });

  ctx.set('signatureTuple', signatureDataTuple);
  ctx.set('dataTuple', orderDataTuple);
});

spec.test('succeeds', async (ctx) => {
  const signatureTuple = ctx.get('signatureTuple');
  const dataTuple = ctx.get('dataTuple');
  const orderGateway = ctx.get('orderGateway');
  const jane = ctx.get('jane');
  const bob = ctx.get('bob');

  const logs = await orderGateway.instance.methods.cancel(dataTuple).send({ from: jane });
  ctx.not(logs.events.Cancel, undefined);
  await ctx.reverts(() => orderGateway.instance.methods.perform(dataTuple, signatureTuple).send({ from: bob }), '015007');
});

spec.test('throws when trying to cancel an already performed atomic swap', async (ctx) => {
  const signatureTuple = ctx.get('signatureTuple');
  const dataTuple = ctx.get('dataTuple');
  const orderGateway = ctx.get('orderGateway');
  const jane = ctx.get('jane');
  const bob = ctx.get('bob');

  await orderGateway.instance.methods.perform(dataTuple, signatureTuple).send({ from: bob });
  await ctx.reverts(() => orderGateway.instance.methods.cancel(dataTuple).send({ from: jane }), '015008');
});

spec.test('throws when a third party tries to cancel an atomic swap', async (ctx) => {
  const dataTuple = ctx.get('dataTuple');
  const orderGateway = ctx.get('orderGateway');
  const sara = ctx.get('sara');

  await ctx.reverts(() => orderGateway.instance.methods.cancel(dataTuple).send({ from: sara }), '015009');
});

export default spec;
