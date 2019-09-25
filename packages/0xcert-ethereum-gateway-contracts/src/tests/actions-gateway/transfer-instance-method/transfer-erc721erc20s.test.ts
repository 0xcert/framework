import { NFTokenSafeTransferProxyAbilities, TokenTransferProxyAbilities } from '@0xcert/ethereum-proxy-contracts/src/core/types';
import { Spec } from '@specron/spec';
import { ActionsGatewayAbilities } from '../../../core/types';
import * as common from '../../helpers/common';

/**
 * Test definition.
 *
 * ERC20: ZXC, OMG, GNT
 * ERC721: Cat, Dog, Fox
 */

/**
 * Spec context interfaces.
 */

interface Data {
  actionsGateway?: any;
  tokenProxy?: any;
  nftSafeProxy?: any;
  cat?: any;
  dog?: any;
  fox?: any;
  owner?: string;
  bob?: string;
  jane?: string;
  sara?: string;
  zxc?: any;
  gnt?: any;
  omg?: any;
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
 * Dog
 * Jane owns: #1
 */
spec.beforeEach(async (ctx) => {
  const dog = await ctx.deploy({
    src: '@0xcert/ethereum-erc721-contracts/build/nf-token-metadata-enumerable-mock.json',
    contract: 'NFTokenMetadataEnumerableMock',
    args: ['dog', 'DOG', 'https://0xcert.org/', '.json'],
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
 * Fox
 * Bob owns: #1
 */
spec.beforeEach(async (ctx) => {
  const fox = await ctx.deploy({
    src: '@0xcert/ethereum-erc721-contracts/build/nf-token-metadata-enumerable-mock.json',
    contract: 'NFTokenMetadataEnumerableMock',
    args: ['fox', 'FOX', 'https://0xcert.org/', '.json'],
  });
  await fox.instance.methods
    .create(ctx.get('bob'), 1)
    .send({
      from: ctx.get('owner'),
      gas: 4000000,
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
 * GNT
 * Bob owns: all
 */
spec.beforeEach(async (ctx) => {
  const bob = ctx.get('bob');
  const gnt = await ctx.deploy({
    src: '@0xcert/ethereum-erc20-contracts/build/token-mock.json',
    contract: 'TokenMock',
    args: ['ERC20', 'ERC', 18, '300000000000000000000000000'],
    from: bob,
  });
  ctx.set('gnt', gnt);
});

/**
 * OMG
 * Bob owns: all
 */
spec.beforeEach(async (ctx) => {
  const bob = ctx.get('bob');
  const omg = await ctx.deploy({
    src: '@0xcert/ethereum-erc20-contracts/build/token-mock.json',
    contract: 'TokenMock',
    args: ['ERC20', 'ERC', 18, '300000000000000000000000000'],
    from: bob,
  });
  ctx.set('omg', omg);
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
  const actionsGateway = await ctx.deploy({
    src: './build/actions-gateway.json',
    contract: 'ActionsGateway',
  });
  await actionsGateway.instance.methods.grantAbilities(owner, ActionsGatewayAbilities.SET_PROXIES).send();
  await actionsGateway.instance.methods.addProxy(tokenProxy.receipt._address).send({ from: owner });
  await actionsGateway.instance.methods.addProxy(nftSafeProxy.receipt._address).send({ from: owner });
  ctx.set('actionsGateway', actionsGateway);
});

spec.beforeEach(async (ctx) => {
  const tokenProxy = ctx.get('tokenProxy');
  const nftSafeProxy = ctx.get('nftSafeProxy');
  const actionsGateway = ctx.get('actionsGateway');
  const owner = ctx.get('owner');
  await tokenProxy.instance.methods.grantAbilities(actionsGateway.receipt._address, TokenTransferProxyAbilities.EXECUTE).send({ from: owner });
  await nftSafeProxy.instance.methods.grantAbilities(actionsGateway.receipt._address, NFTokenSafeTransferProxyAbilities.EXECUTE).send({ from: owner });
});

spec.test('Cat #1  <=>  5000 OMG', async (ctx) => {
  const actionsGateway = ctx.get('actionsGateway');
  const nftSafeProxy = ctx.get('nftSafeProxy');
  const tokenProxy = ctx.get('tokenProxy');
  const jane = ctx.get('jane');
  const bob = ctx.get('bob');
  const cat = ctx.get('cat');
  const omg = ctx.get('omg');
  const omgAmount = 5000;

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
      proxy: 0,
      token: omg.receipt._address,
      from: bob,
      to: jane,
      value: omgAmount,
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
  const claim = await actionsGateway.instance.methods.getOrderDataClaim(orderDataTuple).call();

  const signature = await ctx.web3.eth.sign(claim, jane);
  const signatureData = {
    r: signature.substr(0, 66),
    s: `0x${signature.substr(66, 64)}`,
    v: parseInt(`0x${signature.substr(130, 2)}`) + 27,
    kind: 0,
  };
  const signatureDataTuple = ctx.tuple(signatureData);

  await cat.instance.methods.approve(nftSafeProxy.receipt._address, 1).send({ from: jane });
  await omg.instance.methods.approve(tokenProxy.receipt._address, omgAmount).send({ from: bob });
  const logs = await actionsGateway.instance.methods.perform(orderDataTuple, signatureDataTuple).send({ from: bob });
  ctx.not(logs.events.Perform, undefined);

  const cat1Owner = await cat.instance.methods.ownerOf(1).call();
  const janeOmgAmount = await omg.instance.methods.balanceOf(jane).call();
  ctx.is(cat1Owner, bob);
  ctx.is(janeOmgAmount, omgAmount.toString());
});

spec.test('Cat #1, Dog #1, 3 ZXC <=> Cat #3, Fox #1, 30 OMG, 5000 GNT', async (ctx) => {
  const actionsGateway = ctx.get('actionsGateway');
  const nftSafeProxy = ctx.get('nftSafeProxy');
  const tokenProxy = ctx.get('tokenProxy');
  const jane = ctx.get('jane');
  const bob = ctx.get('bob');
  const cat = ctx.get('cat');
  const dog = ctx.get('dog');
  const fox = ctx.get('fox');
  const omg = ctx.get('omg');
  const zxc = ctx.get('zxc');
  const gnt = ctx.get('gnt');
  const omgAmount = 30;
  const zxcAmount = 3;
  const gntAmount = 5000;

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
      token: dog.receipt._address,
      from: jane,
      to: bob,
      value: 1,
    },
    {
      kind: 1,
      proxy: 0,
      token: zxc.receipt._address,
      from: jane,
      to: bob,
      value: zxcAmount,
    },
    {
      kind: 1,
      proxy: 1,
      token: cat.receipt._address,
      from: bob,
      to: jane,
      value: 3,
    },
    {
      kind: 1,
      proxy: 1,
      token: fox.receipt._address,
      from: bob,
      to: jane,
      value: 1,
    },
    {
      kind: 1,
      proxy: 0,
      token: omg.receipt._address,
      from: bob,
      to: jane,
      value: omgAmount,
    },
    {
      kind: 1,
      proxy: 0,
      token: gnt.receipt._address,
      from: bob,
      to: jane,
      value: gntAmount,
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
  const claim = await actionsGateway.instance.methods.getOrderDataClaim(orderDataTuple).call();

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
  await zxc.instance.methods.approve(tokenProxy.receipt._address, zxcAmount).send({ from: jane });
  await cat.instance.methods.approve(nftSafeProxy.receipt._address, 3).send({ from: bob });
  await fox.instance.methods.approve(nftSafeProxy.receipt._address, 1).send({ from: bob });
  await omg.instance.methods.approve(tokenProxy.receipt._address, omgAmount).send({ from: bob });
  await gnt.instance.methods.approve(tokenProxy.receipt._address, gntAmount).send({ from: bob });
  const logs = await actionsGateway.instance.methods.perform(orderDataTuple, signatureDataTuple).send({ from: bob });
  ctx.not(logs.events.Perform, undefined);

  const cat1Owner = await cat.instance.methods.ownerOf(1).call();
  const cat3Owner = await cat.instance.methods.ownerOf(3).call();
  const dog1Owner = await dog.instance.methods.ownerOf(1).call();
  const fox1Owner = await fox.instance.methods.ownerOf(1).call();
  const janeOmgAmount = await omg.instance.methods.balanceOf(jane).call();
  const janeGntAmount = await gnt.instance.methods.balanceOf(jane).call();
  const bobZxcAmount = await zxc.instance.methods.balanceOf(bob).call();
  ctx.is(cat1Owner, bob);
  ctx.is(dog1Owner, bob);
  ctx.is(cat3Owner, jane);
  ctx.is(fox1Owner, jane);
  ctx.is(janeOmgAmount, omgAmount.toString());
  ctx.is(janeGntAmount, gntAmount.toString());
  ctx.is(bobZxcAmount, zxcAmount.toString());
});

spec.test('Cat #1, Dog #1 <=> Cat #3, Fox #1 => 40 ZXC', async (ctx) => {
  const actionsGateway = ctx.get('actionsGateway');
  const nftSafeProxy = ctx.get('nftSafeProxy');
  const tokenProxy = ctx.get('tokenProxy');
  const jane = ctx.get('jane');
  const sara = ctx.get('sara');
  const bob = ctx.get('bob');
  const cat = ctx.get('cat');
  const dog = ctx.get('dog');
  const fox = ctx.get('fox');
  const zxc = ctx.get('zxc');
  const zxcAmount = 40;

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
      token: dog.receipt._address,
      from: jane,
      to: bob,
      value: 1,
    },
    {
      kind: 1,
      proxy: 0,
      token: zxc.receipt._address,
      from: jane,
      to: sara,
      value: zxcAmount,
    },
    {
      kind: 1,
      proxy: 1,
      token: cat.receipt._address,
      from: bob,
      to: jane,
      value: 3,
    },
    {
      kind: 1,
      proxy: 1,
      token: fox.receipt._address,
      from: bob,
      to: jane,
      value: 1,
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
  const claim = await actionsGateway.instance.methods.getOrderDataClaim(orderDataTuple).call();

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
  await zxc.instance.methods.approve(tokenProxy.receipt._address, zxcAmount).send({ from: jane });
  await cat.instance.methods.approve(nftSafeProxy.receipt._address, 3).send({ from: bob });
  await fox.instance.methods.approve(nftSafeProxy.receipt._address, 1).send({ from: bob });
  const logs = await actionsGateway.instance.methods.perform(orderDataTuple, signatureDataTuple).send({ from: bob });
  ctx.not(logs.events.Perform, undefined);

  const cat1Owner = await cat.instance.methods.ownerOf(1).call();
  const cat3Owner = await cat.instance.methods.ownerOf(3).call();
  const dog1Owner = await dog.instance.methods.ownerOf(1).call();
  const fox1Owner = await fox.instance.methods.ownerOf(1).call();
  const saraZxcAmount = await zxc.instance.methods.balanceOf(sara).call();
  ctx.is(cat1Owner, bob);
  ctx.is(dog1Owner, bob);
  ctx.is(cat3Owner, jane);
  ctx.is(fox1Owner, jane);
  ctx.is(saraZxcAmount, zxcAmount.toString());
});

export default spec;
