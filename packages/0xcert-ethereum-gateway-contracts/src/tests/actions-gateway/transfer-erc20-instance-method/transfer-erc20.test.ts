import { TokenTransferProxyAbilities } from '@0xcert/ethereum-proxy-contracts/src/core/types';
import { Spec } from '@specron/spec';
import { ActionsGatewayAbilities } from '../../../core/types';
import * as common from '../../helpers/common';
import { getSignature } from '../../helpers/signature';

/**
 * Test definition.
 *
 * ERC20: ZXC, BNB, OMG, GNT
 */

/**
 * Spec context interfaces.
 */

interface Data {
  actionsGateway?: any;
  tokenProxy?: any;
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
  const tokenProxy = ctx.get('tokenProxy');
  const owner = ctx.get('owner');
  const actionsGateway = await ctx.deploy({
    src: './build/actions-gateway.json',
    contract: 'ActionsGateway',
  });
  await actionsGateway.instance.methods.grantAbilities(owner, ActionsGatewayAbilities.SET_PROXIES).send();
  await actionsGateway.instance.methods.addProxy(tokenProxy.receipt._address, 1).send({ from: owner });
  ctx.set('actionsGateway', actionsGateway);
});

spec.beforeEach(async (ctx) => {
  const tokenProxy = ctx.get('tokenProxy');
  const actionsGateway = ctx.get('actionsGateway');
  const owner = ctx.get('owner');
  await tokenProxy.instance.methods.grantAbilities(actionsGateway.receipt._address, TokenTransferProxyAbilities.EXECUTE).send({ from: owner });
});

spec.test('transfer 3000 ZXC with signature', async (ctx) => {
  const actionsGateway = ctx.get('actionsGateway');
  const tokenProxy = ctx.get('tokenProxy');
  const jane = ctx.get('jane');
  const bob = ctx.get('bob');
  const zxc = ctx.get('zxc');
  const zxcAmountDec = 3000;
  const zxcAmountHex = '0x0000000000000000000000000000000000000000000000000000000000000BB8';

  const actions = [
    {
      proxyId: 0,
      contractAddress: zxc.receipt._address,
      params: `${zxcAmountHex}${bob.substring(2)}00`,
    },
  ];
  const orderData = {
    signers: [jane],
    actions,
    seed: common.getCurrentTime(),
    expiration: common.getCurrentTime() + 600,
  };
  const orderDataTuple = ctx.tuple(orderData);
  const claim = await actionsGateway.instance.methods.getOrderDataClaim(orderDataTuple).call();

  const signature = await getSignature(ctx.web3, claim, jane);
  const signatureDataTuple = ctx.tuple([signature]);

  await zxc.instance.methods.approve(tokenProxy.receipt._address, zxcAmountHex).send({ from: jane });
  const logs = await actionsGateway.instance.methods.perform(orderDataTuple, signatureDataTuple).send({ from: bob });
  ctx.not(logs.events.Perform, undefined);

  const bobBalance = await zxc.instance.methods.balanceOf(bob).call();
  ctx.is(bobBalance, zxcAmountDec.toString());
});

spec.test('transfer 3000 ZXC without signature', async (ctx) => {
  const actionsGateway = ctx.get('actionsGateway');
  const tokenProxy = ctx.get('tokenProxy');
  const jane = ctx.get('jane');
  const bob = ctx.get('bob');
  const zxc = ctx.get('zxc');
  const zxcAmountDec = 3000;
  const zxcAmountHex = '0x0000000000000000000000000000000000000000000000000000000000000BB8';

  const actions = [
    {
      proxyId: 0,
      contractAddress: zxc.receipt._address,
      params: `${zxcAmountHex}${bob.substring(2)}00`,
    },
  ];
  const orderData = {
    signers: [jane],
    actions,
    seed: common.getCurrentTime(),
    expiration: common.getCurrentTime() + 600,
  };
  const orderDataTuple = ctx.tuple(orderData);

  const signatureDataTuple = ctx.tuple([]);

  await zxc.instance.methods.approve(tokenProxy.receipt._address, zxcAmountHex).send({ from: jane });
  const logs = await actionsGateway.instance.methods.perform(orderDataTuple, signatureDataTuple).send({ from: jane });
  ctx.not(logs.events.Perform, undefined);

  const bobBalance = await zxc.instance.methods.balanceOf(bob).call();
  ctx.is(bobBalance, zxcAmountDec.toString());
});

spec.test('transfer 3000 ZXC with any taker', async (ctx) => {
  const actionsGateway = ctx.get('actionsGateway');
  const tokenProxy = ctx.get('tokenProxy');
  const jane = ctx.get('jane');
  const bob = ctx.get('bob');
  const zxc = ctx.get('zxc');
  const zeroAddress = ctx.get('zeroAddress');
  const zxcAmountDec = 3000;
  const zxcAmountHex = '0x0000000000000000000000000000000000000000000000000000000000000BB8';

  const actions = [
    {
      proxyId: 0,
      contractAddress: zxc.receipt._address,
      params: `${zxcAmountHex}${zeroAddress.substring(2)}00`,
    },
  ];
  const orderData = {
    signers: [jane, zeroAddress],
    actions,
    seed: common.getCurrentTime(),
    expiration: common.getCurrentTime() + 600,
  };

  const orderDataTuple = ctx.tuple(orderData);
  const claim = await actionsGateway.instance.methods.getOrderDataClaim(orderDataTuple).call();

  const signature = await getSignature(ctx.web3, claim, jane);
  const signatureDataTuple = ctx.tuple([signature]);

  await zxc.instance.methods.approve(tokenProxy.receipt._address, zxcAmountHex).send({ from: jane });
  const logs = await actionsGateway.instance.methods.perform(orderDataTuple, signatureDataTuple).send({ from: bob });
  ctx.not(logs.events.Perform, undefined);

  const bobBalance = await zxc.instance.methods.balanceOf(bob).call();
  ctx.is(bobBalance, zxcAmountDec.toString());
});

spec.test('transfer 3000 ZXC with any signer', async (ctx) => {
  const actionsGateway = ctx.get('actionsGateway');
  const tokenProxy = ctx.get('tokenProxy');
  const jane = ctx.get('jane');
  const bob = ctx.get('bob');
  const sara = ctx.get('sara');
  const zxc = ctx.get('zxc');
  const zeroAddress = ctx.get('zeroAddress');
  const zxcAmountDec = 3000;
  const zxcAmountHex = '0x0000000000000000000000000000000000000000000000000000000000000BB8';

  const actions = [
    {
      proxyId: 0,
      contractAddress: zxc.receipt._address,
      params: `${zxcAmountHex}${zeroAddress.substring(2)}00`,
    },
  ];
  const orderData = {
    signers: [jane, zeroAddress],
    actions,
    seed: common.getCurrentTime(),
    expiration: common.getCurrentTime() + 600,
  };

  const orderDataTuple = ctx.tuple(orderData);
  const claim = await actionsGateway.instance.methods.getOrderDataClaim(orderDataTuple).call();

  const signature = await getSignature(ctx.web3, claim, jane);
  const signature2 = await getSignature(ctx.web3, claim, bob);
  const signatureDataTuple = ctx.tuple([signature, signature2]);

  await zxc.instance.methods.approve(tokenProxy.receipt._address, zxcAmountHex).send({ from: jane });
  const logs = await actionsGateway.instance.methods.perform(orderDataTuple, signatureDataTuple).send({ from: sara });
  ctx.not(logs.events.Perform, undefined);

  const bobBalance = await zxc.instance.methods.balanceOf(bob).call();
  ctx.is(bobBalance, zxcAmountDec.toString());
});

export default spec;
