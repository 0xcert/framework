import { TokenTransferProxyAbilities, XcertCreateProxyAbilities } from '@0xcert/ethereum-proxy-contracts/src/core/types';
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
  createProxy?: any;
  cat?: any;
  owner?: string;
  jane?: string;
  zeroAddress?: string;
  zxc?: any;
  id1?: string;
  imprint1?: string;
}

const spec = new Spec<Data>();

spec.before(async (ctx) => {
  const accounts = await ctx.web3.eth.getAccounts();
  ctx.set('owner', accounts[0]);
  ctx.set('jane', accounts[2]);
  ctx.set('zeroAddress', '0x0000000000000000000000000000000000000000');
});

spec.before(async (ctx) => {
  ctx.set('id1', '1');
  ctx.set('imprint1', '0x1e205550c221490347e5e2393a02e94d284bbe9903f023ba098355b8d75974c8');
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
  const createProxy = await ctx.deploy({
    src: '@0xcert/ethereum-proxy-contracts/build/xcert-create-proxy.json',
    contract: 'XcertCreateProxy',
  });
  ctx.set('createProxy', createProxy);
});

spec.beforeEach(async (ctx) => {
  const tokenProxy = ctx.get('tokenProxy');
  const createProxy = ctx.get('createProxy');
  const owner = ctx.get('owner');
  const orderGateway = await ctx.deploy({
    src: './build/order-gateway.json',
    contract: 'OrderGateway',
  });
  await orderGateway.instance.methods.grantAbilities(owner, OrderGatewayAbilities.SET_PROXIES).send();
  await orderGateway.instance.methods.addProxy(tokenProxy.receipt._address).send({ from: owner });
  await orderGateway.instance.methods.addProxy(createProxy.receipt._address).send({ from: owner });
  ctx.set('orderGateway', orderGateway);
});

spec.beforeEach(async (ctx) => {
  const tokenProxy = ctx.get('tokenProxy');
  const orderGateway = ctx.get('orderGateway');
  const owner = ctx.get('owner');
  const createProxy = ctx.get('createProxy');
  await tokenProxy.instance.methods.grantAbilities(orderGateway.receipt._address, TokenTransferProxyAbilities.EXECUTE).send({ from: owner });
  await createProxy.instance.methods.grantAbilities(orderGateway.receipt._address, XcertCreateProxyAbilities.EXECUTE).send({ from: owner });
});

spec.test('succeeds', async (ctx) => {
  const orderGateway = ctx.get('orderGateway');
  const zxc = ctx.get('zxc');
  const createProxy = ctx.get('createProxy');
  const tokenProxy = ctx.get('tokenProxy');
  const jane = ctx.get('jane');
  const zeroAddress = ctx.get('zeroAddress');
  const owner = ctx.get('owner');
  const cat = ctx.get('cat');
  const id = ctx.get('id1');
  const imprint = ctx.get('imprint1');

  const actions = [
    {
      kind: 0,
      proxy: 1,
      token: cat.receipt._address,
      param1: imprint,
      to: zeroAddress,
      value: id,
    },
    {
      kind: 1,
      proxy: 0,
      token: zxc.receipt._address,
      param1: zeroAddress,
      to: owner,
      value: 5000,
    },
  ];
  const orderData = {
    from: owner,
    to: zeroAddress,
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

  await cat.instance.methods.grantAbilities(createProxy.receipt._address, XcertAbilities.CREATE_ASSET).send({ from: owner });
  await zxc.instance.methods.approve(tokenProxy.receipt._address, 5000).send({ from: jane });
  const logs = await orderGateway.instance.methods.cancel(createTuple).send({ from: owner });
  ctx.not(logs.events.Cancel, undefined);
  await ctx.reverts(() => orderGateway.instance.methods.performAnyTaker(createTuple, signatureDataTuple).send({ from: jane }), '015007');
});

spec.test('fails when a third party tries to cancel it', async (ctx) => {
  const orderGateway = ctx.get('orderGateway');
  const zxc = ctx.get('zxc');
  const jane = ctx.get('jane');
  const owner = ctx.get('owner');
  const zeroAddress = ctx.get('zeroAddress');
  const cat = ctx.get('cat');
  const id = ctx.get('id1');
  const imprint = ctx.get('imprint1');

  const actions = [
    {
      kind: 0,
      proxy: 1,
      token: cat.receipt._address,
      param1: imprint,
      to: zeroAddress,
      value: id,
    },
    {
      kind: 1,
      proxy: 0,
      token: zxc.receipt._address,
      param1: zeroAddress,
      to: owner,
      value: 5000,
    },
  ];
  const orderData = {
    from: owner,
    to: zeroAddress,
    actions,
    seed: common.getCurrentTime(),
    expirationTimestamp: common.getCurrentTime() + 3600,
  };
  const createTuple = ctx.tuple(orderData);

  await ctx.reverts(() => orderGateway.instance.methods.cancel(createTuple).send({ from: jane }), '015009');
});

spec.test('fails when trying to cancel an already performed creation', async (ctx) => {
  const orderGateway = ctx.get('orderGateway');
  const zxc = ctx.get('zxc');
  const createProxy = ctx.get('createProxy');
  const tokenProxy = ctx.get('tokenProxy');
  const jane = ctx.get('jane');
  const owner = ctx.get('owner');
  const zeroAddress = ctx.get('zeroAddress');
  const cat = ctx.get('cat');
  const id = ctx.get('id1');
  const imprint = ctx.get('imprint1');

  const actions = [
    {
      kind: 0,
      proxy: 1,
      token: cat.receipt._address,
      param1: imprint,
      to: zeroAddress,
      value: id,
    },
    {
      kind: 1,
      proxy: 0,
      token: zxc.receipt._address,
      param1: zeroAddress,
      to: owner,
      value: 5000,
    },
  ];
  const orderData = {
    from: owner,
    to: zeroAddress,
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

  await cat.instance.methods.grantAbilities(createProxy.receipt._address, XcertAbilities.CREATE_ASSET).send({ from: owner });
  await zxc.instance.methods.approve(tokenProxy.receipt._address, 5000).send({ from: jane });
  await orderGateway.instance.methods.performAnyTaker(createTuple, signatureDataTuple).send({ from: jane });
  await ctx.reverts(() => orderGateway.instance.methods.cancel(createTuple).send({ from: owner }), '015008');
});

export default spec;
