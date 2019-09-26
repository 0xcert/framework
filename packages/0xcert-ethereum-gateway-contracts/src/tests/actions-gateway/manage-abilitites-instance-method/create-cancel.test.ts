import { TokenTransferProxyAbilities, XcertCreateProxyAbilities } from '@0xcert/ethereum-proxy-contracts/src/core/types';
import { XcertAbilities } from '@0xcert/ethereum-xcert-contracts/src/core/types';
import { Spec } from '@specron/spec';
import { ActionsGatewayAbilities } from '../../../core/types';
import * as common from '../../helpers/common';

/**
 * Test definition.
 * ERC20: ZXC
 * ERC721: Cat
 */

interface Data {
  actionsGateway?: any;
  tokenProxy?: any;
  abilitableManageProxy?: any;
  cat?: any;
  owner?: string;
  jane?: string;
  zxc?: any;
  id1?: string;
  imprint1?: string;
}

const spec = new Spec<Data>();

spec.before(async (ctx) => {
  const accounts = await ctx.web3.eth.getAccounts();
  ctx.set('owner', accounts[0]);
  ctx.set('jane', accounts[2]);
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
  const actionsGateway = await ctx.deploy({
    src: './build/actions-gateway.json',
    contract: 'ActionsGateway',
  });
  await actionsGateway.instance.methods.grantAbilities(owner, ActionsGatewayAbilities.SET_PROXIES).send();
  await actionsGateway.instance.methods.addProxy(tokenProxy.receipt._address).send({ from: owner });
  await actionsGateway.instance.methods.addProxy(abilitableManageProxy.receipt._address).send({ from: owner });
  ctx.set('actionsGateway', actionsGateway);
});

spec.beforeEach(async (ctx) => {
  const tokenProxy = ctx.get('tokenProxy');
  const actionsGateway = ctx.get('actionsGateway');
  const owner = ctx.get('owner');
  const abilitableManageProxy = ctx.get('abilitableManageProxy');
  await tokenProxy.instance.methods.grantAbilities(actionsGateway.receipt._address, TokenTransferProxyAbilities.EXECUTE).send({ from: owner });
  await abilitableManageProxy.instance.methods.grantAbilities(actionsGateway.receipt._address, XcertCreateProxyAbilities.EXECUTE).send({ from: owner });
});

spec.test('succeeds', async (ctx) => {
  const actionsGateway = ctx.get('actionsGateway');
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

  const claim = await actionsGateway.instance.methods.getOrderDataClaim(createTuple).call();

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
  const logs = await actionsGateway.instance.methods.cancel(createTuple).send({ from: owner });
  ctx.not(logs.events.Cancel, undefined);
  await ctx.reverts(() => actionsGateway.instance.methods.perform(createTuple, signatureDataTuple).send({ from: jane }), '015007');
});

spec.test('fails when a third party tries to cancel it', async (ctx) => {
  const actionsGateway = ctx.get('actionsGateway');
  const zxc = ctx.get('zxc');
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

  await ctx.reverts(() => actionsGateway.instance.methods.cancel(createTuple).send({ from: jane }), '015009');
});

spec.test('fails when trying to cancel an already performed creation', async (ctx) => {
  const actionsGateway = ctx.get('actionsGateway');
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

  const claim = await actionsGateway.instance.methods.getOrderDataClaim(createTuple).call();

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
  await actionsGateway.instance.methods.perform(createTuple, signatureDataTuple).send({ from: jane });
  await ctx.reverts(() => actionsGateway.instance.methods.cancel(createTuple).send({ from: owner }), '015008');
});

export default spec;
