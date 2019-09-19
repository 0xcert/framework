import { AbilitableManageProxyAbilities, NFTokenSafeTransferProxyAbilities,
  TokenTransferProxyAbilities, XcertCreateProxyAbilities, XcertUpdateProxyAbilities } from '@0xcert/ethereum-proxy-contracts/src/core/types';
import { XcertAbilities } from '@0xcert/ethereum-xcert-contracts/src/core/types';
import { Spec } from '@specron/spec';
import { OrderGatewayAbilities } from '../../../core/types';
import * as common from '../../helpers/common';

/**
 * Test definition.
 * ERC20: ZXC, BNB
 * ERC721: Cat, Dog, Fox
 */

interface Data {
  orderGateway?: any;
  tokenProxy?: any;
  nftSafeProxy?: any;
  createProxy?: any;
  updateProxy?: any;
  abilitableManageProxy?: any;
  cat?: any;
  dog?: any;
  owner?: string;
  jane?: string;
  sara?: string;
  zxc?: any;
  id1?: string;
  id2?: string;
  id3?: string;
  imprint1?: string;
  imprint2?: string;
  imprint3?: string;
}

const spec = new Spec<Data>();

spec.before(async (ctx) => {
  const accounts = await ctx.web3.eth.getAccounts();
  ctx.set('owner', accounts[0]);
  ctx.set('jane', accounts[1]);
  ctx.set('sara', accounts[2]);
});

spec.before(async (ctx) => {
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
  const cat = await ctx.deploy({
    src: '@0xcert/ethereum-xcert-contracts/build/xcert-mock.json',
    contract: 'XcertMock',
    args: ['cat', 'CAT', 'https://0xcert.org/', '.json', '0xa65de9e6', []],
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
    args: ['dog', 'DOG', 'https://0xcert.org/', '.json', '0xa65de9e6', ['0xbda0e852']],
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
  const createProxy = await ctx.deploy({
    src: '@0xcert/ethereum-proxy-contracts/build/xcert-create-proxy.json',
    contract: 'XcertCreateProxy',
  });
  ctx.set('createProxy', createProxy);
});

spec.beforeEach(async (ctx) => {
  const updateProxy = await ctx.deploy({
    src: '@0xcert/ethereum-proxy-contracts/build/xcert-update-proxy.json',
    contract: 'XcertUpdateProxy',
  });
  ctx.set('updateProxy', updateProxy);
});

spec.beforeEach(async (ctx) => {
  const abilitableManageProxy = await ctx.deploy({
    src: '@0xcert/ethereum-proxy-contracts/build/abilitable-manage-proxy.json',
    contract: 'AbilitableManageProxy',
  });
  ctx.set('abilitableManageProxy', abilitableManageProxy);
});

spec.beforeEach(async (ctx) => {
  const tokenProxy = ctx.get('tokenProxy');
  const nftSafeProxy = ctx.get('nftSafeProxy');
  const createProxy = ctx.get('createProxy');
  const updateProxy = ctx.get('updateProxy');
  const abilitableManageProxy = ctx.get('abilitableManageProxy');
  const owner = ctx.get('owner');
  const orderGateway = await ctx.deploy({
    src: './build/order-gateway.json',
    contract: 'OrderGateway',
  });
  await orderGateway.instance.methods.grantAbilities(owner, OrderGatewayAbilities.SET_PROXIES).send();
  await orderGateway.instance.methods.addProxy(tokenProxy.receipt._address).send({ from: owner });
  await orderGateway.instance.methods.addProxy(nftSafeProxy.receipt._address).send({ from: owner });
  await orderGateway.instance.methods.addProxy(createProxy.receipt._address).send({ from: owner });
  await orderGateway.instance.methods.addProxy(abilitableManageProxy.receipt._address).send({ from: owner });
  await orderGateway.instance.methods.addProxy(updateProxy.receipt._address).send({ from: owner });
  ctx.set('orderGateway', orderGateway);
});

spec.beforeEach(async (ctx) => {
  const tokenProxy = ctx.get('tokenProxy');
  const nftSafeProxy = ctx.get('nftSafeProxy');
  const orderGateway = ctx.get('orderGateway');
  const owner = ctx.get('owner');
  const createProxy = ctx.get('createProxy');
  const abilitableManageProxy = ctx.get('abilitableManageProxy');
  const updateProxy = ctx.get('updateProxy');
  await tokenProxy.instance.methods.grantAbilities(orderGateway.receipt._address, TokenTransferProxyAbilities.EXECUTE).send({ from: owner });
  await nftSafeProxy.instance.methods.grantAbilities(orderGateway.receipt._address, NFTokenSafeTransferProxyAbilities.EXECUTE).send({ from: owner });
  await createProxy.instance.methods.grantAbilities(orderGateway.receipt._address, XcertCreateProxyAbilities.EXECUTE).send({ from: owner });
  await abilitableManageProxy.instance.methods.grantAbilities(orderGateway.receipt._address, AbilitableManageProxyAbilities.EXECUTE).send({ from: owner });
  await updateProxy.instance.methods.grantAbilities(orderGateway.receipt._address, XcertUpdateProxyAbilities.EXECUTE).send({ from: owner });
});

spec.test('Successfully sets ability', async (ctx) => {
  const orderGateway = ctx.get('orderGateway');
  const abilitableManageProxy = ctx.get('abilitableManageProxy');
  const jane = ctx.get('jane');
  const owner = ctx.get('owner');
  const cat = ctx.get('cat');

  const actions = [
    {
      kind: 3,
      proxy: 3,
      token: cat.receipt._address,
      param1: '0x0',
      to: jane,
      value: XcertAbilities.CREATE_ASSET,
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

  let janeCreateAsset = await cat.instance.methods.isAble(jane, XcertAbilities.CREATE_ASSET).call();
  ctx.false(janeCreateAsset);

  await cat.instance.methods.grantAbilities(abilitableManageProxy.receipt._address, XcertAbilities.MANAGE_ABILITIES).send({ from: owner });
  const logs = await orderGateway.instance.methods.perform(createTuple, signatureDataTuple).send({ from: jane });
  ctx.not(logs.events.Perform, undefined);

  janeCreateAsset = await cat.instance.methods.isAble(jane, XcertAbilities.CREATE_ASSET).call();
  ctx.true(janeCreateAsset);
});

spec.test('Successfully removes own manage ability', async (ctx) => {
  const orderGateway = ctx.get('orderGateway');
  const abilitableManageProxy = ctx.get('abilitableManageProxy');
  const jane = ctx.get('jane');
  const owner = ctx.get('owner');
  const cat = ctx.get('cat');

  const actions = [
    {
      kind: 3,
      proxy: 3,
      token: cat.receipt._address,
      param1: '0x0',
      to: owner,
      value: 0,
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

  let ownerManageAbilitites = await cat.instance.methods.isAble(owner, XcertAbilities.MANAGE_ABILITIES).call();
  ctx.true(ownerManageAbilitites);

  await cat.instance.methods.grantAbilities(abilitableManageProxy.receipt._address, XcertAbilities.MANAGE_ABILITIES).send({ from: owner });
  const logs = await orderGateway.instance.methods.perform(createTuple, signatureDataTuple).send({ from: jane });
  ctx.not(logs.events.Perform, undefined);

  ownerManageAbilitites = await cat.instance.methods.isAble(owner, XcertAbilities.MANAGE_ABILITIES).call();
  ctx.false(ownerManageAbilitites);
});

spec.test('Successfully sets multiple abilities', async (ctx) => {
  const orderGateway = ctx.get('orderGateway');
  const abilitableManageProxy = ctx.get('abilitableManageProxy');
  const jane = ctx.get('jane');
  const owner = ctx.get('owner');
  const cat = ctx.get('cat');
  const dog = ctx.get('dog');

  const actions = [
    {
      kind: 3,
      proxy: 3,
      token: cat.receipt._address,
      param1: '0x0',
      to: jane,
      value: XcertAbilities.CREATE_ASSET + XcertAbilities.REVOKE_ASSET,
    },
    {
      kind: 3,
      proxy: 3,
      token: dog.receipt._address,
      param1: '0x0',
      to: jane,
      value: XcertAbilities.UPDATE_URI_BASE,
    },
    {
      kind: 3,
      proxy: 3,
      token: cat.receipt._address,
      param1: '0x0',
      to: owner,
      value: XcertAbilities.MANAGE_ABILITIES,
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

  let janeCatCreateAsset = await cat.instance.methods.isAble(jane, XcertAbilities.CREATE_ASSET).call();
  let janeCatRevokeAsset = await cat.instance.methods.isAble(jane, XcertAbilities.REVOKE_ASSET).call();
  let janeDogUpdateUriBase = await dog.instance.methods.isAble(jane, XcertAbilities.UPDATE_URI_BASE).call();
  let ownerCatAllowManageAbilitites = await cat.instance.methods.isAble(owner, XcertAbilities.ALLOW_MANAGE_ABILITIES).call();
  ctx.false(janeCatCreateAsset);
  ctx.false(janeCatRevokeAsset);
  ctx.false(janeDogUpdateUriBase);
  ctx.true(ownerCatAllowManageAbilitites);

  await cat.instance.methods.grantAbilities(abilitableManageProxy.receipt._address, XcertAbilities.MANAGE_ABILITIES).send({ from: owner });
  await dog.instance.methods.grantAbilities(abilitableManageProxy.receipt._address, XcertAbilities.MANAGE_ABILITIES).send({ from: owner });
  const logs = await orderGateway.instance.methods.perform(createTuple, signatureDataTuple).send({ from: jane });
  ctx.not(logs.events.Perform, undefined);

  janeCatCreateAsset = await cat.instance.methods.isAble(jane, XcertAbilities.CREATE_ASSET).call();
  janeCatRevokeAsset = await cat.instance.methods.isAble(jane, XcertAbilities.REVOKE_ASSET).call();
  janeDogUpdateUriBase = await dog.instance.methods.isAble(jane, XcertAbilities.UPDATE_URI_BASE).call();
  ownerCatAllowManageAbilitites = await cat.instance.methods.isAble(owner, XcertAbilities.ALLOW_MANAGE_ABILITIES).call();
  ctx.true(janeCatCreateAsset);
  ctx.true(janeCatRevokeAsset);
  ctx.true(janeDogUpdateUriBase);
  ctx.false(ownerCatAllowManageAbilitites);
});

spec.test('Successfully sets ability with other actions', async (ctx) => {
  const orderGateway = ctx.get('orderGateway');
  const abilitableManageProxy = ctx.get('abilitableManageProxy');
  const createProxy = ctx.get('createProxy');
  const updateProxy = ctx.get('updateProxy');
  const nftSafeProxy = ctx.get('nftSafeProxy');
  const jane = ctx.get('jane');
  const sara = ctx.get('sara');
  const zxc = ctx.get('zxc');
  const owner = ctx.get('owner');
  const cat = ctx.get('cat');
  const dog = ctx.get('dog');
  const tokenProxy = ctx.get('tokenProxy');
  const imprint1 = ctx.get('imprint1');
  const imprint2 = ctx.get('imprint2');
  const id = ctx.get('id1');
  const id2 = ctx.get('id2');

  const actions = [
    {
      kind: 3,
      proxy: 3,
      token: cat.receipt._address,
      param1: '0x0',
      to: jane,
      value: XcertAbilities.CREATE_ASSET,
    },
    {
      kind: 1,
      proxy: 0,
      token: zxc.receipt._address,
      param1: jane,
      to: owner,
      value: 5000,
    },
    {
      kind: 0,
      proxy: 2,
      token: cat.receipt._address,
      param1: imprint2,
      to: jane,
      value: id2,
    },
    {
      kind: 1,
      proxy: 1,
      token: dog.receipt._address,
      param1: jane,
      to: sara,
      value: id,
    },
    {
      kind: 2,
      proxy: 4,
      token: dog.receipt._address,
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

  let janeCreateAsset = await cat.instance.methods.isAble(jane, XcertAbilities.CREATE_ASSET).call();
  ctx.false(janeCreateAsset);

  await cat.instance.methods.grantAbilities(abilitableManageProxy.receipt._address, XcertAbilities.MANAGE_ABILITIES).send({ from: owner });
  await cat.instance.methods.grantAbilities(createProxy.receipt._address, XcertAbilities.CREATE_ASSET).send({ from: owner });
  await dog.instance.methods.grantAbilities(updateProxy.receipt._address, XcertAbilities.UPDATE_ASSET_IMPRINT).send({ from: owner });
  await dog.instance.methods.approve(nftSafeProxy.receipt._address, 1).send({ from: jane });
  await zxc.instance.methods.approve(tokenProxy.receipt._address, 5000).send({ from: jane });
  const logs = await orderGateway.instance.methods.perform(createTuple, signatureDataTuple).send({ from: jane });
  ctx.not(logs.events.Perform, undefined);

  janeCreateAsset = await cat.instance.methods.isAble(jane, XcertAbilities.CREATE_ASSET).call();
  ctx.true(janeCreateAsset);

  const ownerZxcBalance = await zxc.instance.methods.balanceOf(owner).call();
  ctx.is(ownerZxcBalance, '5000');

  const dog2Imprint = await dog.instance.methods.tokenImprint(id2).call();
  ctx.is(dog2Imprint, imprint1);

  const dog1Owner = await dog.instance.methods.ownerOf(id).call();
  ctx.is(dog1Owner, sara);

  const cat2Owner = await cat.instance.methods.ownerOf(id2).call();
  ctx.is(cat2Owner, jane);
});

export default spec;
