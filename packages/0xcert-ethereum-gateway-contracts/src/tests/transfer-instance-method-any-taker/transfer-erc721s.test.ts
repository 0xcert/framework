import { NFTokenSafeTransferProxyAbilities } from '@0xcert/ethereum-proxy-contracts/src/core/types';
import { Spec } from '@specron/spec';
import { OrderGatewayAbilities } from '../../core/types';
import * as common from '../helpers/common';

/**
 * Test definition.
 *
 * ERC721: Cat, Dog, Fox, Bee
 */

/**
 * Spec context interfaces.
 */

interface Data {
  orderGateway?: any;
  nftSafeProxy?: any;
  cat?: any;
  dog?: any;
  fox?: any;
  bee?: any;
  owner?: string;
  bob?: string;
  jane?: string;
  zeroAddress?: string;
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
  ctx.set('zeroAddress', '0x0000000000000000000000000000000000000000');
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

/**
 * Dog
 * Jane owns: #1
 */
spec.beforeEach(async (ctx) => {
  const dog = await ctx.deploy({
    src: '@0xcert/ethereum-erc721-contracts/build/nf-token-metadata-enumerable-mock.json',
    contract: 'NFTokenMetadataEnumerableMock',
    args: ['dog', 'DOG', 'http://0xcert.org/'],
  });
  await dog.instance.methods
    .create(ctx.get('jane'), 1)
    .send({
      from: ctx.get('owner'),
      gas: 4000000,
    });
  ctx.set('dog', dog);
});

/**
 * Bee
 * Bob owns: #3
 */
spec.beforeEach(async (ctx) => {
  const bee = await ctx.deploy({
    src: '@0xcert/ethereum-erc721-contracts/build/nf-token-metadata-enumerable-mock.json',
    contract: 'NFTokenMetadataEnumerableMock',
    args: ['bee', 'BEE', 'http://0xcert.org/'],
  });
  await bee.instance.methods
    .create(ctx.get('bob'), 3)
    .send({
      from: ctx.get('owner'),
      gas: 4000000,
    });
  ctx.set('bee', bee);
});

/**
 * Fox
 * Bob owns: #1
 */
spec.beforeEach(async (ctx) => {
  const fox = await ctx.deploy({
    src: '@0xcert/ethereum-erc721-contracts/build/nf-token-metadata-enumerable-mock.json',
    contract: 'NFTokenMetadataEnumerableMock',
    args: ['fox', 'FOX', 'http://0xcert.org/'],
  });
  await fox.instance.methods
    .create(ctx.get('bob'), 1)
    .send({
      from: ctx.get('owner'),
      gas: 4000000,
    });
  ctx.set('fox', fox);
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
  await orderGateway.instance.methods.addProxy(nftSafeProxy.receipt._address).send({ from: owner });
  ctx.set('orderGateway', orderGateway);
});

spec.beforeEach(async (ctx) => {
  const nftSafeProxy = ctx.get('nftSafeProxy');
  const orderGateway = ctx.get('orderGateway');
  const owner = ctx.get('owner');
  await nftSafeProxy.instance.methods.grantAbilities(orderGateway.receipt._address, NFTokenSafeTransferProxyAbilities.EXECUTE).send({ from: owner });
});

spec.test('Cat #1 <=> Cat #2', async (ctx) => {
  const orderGateway = ctx.get('orderGateway');
  const nftSafeProxy = ctx.get('nftSafeProxy');
  const jane = ctx.get('jane');
  const bob = ctx.get('bob');
  const zeroAddress = ctx.get('zeroAddress');
  const cat = ctx.get('cat');

  const actions = [
    {
      kind: 1,
      proxy: 0,
      token: cat.receipt._address,
      param1: jane,
      to: zeroAddress,
      value: 1,
    },
    {
      kind: 1,
      proxy: 0,
      token: cat.receipt._address,
      param1: zeroAddress,
      to: jane,
      value: 2,
    },
  ];

  const orderData = {
    maker: jane,
    taker: zeroAddress,
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
  const logs = await orderGateway.instance.methods.performAnyTaker(orderDataTuple, signatureDataTuple).send({ from: bob });
  ctx.not(logs.events.Perform, undefined);

  const cat1Owner = await cat.instance.methods.ownerOf(1).call();
  const cat2Owner = await cat.instance.methods.ownerOf(2).call();
  ctx.is(cat1Owner, bob);
  ctx.is(cat2Owner, jane);
});

spec.test('Cat #1, Cat #4 <=> Cat #2', async (ctx) => {
  const orderGateway = ctx.get('orderGateway');
  const nftSafeProxy = ctx.get('nftSafeProxy');
  const jane = ctx.get('jane');
  const bob = ctx.get('bob');
  const cat = ctx.get('cat');
  const zeroAddress = ctx.get('zeroAddress');

  const actions = [
    {
      kind: 1,
      proxy: 0,
      token: cat.receipt._address,
      from: jane,
      to: zeroAddress,
      value: 1,
    },
    {
      kind: 1,
      proxy: 0,
      token: cat.receipt._address,
      from: jane,
      to: zeroAddress,
      value: 4,
    },
    {
      kind: 1,
      proxy: 0,
      token: cat.receipt._address,
      from: zeroAddress,
      to: jane,
      value: 2,
    },
  ];
  const orderData = {
    maker: jane,
    taker: zeroAddress,
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
  await cat.instance.methods.approve(nftSafeProxy.receipt._address, 4).send({ from: jane });
  await cat.instance.methods.approve(nftSafeProxy.receipt._address, 2).send({ from: bob });
  const logs = await orderGateway.instance.methods.performAnyTaker(orderDataTuple, signatureDataTuple).send({ from: bob });
  ctx.not(logs.events.Perform, undefined);

  const cat1Owner = await cat.instance.methods.ownerOf(1).call();
  const cat2Owner = await cat.instance.methods.ownerOf(2).call();
  const cat4Owner = await cat.instance.methods.ownerOf(4).call();
  ctx.is(cat1Owner, bob);
  ctx.is(cat2Owner, jane);
  ctx.is(cat4Owner, bob);
});

spec.test('Cat #1, Dog #1 <=> Fox #1, Bee #3', async (ctx) => {
  const orderGateway = ctx.get('orderGateway');
  const nftSafeProxy = ctx.get('nftSafeProxy');
  const jane = ctx.get('jane');
  const bob = ctx.get('bob');
  const cat = ctx.get('cat');
  const dog = ctx.get('dog');
  const fox = ctx.get('fox');
  const bee = ctx.get('bee');
  const zeroAddress = ctx.get('zeroAddress');

  const actions = [
    {
      kind: 1,
      proxy: 0,
      token: cat.receipt._address,
      from: jane,
      to: zeroAddress,
      value: 1,
    },
    {
      kind: 1,
      proxy: 0,
      token: dog.receipt._address,
      from: jane,
      to: zeroAddress,
      value: 1,
    },
    {
      kind: 1,
      proxy: 0,
      token: fox.receipt._address,
      from: zeroAddress,
      to: jane,
      value: 1,
    },
    {
      kind: 1,
      proxy: 0,
      token: bee.receipt._address,
      from: zeroAddress,
      to: jane,
      value: 3,
    },
  ];
  const orderData = {
    maker: jane,
    taker: zeroAddress,
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
  await dog.instance.methods.approve(nftSafeProxy.receipt._address, 1).send({ from: jane });
  await fox.instance.methods.approve(nftSafeProxy.receipt._address, 1).send({ from: bob });
  await bee.instance.methods.approve(nftSafeProxy.receipt._address, 3).send({ from: bob });
  const logs = await orderGateway.instance.methods.performAnyTaker(orderDataTuple, signatureDataTuple).send({ from: bob, gas: 6000000 });
  ctx.not(logs.events.Perform, undefined);

  const cat1Owner = await cat.instance.methods.ownerOf(1).call();
  const dog1Owner = await dog.instance.methods.ownerOf(1).call();
  const fox1Owner = await fox.instance.methods.ownerOf(1).call();
  const bee3Owner = await bee.instance.methods.ownerOf(3).call();
  ctx.is(cat1Owner, bob);
  ctx.is(dog1Owner, bob);
  ctx.is(fox1Owner, jane);
  ctx.is(bee3Owner, jane);
});

export default spec;
