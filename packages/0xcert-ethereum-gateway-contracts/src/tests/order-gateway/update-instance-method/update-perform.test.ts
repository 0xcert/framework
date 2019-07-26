import { NFTokenSafeTransferProxyAbilities, TokenTransferProxyAbilities,
  XcertCreateProxyAbilities, XcertUpdateProxyAbilities } from '@0xcert/ethereum-proxy-contracts/src/core/types';
import { XcertAbilities } from '@0xcert/ethereum-xcert-contracts/src/core/types';
import { Spec } from '@specron/spec';
import { OrderGatewayAbilities } from '../../../core/types';
import * as common from '../../helpers/common';

/**
 * Test definition.
 * ERC20: ZXC, BNB, OMG, BAT, GNT
 * ERC721: Cat, Dog, Fox, Bee, Ant, Ape, Pig
 */

interface Data {
  orderGateway?: any;
  tokenProxy?: any;
  nftSafeProxy?: any;
  updateProxy?: any;
  createProxy?: any;
  cat?: any;
  dog?: any;
  fox?: any;
  bee?: any;
  owner?: string;
  bob?: string;
  jane?: string;
  sara?: string;
  zxc?: any;
  gnt?: any;
  bnb?: any;
  omg?: any;
  id1?: string;
  id2?: string;
  id3?: string;
  imprint1?: string;
  imprint2?: string;
  imprint3?: string;
}

const spec = new Spec<Data>();

spec.beforeEach(async (ctx) => {
  const accounts = await ctx.web3.eth.getAccounts();
  ctx.set('owner', accounts[0]);
  ctx.set('bob', accounts[1]);
  ctx.set('jane', accounts[2]);
  ctx.set('sara', accounts[3]);
});

spec.beforeEach(async (ctx) => {
  ctx.set('id1', '1');
  ctx.set('id2', '2');
  ctx.set('id3', '3');
  ctx.set('imprint1', '0x1e205550c221490347e5e2393a02e94d284bbe9903f023ba098355b8d75974c8');
  ctx.set('imprint2', '0x5e20552dc271490347e5e2391b02e94d684bbe9903f023fa098355bed7597434');
  ctx.set('imprint3', '0x53f0df2dc671410347e5eef91b02344d687bbe9903f456fa0983eebed7517521');
});

/**
 * Cat
 */
spec.beforeEach(async (ctx) => {
  const jane = ctx.get('jane');
  const owner = ctx.get('owner');
  const imprint1 = ctx.get('imprint1');
  const cat = await ctx.deploy({
    src: '@0xcert/ethereum-xcert-contracts/build/xcert-mock.json',
    contract: 'XcertMock',
    args: ['cat', 'CAT', 'https://0xcert.org/', '0xa65de9e6', ['0xbda0e852']],
  });
  await cat.instance.methods
  .create(jane, 1, imprint1)
  .send({
    from: owner,
  });
  ctx.set('cat', cat);
});

/**
 * Dog
 * Jane owns: #1, #2, #3
 */
spec.beforeEach(async (ctx) => {
  const jane = ctx.get('jane');
  const owner = ctx.get('owner');
  const imprint1 = ctx.get('imprint1');
  const imprint2 = ctx.get('imprint2');
  const imprint3 = ctx.get('imprint3');
  const dog = await ctx.deploy({
    src: '@0xcert/ethereum-xcert-contracts/build/xcert-mock.json',
    contract: 'XcertMock',
    args: ['dog', 'DOG', 'https://0xcert.org/', '0xa65de9e6', ['0xbda0e852']],
  });
  await dog.instance.methods
    .create(jane, 1, imprint1)
    .send({
      from: owner,
    });
  await dog.instance.methods
    .create(jane, 2, imprint2)
    .send({
      from: owner,
    });
  await dog.instance.methods
    .create(jane, 3, imprint3)
    .send({
      from: owner,
    });
  ctx.set('dog', dog);
});

/**
 * Fox
 * Jane owns: #1
 */
spec.beforeEach(async (ctx) => {
  const jane = ctx.get('jane');
  const owner = ctx.get('owner');
  const fox = await ctx.deploy({
    src: '@0xcert/ethereum-xcert-contracts/build/xcert-mock.json',
    contract: 'XcertMock',
    args: ['fox', 'FOX', 'https://0xcert.org/', '0xa65de9e6', ['0xbda0e852']],
  });
  await fox.instance.methods
    .create(jane, 1, '0x0')
    .send({
      from: owner,
    });
  ctx.set('fox', fox);
});

/**
 * ZXC
 * Jane owns: all
 */
spec.beforeEach(async (ctx) => {
  const jane = ctx.get('jane');
  const zxc = await ctx.deploy({
    src: '@0xcert/ethereum-erc20-contracts/build/token-mock.json',
    contract: 'TokenMock',
    args: ['ERC20', 'ERC', 18, '300000000000000000000000000'],
    from: jane,
  });
  ctx.set('zxc', zxc);
});

/**
 * BNB
 * Jane owns: all
 */
spec.beforeEach(async (ctx) => {
  const jane = ctx.get('jane');
  const bnb = await ctx.deploy({
    src: '@0xcert/ethereum-erc20-contracts/build/token-mock.json',
    contract: 'TokenMock',
    args: ['ERC20', 'ERC', 18, '300000000000000000000000000'],
    from: jane,
  });
  ctx.set('bnb', bnb);
});

spec.beforeEach(async (ctx) => {
  const tokenProxy = await ctx.deploy({
    src: '@0xcert/ethereum-proxy-contracts/build/token-transfer-proxy.json',
    contract: 'TokenTransferProxy',
  });
  ctx.set('tokenProxy', tokenProxy);
});

spec.beforeEach(async (ctx) => {
  const nftSafeProxy = await ctx.deploy({
    src: '@0xcert/ethereum-proxy-contracts/build/nftoken-safe-transfer-proxy.json',
    contract: 'NFTokenSafeTransferProxy',
  });
  ctx.set('nftSafeProxy', nftSafeProxy);
});

spec.beforeEach(async (ctx) => {
  const updateProxy = await ctx.deploy({
    src: '@0xcert/ethereum-proxy-contracts/build/xcert-update-proxy.json',
    contract: 'XcertUpdateProxy',
  });
  ctx.set('updateProxy', updateProxy);
});

spec.beforeEach(async (ctx) => {
  const createProxy = await ctx.deploy({
    src: '@0xcert/ethereum-proxy-contracts/build/xcert-create-proxy.json',
    contract: 'XcertCreateProxy',
  });
  ctx.set('createProxy', createProxy);
});

spec.beforeEach(async (ctx) => {
  const tokenProxy = ctx.get('tokenProxy');
  const nftSafeProxy = ctx.get('nftSafeProxy');
  const updateProxy = ctx.get('updateProxy');
  const createProxy = ctx.get('createProxy');
  const owner = ctx.get('owner');
  const orderGateway = await ctx.deploy({
    src: './build/order-gateway.json',
    contract: 'OrderGateway',
  });
  await orderGateway.instance.methods.grantAbilities(owner, OrderGatewayAbilities.SET_PROXIES).send();
  await orderGateway.instance.methods.addProxy(tokenProxy.receipt._address).send({ from: owner });
  await orderGateway.instance.methods.addProxy(nftSafeProxy.receipt._address).send({ from: owner });
  await orderGateway.instance.methods.addProxy(updateProxy.receipt._address).send({ from: owner });
  await orderGateway.instance.methods.addProxy(createProxy.receipt._address).send({ from: owner });
  ctx.set('orderGateway', orderGateway);
});

spec.beforeEach(async (ctx) => {
  const tokenProxy = ctx.get('tokenProxy');
  const nftSafeProxy = ctx.get('nftSafeProxy');
  const updateProxy = ctx.get('updateProxy');
  const createProxy = ctx.get('createProxy');
  const orderGateway = ctx.get('orderGateway');
  const owner = ctx.get('owner');
  await tokenProxy.instance.methods.grantAbilities(orderGateway.receipt._address, TokenTransferProxyAbilities.EXECUTE).send({ from: owner });
  await nftSafeProxy.instance.methods.grantAbilities(orderGateway.receipt._address, NFTokenSafeTransferProxyAbilities.EXECUTE).send({ from: owner });
  await updateProxy.instance.methods.grantAbilities(orderGateway.receipt._address, XcertUpdateProxyAbilities.EXECUTE).send({ from: owner });
  await createProxy.instance.methods.grantAbilities(orderGateway.receipt._address, XcertCreateProxyAbilities.EXECUTE).send({ from: owner });
});

spec.test('thows when trying to perform and already performed update', async (ctx) => {
  const orderGateway = ctx.get('orderGateway');
  const updateProxy = ctx.get('updateProxy');
  const jane = ctx.get('jane');
  const owner = ctx.get('owner');
  const cat = ctx.get('cat');
  const id = ctx.get('id1');
  const imprint2 = ctx.get('imprint2');

  const actions = [
    {
      kind: 2,
      proxy: 2,
      token: cat.receipt._address,
      param1: imprint2,
      to: '0x0000000000000000000000000000000000000000',
      value: id,
    },
  ];
  const orderData = {
    from: owner,
    to: jane,
    actions,
    seed: common.getCurrentTime(),
    expirationTimestamp: common.getCurrentTime() + 3600,
  };
  const createTuple = ctx.tuple(orderData);

  const claim = await orderGateway.instance.methods.getOrderDataClaim(createTuple).call();

  const signature = await ctx.web3.eth.sign(claim, owner);
  const signatureData = {
    r: signature.substr(0, 66),
    s: `0x${signature.substr(66, 64)}`,
    v: parseInt(`0x${signature.substr(130, 2)}`) + 27,
    kind: 0,
  };
  const signatureDataTuple = ctx.tuple(signatureData);

  await cat.instance.methods.grantAbilities(updateProxy.receipt._address, XcertAbilities.UPDATE_ASSET_IMPRINT).send({ from: owner });
  const logs = await orderGateway.instance.methods.perform(createTuple, signatureDataTuple).send({ from: jane });
  ctx.not(logs.events.Perform, undefined);

  const cat1Imprint = await cat.instance.methods.tokenImprint(1).call();
  ctx.is(cat1Imprint, imprint2);
});

spec.test('correctly updates multiple assets', async (ctx) => {
  const orderGateway = ctx.get('orderGateway');
  const updateProxy = ctx.get('updateProxy');
  const jane = ctx.get('jane');
  const owner = ctx.get('owner');
  const cat = ctx.get('cat');
  const dog = ctx.get('dog');
  const id = ctx.get('id1');
  const id2 = ctx.get('id2');
  const id3 = ctx.get('id3');
  const imprint1 = ctx.get('imprint1');
  const imprint2 = ctx.get('imprint2');

  const actions = [
    {
      kind: 2,
      proxy: 2,
      token: cat.receipt._address,
      param1: imprint2,
      to: '0x0000000000000000000000000000000000000000',
      value: id,
    },
    {
      kind: 2,
      proxy: 2,
      token: dog.receipt._address,
      param1: imprint1,
      to: '0x0000000000000000000000000000000000000000',
      value: id2,
    },
    {
      kind: 2,
      proxy: 2,
      token: dog.receipt._address,
      param1: imprint2,
      to: '0x0000000000000000000000000000000000000000',
      value: id3,
    },
  ];
  const orderData = {
    from: owner,
    to: jane,
    actions,
    seed: common.getCurrentTime(),
    expirationTimestamp: common.getCurrentTime() + 3600,
  };
  const createTuple = ctx.tuple(orderData);

  const claim = await orderGateway.instance.methods.getOrderDataClaim(createTuple).call();

  const signature = await ctx.web3.eth.sign(claim, owner);
  const signatureData = {
    r: signature.substr(0, 66),
    s: `0x${signature.substr(66, 64)}`,
    v: parseInt(`0x${signature.substr(130, 2)}`) + 27,
    kind: 0,
  };
  const signatureDataTuple = ctx.tuple(signatureData);

  await cat.instance.methods.grantAbilities(updateProxy.receipt._address, XcertAbilities.UPDATE_ASSET_IMPRINT).send({ from: owner });
  await dog.instance.methods.grantAbilities(updateProxy.receipt._address, XcertAbilities.UPDATE_ASSET_IMPRINT).send({ from: owner });
  const logs = await orderGateway.instance.methods.perform(createTuple, signatureDataTuple).send({ from: jane });
  ctx.not(logs.events.Perform, undefined);

  const cat1Imprint = await cat.instance.methods.tokenImprint(1).call();
  ctx.is(cat1Imprint, imprint2);

  const dog2Imprint = await dog.instance.methods.tokenImprint(2).call();
  ctx.is(dog2Imprint, imprint1);

  const dog3Imprint = await dog.instance.methods.tokenImprint(3).call();
  ctx.is(dog3Imprint, imprint2);
});

spec.test('correctly updates multiple assets with other order actions', async (ctx) => {
  const orderGateway = ctx.get('orderGateway');
  const updateProxy = ctx.get('updateProxy');
  const createProxy = ctx.get('createProxy');
  const jane = ctx.get('jane');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const cat = ctx.get('cat');
  const dog = ctx.get('dog');
  const id = ctx.get('id1');
  const id2 = ctx.get('id2');
  const id3 = ctx.get('id3');
  const imprint1 = ctx.get('imprint1');
  const imprint2 = ctx.get('imprint2');
  const zxc = ctx.get('zxc');
  const tokenProxy = ctx.get('tokenProxy');
  const nftSafeProxy = ctx.get('nftSafeProxy');
  const zxcAmount = 3000;

  const actions = [
    {
      kind: 2,
      proxy: 2,
      token: cat.receipt._address,
      param1: imprint2,
      to: '0x0000000000000000000000000000000000000000',
      value: id,
    },
    {
      kind: 2,
      proxy: 2,
      token: dog.receipt._address,
      param1: imprint1,
      to: '0x0000000000000000000000000000000000000000',
      value: id2,
    },
    {
      kind: 2,
      proxy: 2,
      token: dog.receipt._address,
      param1: imprint2,
      to: '0x0000000000000000000000000000000000000000',
      value: id3,
    },
    {
      kind: 0,
      proxy: 3,
      token: cat.receipt._address,
      param1: imprint2,
      to: jane,
      value: id2,
    },
    {
      kind: 1,
      proxy: 0,
      token: zxc.receipt._address,
      param1: jane,
      to: bob,
      value: zxcAmount,
    },
    {
      kind: 1,
      proxy: 1,
      token: dog.receipt._address,
      param1: jane,
      to: bob,
      value: id,
    },
  ];

  const orderData = {
    from: owner,
    to: jane,
    actions,
    seed: common.getCurrentTime(),
    expirationTimestamp: common.getCurrentTime() + 3600,
  };
  const createTuple = ctx.tuple(orderData);

  const claim = await orderGateway.instance.methods.getOrderDataClaim(createTuple).call();

  const signature = await ctx.web3.eth.sign(claim, owner);
  const signatureData = {
    r: signature.substr(0, 66),
    s: `0x${signature.substr(66, 64)}`,
    v: parseInt(`0x${signature.substr(130, 2)}`) + 27,
    kind: 0,
  };
  const signatureDataTuple = ctx.tuple(signatureData);

  await cat.instance.methods.grantAbilities(updateProxy.receipt._address, XcertAbilities.UPDATE_ASSET_IMPRINT).send({ from: owner });
  await dog.instance.methods.grantAbilities(updateProxy.receipt._address, XcertAbilities.UPDATE_ASSET_IMPRINT).send({ from: owner });
  await cat.instance.methods.grantAbilities(createProxy.receipt._address, XcertAbilities.CREATE_ASSET).send({ from: owner });
  await zxc.instance.methods.approve(tokenProxy.receipt._address, zxcAmount).send({ from: jane });
  await dog.instance.methods.approve(nftSafeProxy.receipt._address, 1).send({ from: jane });
  const logs = await orderGateway.instance.methods.perform(createTuple, signatureDataTuple).send({ from: jane });
  ctx.not(logs.events.Perform, undefined);

  const cat1Imprint = await cat.instance.methods.tokenImprint(id).call();
  ctx.is(cat1Imprint, imprint2);

  const dog2Imprint = await dog.instance.methods.tokenImprint(id2).call();
  ctx.is(dog2Imprint, imprint1);

  const dog3Imprint = await dog.instance.methods.tokenImprint(id3).call();
  ctx.is(dog3Imprint, imprint2);

  const dog1Owner = await dog.instance.methods.ownerOf(id).call();
  ctx.is(dog1Owner, bob);

  const cat2Owner = await cat.instance.methods.ownerOf(id2).call();
  ctx.is(cat2Owner, jane);

  const bobZxcBalance = await zxc.instance.methods.balanceOf(bob).call();
  ctx.is(bobZxcBalance, zxcAmount.toString());
});

spec.test('correctly updates an asset created in the same order', async (ctx) => {
  const orderGateway = ctx.get('orderGateway');
  const updateProxy = ctx.get('updateProxy');
  const createProxy = ctx.get('createProxy');
  const jane = ctx.get('jane');
  const owner = ctx.get('owner');
  const cat = ctx.get('cat');
  const id2 = ctx.get('id2');
  const imprint1 = ctx.get('imprint1');
  const imprint2 = ctx.get('imprint2');

  const actions = [
    {
      kind: 0,
      proxy: 3,
      token: cat.receipt._address,
      param1: imprint2,
      to: jane,
      value: id2,
    },
    {
      kind: 2,
      proxy: 2,
      token: cat.receipt._address,
      param1: imprint1,
      to: '0x0000000000000000000000000000000000000000',
      value: id2,
    },
  ];

  const orderData = {
    from: owner,
    to: jane,
    actions,
    seed: common.getCurrentTime(),
    expirationTimestamp: common.getCurrentTime() + 3600,
  };
  const createTuple = ctx.tuple(orderData);

  const claim = await orderGateway.instance.methods.getOrderDataClaim(createTuple).call();

  const signature = await ctx.web3.eth.sign(claim, owner);
  const signatureData = {
    r: signature.substr(0, 66),
    s: `0x${signature.substr(66, 64)}`,
    v: parseInt(`0x${signature.substr(130, 2)}`) + 27,
    kind: 0,
  };
  const signatureDataTuple = ctx.tuple(signatureData);

  await cat.instance.methods.grantAbilities(updateProxy.receipt._address, XcertAbilities.UPDATE_ASSET_IMPRINT).send({ from: owner });
  await cat.instance.methods.grantAbilities(createProxy.receipt._address, XcertAbilities.CREATE_ASSET).send({ from: owner });
  const logs = await orderGateway.instance.methods.perform(createTuple, signatureDataTuple).send({ from: jane });
  ctx.not(logs.events.Perform, undefined);

  const cat2Imprint = await cat.instance.methods.tokenImprint(id2).call();
  ctx.is(cat2Imprint, imprint1);
});

export default spec;
