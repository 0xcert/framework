import { AbilitableManageProxyAbilities, TokenTransferProxyAbilities } from '@0xcert/ethereum-proxy-contracts/src/core/types';
import { XcertAbilities } from '@0xcert/ethereum-xcert-contracts/src/core/types';
import { Spec } from '@specron/spec';
import { OrderGatewayAbilities } from '../../../core/types';
import * as common from '../../helpers/common';

/**
 * Test definition.
 * ERC20: ZXC
 * ERC721: Cat
 */

interface Data {
  orderGateway?: any;
  tokenProxy?: any;
  abilitableManageProxy?: any;
  cat?: any;
  owner?: string;
  jane?: string;
  sara?: string;
  zxc?: any;
}

const spec = new Spec<Data>();

spec.before(async (ctx) => {
  const accounts = await ctx.web3.eth.getAccounts();
  ctx.set('owner', accounts[0]);
  ctx.set('jane', accounts[1]);
  ctx.set('sara', accounts[2]);
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
  const abilitableManageProxy = await ctx.deploy({
    src: '@0xcert/ethereum-proxy-contracts/build/abilitable-manage-proxy.json',
    contract: 'AbilitableManageProxy',
  });
  ctx.set('abilitableManageProxy', abilitableManageProxy);
});

spec.beforeEach(async (ctx) => {
  const tokenProxy = ctx.get('tokenProxy');
  const abilitableManageProxy = ctx.get('abilitableManageProxy');
  const owner = ctx.get('owner');
  const orderGateway = await ctx.deploy({
    src: './build/order-gateway.json',
    contract: 'OrderGateway',
  });
  await orderGateway.instance.methods.grantAbilities(owner, OrderGatewayAbilities.SET_PROXIES).send();
  await orderGateway.instance.methods.addProxy(tokenProxy.receipt._address).send({ from: owner });
  await orderGateway.instance.methods.addProxy(abilitableManageProxy.receipt._address).send({ from: owner });
  ctx.set('orderGateway', orderGateway);
});

spec.beforeEach(async (ctx) => {
  const tokenProxy = ctx.get('tokenProxy');
  const orderGateway = ctx.get('orderGateway');
  const owner = ctx.get('owner');
  const abilitableManageProxy = ctx.get('abilitableManageProxy');
  await tokenProxy.instance.methods.grantAbilities(orderGateway.receipt._address, TokenTransferProxyAbilities.EXECUTE).send({ from: owner });
  await abilitableManageProxy.instance.methods.grantAbilities(orderGateway.receipt._address, AbilitableManageProxyAbilities.EXECUTE).send({ from: owner });
});

spec.test('fails if msg.sender is not the receiver', async (ctx) => {
  const orderGateway = ctx.get('orderGateway');
  const zxc = ctx.get('zxc');
  const abilitableManageProxy = ctx.get('abilitableManageProxy');
  const tokenProxy = ctx.get('tokenProxy');
  const jane = ctx.get('jane');
  const sara = ctx.get('sara');
  const owner = ctx.get('owner');
  const cat = ctx.get('cat');

  const actions = [
    {
      kind: 3,
      proxy: 1,
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

  await cat.instance.methods.grantAbilities(abilitableManageProxy.receipt._address, XcertAbilities.MANAGE_ABILITIES).send({ from: owner });
  await zxc.instance.methods.approve(tokenProxy.receipt._address, 5000).send({ from: jane });
  await ctx.reverts(() => orderGateway.instance.methods.perform(createTuple, signatureDataTuple).send({ from: sara }), '015003');
});

spec.test('fails when trying to perform already performed order', async (ctx) => {
  const orderGateway = ctx.get('orderGateway');
  const zxc = ctx.get('zxc');
  const abilitableManageProxy = ctx.get('abilitableManageProxy');
  const tokenProxy = ctx.get('tokenProxy');
  const jane = ctx.get('jane');
  const sara = ctx.get('sara');
  const owner = ctx.get('owner');
  const cat = ctx.get('cat');

  const actions = [
    {
      kind: 3,
      proxy: 1,
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

  await cat.instance.methods.grantAbilities(abilitableManageProxy.receipt._address, XcertAbilities.MANAGE_ABILITIES).send({ from: owner });
  await zxc.instance.methods.approve(tokenProxy.receipt._address, 5000).send({ from: jane });
  await orderGateway.instance.methods.perform(createTuple, signatureDataTuple).send({ from: jane });
  await ctx.reverts(() => orderGateway.instance.methods.perform(createTuple, signatureDataTuple).send({ from: jane }), '015008');
});

spec.test('fails when approved token value is not sufficient', async (ctx) => {
  const orderGateway = ctx.get('orderGateway');
  const zxc = ctx.get('zxc');
  const abilitableManageProxy = ctx.get('abilitableManageProxy');
  const tokenProxy = ctx.get('tokenProxy');
  const jane = ctx.get('jane');
  const owner = ctx.get('owner');
  const cat = ctx.get('cat');

  const actions = [
    {
      kind: 3,
      proxy: 1,
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

  await cat.instance.methods.grantAbilities(abilitableManageProxy.receipt._address, XcertAbilities.MANAGE_ABILITIES).send({ from: owner });
  await zxc.instance.methods.approve(tokenProxy.receipt._address, 4999).send({ from: jane });
  await ctx.reverts(() => orderGateway.instance.methods.perform(createTuple, signatureDataTuple).send({ from: jane }), '001002');
});

spec.test('fails when proxy does not have the manage ability rights', async (ctx) => {
  const orderGateway = ctx.get('orderGateway');
  const zxc = ctx.get('zxc');
  const tokenProxy = ctx.get('tokenProxy');
  const jane = ctx.get('jane');
  const owner = ctx.get('owner');
  const cat = ctx.get('cat');

  const actions = [
    {
      kind: 3,
      proxy: 1,
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

  await zxc.instance.methods.approve(tokenProxy.receipt._address, 5000).send({ from: jane });
  await ctx.reverts(() => orderGateway.instance.methods.perform(createTuple, signatureDataTuple).send({ from: jane }), '017001');
});

spec.test('fails if current time is after expirationTimestamp', async (ctx) => {
  const orderGateway = ctx.get('orderGateway');
  const zxc = ctx.get('zxc');
  const abilitableManageProxy = ctx.get('abilitableManageProxy');
  const tokenProxy = ctx.get('tokenProxy');
  const jane = ctx.get('jane');
  const owner = ctx.get('owner');
  const cat = ctx.get('cat');

  const actions = [
    {
      kind: 3,
      proxy: 1,
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
  ];
  const orderData = {
    from: owner,
    to: jane,
    actions,
    seed: common.getCurrentTime(),
    expirationTimestamp: common.getCurrentTime() - 1000,
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

  await cat.instance.methods.grantAbilities(abilitableManageProxy.receipt._address, XcertAbilities.MANAGE_ABILITIES).send({ from: owner });
  await zxc.instance.methods.approve(tokenProxy.receipt._address, 5000).send({ from: jane });
  await ctx.reverts(() => orderGateway.instance.methods.perform(createTuple, signatureDataTuple).send({ from: jane }), '015005');
});

spec.test('fails if maker does not have allow manage ability', async (ctx) => {
  const orderGateway = ctx.get('orderGateway');
  const zxc = ctx.get('zxc');
  const abilitableManageProxy = ctx.get('abilitableManageProxy');
  const tokenProxy = ctx.get('tokenProxy');
  const jane = ctx.get('jane');
  const owner = ctx.get('owner');
  const cat = ctx.get('cat');

  const actions = [
    {
      kind: 3,
      proxy: 1,
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

  await cat.instance.methods.revokeAbilities(owner, XcertAbilities.ALLOW_MANAGE_ABILITIES).send({ from: owner });
  await cat.instance.methods.grantAbilities(abilitableManageProxy.receipt._address, XcertAbilities.MANAGE_ABILITIES).send({ from: owner });
  await zxc.instance.methods.approve(tokenProxy.receipt._address, 5000).send({ from: jane });
  await ctx.reverts(() => orderGateway.instance.methods.perform(createTuple, signatureDataTuple).send({ from: jane }), '015010');
});

export default spec;
