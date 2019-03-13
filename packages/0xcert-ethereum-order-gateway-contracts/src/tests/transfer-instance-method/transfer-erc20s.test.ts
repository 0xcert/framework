import { TokenTransferProxyAbilities } from '@0xcert/ethereum-proxy-contracts/src/core/types';
import { Spec } from '@specron/spec';
import { OrderGatewayAbilities } from '../../core/types';
import * as common from '../helpers/common';

/**
 * Test definition.
 *
 * ERC20: ZXC, BNB, OMG, GNT
 */

/**
 * Spec context interfaces.
 */

interface Data {
  orderGateway?: any;
  tokenProxy?: any;
  owner?: string;
  bob?: string;
  jane?: string;
  zxc?: any;
  gnt?: any;
  bnb?: any;
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
  const tokenProxy = ctx.get('tokenProxy');
  const owner = ctx.get('owner');
  const orderGateway = await ctx.deploy({
    src: './build/order-gateway.json',
    contract: 'OrderGateway',
  });
  await orderGateway.instance.methods.grantAbilities(owner, OrderGatewayAbilities.SET_PROXIES).send();
  await orderGateway.instance.methods.setProxy(0, tokenProxy.receipt._address).send({ from: owner });
  ctx.set('orderGateway', orderGateway);
});

spec.beforeEach(async (ctx) => {
  const tokenProxy = ctx.get('tokenProxy');
  const orderGateway = ctx.get('orderGateway');
  const owner = ctx.get('owner');
  await tokenProxy.instance.methods.grantAbilities(orderGateway.receipt._address, TokenTransferProxyAbilities.EXECUTE).send({ from: owner });
});

spec.test('3000 ZXC <=> 50000 GNT', async (ctx) => {
  const orderGateway = ctx.get('orderGateway');
  const tokenProxy = ctx.get('tokenProxy');
  const jane = ctx.get('jane');
  const bob = ctx.get('bob');
  const zxc = ctx.get('zxc');
  const gnt = ctx.get('gnt');
  const zxcAmount = 3000;
  const gntAmount = 50000;

  const actions = [
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
  const claim = await orderGateway.instance.methods.getOrderDataClaim(orderDataTuple).call();

  const signature = await ctx.web3.eth.sign(claim, jane);
  const signatureData = {
    r: signature.substr(0, 66),
    s: `0x${signature.substr(66, 64)}`,
    v: parseInt(`0x${signature.substr(130, 2)}`) + 27,
    kind: 0,
  };
  const signatureDataTuple = ctx.tuple(signatureData);

  await zxc.instance.methods.approve(tokenProxy.receipt._address, zxcAmount).send({ from: jane });
  await gnt.instance.methods.approve(tokenProxy.receipt._address, gntAmount).send({ from: bob });
  const logs = await orderGateway.instance.methods.perform(orderDataTuple, signatureDataTuple).send({from: bob});
  ctx.not(logs.events.Perform, undefined);

  const bobBalance = await zxc.instance.methods.balanceOf(bob).call();
  const janeBalance = await gnt.instance.methods.balanceOf(jane).call();
  ctx.is(bobBalance, zxcAmount.toString());
  ctx.is(janeBalance, gntAmount.toString());
});

spec.test('500 ZXC, 1 BNB <=> 30 GNT, 5 OMG', async (ctx) => {
  const orderGateway = ctx.get('orderGateway');
  const tokenProxy = ctx.get('tokenProxy');
  const jane = ctx.get('jane');
  const bob = ctx.get('bob');
  const zxc = ctx.get('zxc');
  const gnt = ctx.get('gnt');
  const bnb = ctx.get('bnb');
  const omg = ctx.get('omg');
  const zxcAmount = 500;
  const gntAmount = 30;
  const bnbAmount = 1;
  const omgAmount = 5;

  const actions = [
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
      proxy: 0,
      token: bnb.receipt._address,
      from: jane,
      to: bob,
      value: bnbAmount,
    },
    {
      kind: 1,
      proxy: 0,
      token: gnt.receipt._address,
      from: bob,
      to: jane,
      value: gntAmount,
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
  const claim = await orderGateway.instance.methods.getOrderDataClaim(orderDataTuple).call();

  const signature = await ctx.web3.eth.sign(claim, jane);
  const signatureData = {
    r: signature.substr(0, 66),
    s: `0x${signature.substr(66, 64)}`,
    v: parseInt(`0x${signature.substr(130, 2)}`) + 27,
    kind: 0,
  };
  const signatureDataTuple = ctx.tuple(signatureData);

  await zxc.instance.methods.approve(tokenProxy.receipt._address, zxcAmount).send({ from: jane });
  await bnb.instance.methods.approve(tokenProxy.receipt._address, bnbAmount).send({ from: jane });
  await gnt.instance.methods.approve(tokenProxy.receipt._address, gntAmount).send({ from: bob });
  await omg.instance.methods.approve(tokenProxy.receipt._address, omgAmount).send({ from: bob });
  const logs = await orderGateway.instance.methods.perform(orderDataTuple, signatureDataTuple).send({from: bob});
  ctx.not(logs.events.Perform, undefined);

  const bobZxcBalance = await zxc.instance.methods.balanceOf(bob).call();
  const bobBnbBalance = await bnb.instance.methods.balanceOf(bob).call();
  const janeGntBalance = await gnt.instance.methods.balanceOf(jane).call();
  const janeOmgBalance = await omg.instance.methods.balanceOf(jane).call();
  ctx.is(bobZxcBalance, zxcAmount.toString());
  ctx.is(bobBnbBalance, bnbAmount.toString());
  ctx.is(janeGntBalance, gntAmount.toString());
  ctx.is(janeOmgBalance, omgAmount.toString());
});

export default spec;
