import { NFTokenSafeTransferProxyAbilities, TokenTransferProxyAbilities } from '@0xcert/ethereum-proxy-contracts/src/core/types';
import { Spec } from '@specron/spec';
import { OrderGatewayAbilities } from '../../../core/types';
import * as common from '../../helpers/common';

/**
 * Test definition.
 *
 * ERC20: ZXC
 * ERC721: Cat
 */

/**
 * Spec context interfaces.
 */

interface Data {
  orderGateway?: any;
  tokenProxy?: any;
  nftSafeProxy?: any;
  cat?: any;
  owner?: string;
  bob?: string;
  jane?: string;
  sara?: string;
  zeroAddress?: string;
  zxc?: any;
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
    args: ['cat', 'CAT', 'https://0xcert.org/', '.json'],
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
 * ZXC
 * Bob owns: all
 */
spec.beforeEach(async (ctx) => {
  const bob = ctx.get('bob');
  const zxc = await ctx.deploy({
    src: '@0xcert/ethereum-erc20-contracts/build/token-mock.json',
    contract: 'TokenMock',
    args: ['ERC20', 'ERC', 18, '300000000000000000000000000'],
    from: bob,
  });
  ctx.set('zxc', zxc);
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
  const tokenProxy = ctx.get('tokenProxy');
  const nftSafeProxy = ctx.get('nftSafeProxy');
  const owner = ctx.get('owner');
  const orderGateway = await ctx.deploy({
    src: './build/order-gateway.json',
    contract: 'OrderGateway',
  });
  await orderGateway.instance.methods.grantAbilities(owner, OrderGatewayAbilities.SET_PROXIES).send();
  await orderGateway.instance.methods.addProxy(tokenProxy.receipt._address).send({ from: owner });
  await orderGateway.instance.methods.addProxy(nftSafeProxy.receipt._address).send({ from: owner });
  ctx.set('orderGateway', orderGateway);
});

spec.beforeEach(async (ctx) => {
  const tokenProxy = ctx.get('tokenProxy');
  const nftSafeProxy = ctx.get('nftSafeProxy');
  const orderGateway = ctx.get('orderGateway');
  const owner = ctx.get('owner');
  await tokenProxy.instance.methods.grantAbilities(orderGateway.receipt._address, TokenTransferProxyAbilities.EXECUTE).send({ from: owner });
  await nftSafeProxy.instance.methods.grantAbilities(orderGateway.receipt._address, NFTokenSafeTransferProxyAbilities.EXECUTE).send({ from: owner });
});

spec.test('when proxy not allowed to transfer nft', async (ctx) => {
  const orderGateway = ctx.get('orderGateway');
  const nftSafeProxy = ctx.get('nftSafeProxy');
  const jane = ctx.get('jane');
  const bob = ctx.get('bob');
  const zeroAddress = ctx.get('zeroAddress');
  const cat = ctx.get('cat');

  const actions = [
    {
      kind: 1,
      proxy: 1,
      token: cat.receipt._address,
      from: jane,
      to: zeroAddress,
      value: 1,
    },
    {
      kind: 1,
      proxy: 1,
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
  await ctx.reverts(() => orderGateway.instance.methods.performAnyTaker(orderDataTuple, signatureDataTuple).send({ from: bob }), '006004');
});

spec.test('when proxy has unsofficient allowence for a token', async (ctx) => {
  const orderGateway = ctx.get('orderGateway');
  const nftSafeProxy = ctx.get('nftSafeProxy');
  const tokenProxy = ctx.get('tokenProxy');
  const jane = ctx.get('jane');
  const bob = ctx.get('bob');
  const zeroAddress = ctx.get('zeroAddress');
  const cat = ctx.get('cat');
  const zxc = ctx.get('zxc');
  const zxcAmount = 5000;

  const actions = [
    {
      kind: 1,
      proxy: 1,
      token: cat.receipt._address,
      from: jane,
      to: zeroAddress,
      value: 1,
    },
    {
      kind: 1,
      proxy: 0,
      token: zxc.receipt._address,
      from: zeroAddress,
      to: jane,
      value: zxcAmount,
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
  await zxc.instance.methods.approve(tokenProxy.receipt._address, zxcAmount - 1000).send({ from: bob });
  await ctx.reverts(() => orderGateway.instance.methods.performAnyTaker(orderDataTuple, signatureDataTuple).send({ from: bob }), '001002');
});

spec.test('when current time is after expirationTimestamp', async (ctx) => {
  const orderGateway = ctx.get('orderGateway');
  const nftSafeProxy = ctx.get('nftSafeProxy');
  const jane = ctx.get('jane');
  const bob = ctx.get('bob');
  const zeroAddress = ctx.get('zeroAddress');
  const cat = ctx.get('cat');

  const actions = [
    {
      kind: 1,
      proxy: 1,
      token: cat.receipt._address,
      from: jane,
      to: zeroAddress,
      value: 1,
    },
    {
      kind: 1,
      proxy: 1,
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
    expiration: common.getCurrentTime() - 600,
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
  await ctx.reverts(() => orderGateway.instance.methods.performAnyTaker(orderDataTuple, signatureDataTuple).send({ from: bob }), '015005');
});

spec.test('when signature is invalid', async (ctx) => {
  const orderGateway = ctx.get('orderGateway');
  const nftSafeProxy = ctx.get('nftSafeProxy');
  const jane = ctx.get('jane');
  const bob = ctx.get('bob');
  const zeroAddress = ctx.get('zeroAddress');
  const cat = ctx.get('cat');

  const actions = [
    {
      kind: 1,
      proxy: 1,
      token: cat.receipt._address,
      from: jane,
      to: zeroAddress,
      value: 1,
    },
    {
      kind: 1,
      proxy: 1,
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
  let orderDataTuple = ctx.tuple(orderData);
  const claim = await orderGateway.instance.methods.getOrderDataClaim(orderDataTuple).call();
  orderData.actions[0].kind = 0;
  orderDataTuple = ctx.tuple(orderData);

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
  await ctx.reverts(() => orderGateway.instance.methods.performAnyTaker(orderDataTuple, signatureDataTuple).send({ from: bob }), '015006');
});

spec.test('when trying to perform an already perfomed swap', async (ctx) => {
  const orderGateway = ctx.get('orderGateway');
  const nftSafeProxy = ctx.get('nftSafeProxy');
  const jane = ctx.get('jane');
  const bob = ctx.get('bob');
  const zeroAddress = ctx.get('zeroAddress');
  const cat = ctx.get('cat');

  const actions = [
    {
      kind: 1,
      proxy: 1,
      token: cat.receipt._address,
      from: jane,
      to: zeroAddress,
      value: 1,
    },
    {
      kind: 1,
      proxy: 1,
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
  await cat.instance.methods.approve(nftSafeProxy.receipt._address, 2).send({ from: bob });
  await orderGateway.instance.methods.performAnyTaker(orderDataTuple, signatureDataTuple).send({ from: bob });
  await ctx.reverts(() => orderGateway.instance.methods.performAnyTaker(orderDataTuple, signatureDataTuple).send({ from: bob }), '015008');
});

spec.test('when trying to transfer third party assets', async (ctx) => {
  const orderGateway = ctx.get('orderGateway');
  const nftSafeProxy = ctx.get('nftSafeProxy');
  const jane = ctx.get('jane');
  const bob = ctx.get('bob');
  const sara = ctx.get('sara');
  const zeroAddress = ctx.get('zeroAddress');
  const cat = ctx.get('cat');

  const actions = [
    {
      kind: 1,
      proxy: 1,
      token: cat.receipt._address,
      from: jane,
      to: sara,
      value: 1,
    },
    {
      kind: 1,
      proxy: 1,
      token: cat.receipt._address,
      from: zeroAddress,
      to: sara,
      value: 2,
    },
  ];
  const orderData = {
    maker: sara,
    taker: zeroAddress,
    actions,
    seed: common.getCurrentTime(),
    expiration: common.getCurrentTime() + 600,
  };
  const orderDataTuple = ctx.tuple(orderData);
  const claim = await orderGateway.instance.methods.getOrderDataClaim(orderDataTuple).call();

  const signature = await ctx.web3.eth.sign(claim, sara);
  const signatureData = {
    r: signature.substr(0, 66),
    s: `0x${signature.substr(66, 64)}`,
    v: parseInt(`0x${signature.substr(130, 2)}`) + 27,
    kind: 0,
  };
  const signatureDataTuple = ctx.tuple(signatureData);

  await cat.instance.methods.setApprovalForAll(nftSafeProxy.receipt._address, true).send({ from: jane });
  await cat.instance.methods.approve(nftSafeProxy.receipt._address, 2).send({ from: bob });
  await ctx.reverts(() => orderGateway.instance.methods.performAnyTaker(orderDataTuple, signatureDataTuple).send({ from: bob }), '015004');
});

export default spec;
