import { NFTokenSafeTransferProxyAbilities, TokenTransferProxyAbilities,
  XcertUpdateProxyAbilities } from '@0xcert/ethereum-proxy-contracts/src/core/types';
import { XcertAbilities } from '@0xcert/ethereum-xcert-contracts/src/core/types';
import { Spec } from '@specron/spec';
import { OrderGatewayAbilities } from '../core/types';
import * as common from './helpers/common';

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
const perform = new Spec<Data>();
const cancel = new Spec<Data>();

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
    args: ['cat', 'CAT', 'http://0xcert.org/', '0xa65de9e6', ['0xbda0e852']],
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
  const dog = await ctx.deploy({
    src: '@0xcert/ethereum-xcert-contracts/build/xcert-mock.json',
    contract: 'XcertMock',
    args: ['dog', 'DOG', 'http://0xcert.org/', '0xa65de9e6', ['0xbda0e852']],
  });
  await dog.instance.methods
    .create(jane, 1, '0x0')
    .send({
      from: owner,
    });
  await dog.instance.methods
    .create(jane, 2, '0x0')
    .send({
      from: owner,
    });
  await dog.instance.methods
    .create(jane, 3, '0x0')
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
    args: ['fox', 'FOX', 'http://0xcert.org/', '0xa65de9e6', ['0xbda0e852']],
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
  const tokenProxy = ctx.get('tokenProxy');
  const nftSafeProxy = ctx.get('nftSafeProxy');
  const updateProxy = ctx.get('updateProxy');
  const owner = ctx.get('owner');
  const orderGateway = await ctx.deploy({
    src: './build/order-gateway.json',
    contract: 'OrderGateway',
  });
  await orderGateway.instance.methods.grantAbilities(owner, OrderGatewayAbilities.SET_PROXIES).send();
  await orderGateway.instance.methods.setProxy(0, tokenProxy.receipt._address).send({ from: owner });
  await orderGateway.instance.methods.setProxy(1, nftSafeProxy.receipt._address).send({ from: owner });
  await orderGateway.instance.methods.setProxy(2, updateProxy.receipt._address).send({ from: owner });
  ctx.set('orderGateway', orderGateway);
});

spec.beforeEach(async (ctx) => {
  const tokenProxy = ctx.get('tokenProxy');
  const nftSafeProxy = ctx.get('nftSafeProxy');
  const orderGateway = ctx.get('orderGateway');
  const owner = ctx.get('owner');
  const updateProxy = ctx.get('updateProxy');
  await tokenProxy.instance.methods.grantAbilities(orderGateway.receipt._address, TokenTransferProxyAbilities.EXECUTE).send({ from: owner });
  await nftSafeProxy.instance.methods.grantAbilities(orderGateway.receipt._address, NFTokenSafeTransferProxyAbilities.EXECUTE).send({ from: owner });
  await updateProxy.instance.methods.grantAbilities(orderGateway.receipt._address, XcertUpdateProxyAbilities.EXECUTE).send({ from: owner });
});

/**
 * Perform create.
 */

spec.spec('perform an atomic update', perform);

perform.only('Cat #1', async (ctx) => {
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

export default spec;
