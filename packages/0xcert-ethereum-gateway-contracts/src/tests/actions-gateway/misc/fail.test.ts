import { TokenTransferProxyAbilities } from '@0xcert/ethereum-proxy-contracts/src/core/types';
import { Spec } from '@specron/spec';
import { ActionsGatewayAbilities } from '../../../core/types';
import * as common from '../../helpers/common';
import { getSignature } from '../../helpers/signature';

/**
 * Test definition.
 *
 * ERC20: ZXC
 * ERC-721: Cat
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
});

/**
 * ZXC
 * Bob owns: all
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

spec.test('when current time is after expirationTimestamp', async (ctx) => {
  const actionsGateway = ctx.get('actionsGateway');
  const tokenProxy = ctx.get('tokenProxy');
  const jane = ctx.get('jane');
  const bob = ctx.get('bob');
  const zxc = ctx.get('zxc');
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
    expiration: common.getCurrentTime() - 600,
  };
  const orderDataTuple = ctx.tuple(orderData);
  const claim = await actionsGateway.instance.methods.getOrderDataClaim(orderDataTuple).call();

  const signature = await getSignature(ctx.web3, claim, jane);
  const signatureDataTuple = ctx.tuple([signature]);

  await zxc.instance.methods.approve(tokenProxy.receipt._address, zxcAmountHex).send({ from: jane });
  await ctx.reverts(() => actionsGateway.instance.methods.perform(orderDataTuple, signatureDataTuple).send({ from: bob }), '015004');
});

spec.test('when signature is invalid', async (ctx) => {
  const actionsGateway = ctx.get('actionsGateway');
  const tokenProxy = ctx.get('tokenProxy');
  const jane = ctx.get('jane');
  const bob = ctx.get('bob');
  const zxc = ctx.get('zxc');
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
  let orderDataTuple = ctx.tuple(orderData);
  const claim = await actionsGateway.instance.methods.getOrderDataClaim(orderDataTuple).call();
  orderData.actions[0].proxyId = 1;
  orderDataTuple = ctx.tuple(orderData);
  const signature = await getSignature(ctx.web3, claim, jane);
  const signatureDataTuple = ctx.tuple([signature]);

  await zxc.instance.methods.approve(tokenProxy.receipt._address, zxcAmountHex).send({ from: jane });
  await ctx.reverts(() => actionsGateway.instance.methods.perform(orderDataTuple, signatureDataTuple).send({ from: bob }), '015005');
});

spec.test('trying to perform an alredy pefromed swap', async (ctx) => {
  const actionsGateway = ctx.get('actionsGateway');
  const tokenProxy = ctx.get('tokenProxy');
  const jane = ctx.get('jane');
  const bob = ctx.get('bob');
  const zxc = ctx.get('zxc');
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
  await actionsGateway.instance.methods.perform(orderDataTuple, signatureDataTuple).send({ from: bob });
  await ctx.reverts(() => actionsGateway.instance.methods.perform(orderDataTuple, signatureDataTuple).send({ from: bob }), '015007');
});

export default spec;
