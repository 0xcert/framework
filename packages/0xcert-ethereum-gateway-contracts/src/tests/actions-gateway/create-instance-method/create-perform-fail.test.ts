import { XcertCreateProxyAbilities } from '@0xcert/ethereum-proxy-contracts/src/core/types';
import { XcertAbilities } from '@0xcert/ethereum-xcert-contracts/src/core/types';
import { Spec } from '@specron/spec';
import { ActionsGatewayAbilities } from '../../../core/types';
import * as common from '../../helpers/common';
import { getSignature } from '../../helpers/signature';

/**
 * Test definition.
 * ERC-721: Cat
 */

interface Data {
  actionsGateway?: any;
  createProxy?: any;
  cat?: any;
  owner?: string;
  jane?: string;
  sara?: string;
  id1?: string;
  digest1?: string;
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
  ctx.set('digest1', '0x1e205550c221490347e5e2393a02e94d284bbe9903f023ba098355b8d75974c8');
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

spec.beforeEach(async (ctx) => {
  const createProxy = await ctx.deploy({
    src: '@0xcert/ethereum-proxy-contracts/build/xcert-create-proxy.json',
    contract: 'XcertCreateProxy',
  });
  ctx.set('createProxy', createProxy);
});

spec.beforeEach(async (ctx) => {
  const createProxy = ctx.get('createProxy');
  const owner = ctx.get('owner');
  const actionsGateway = await ctx.deploy({
    src: './build/actions-gateway.json',
    contract: 'ActionsGateway',
  });
  await actionsGateway.instance.methods.grantAbilities(owner, ActionsGatewayAbilities.SET_PROXIES).send();
  await actionsGateway.instance.methods.addProxy(createProxy.receipt._address, 0).send({ from: owner });
  ctx.set('actionsGateway', actionsGateway);
});

spec.beforeEach(async (ctx) => {
  const actionsGateway = ctx.get('actionsGateway');
  const owner = ctx.get('owner');
  const createProxy = ctx.get('createProxy');
  await createProxy.instance.methods.grantAbilities(actionsGateway.receipt._address, XcertCreateProxyAbilities.EXECUTE).send({ from: owner });
});

spec.test('fails if a signature is missing', async (ctx) => {
  const actionsGateway = ctx.get('actionsGateway');
  const createProxy = ctx.get('createProxy');
  const jane = ctx.get('jane');
  const owner = ctx.get('owner');
  const sara = ctx.get('sara');
  const cat = ctx.get('cat');
  const id = ctx.get('id1');
  const digest = ctx.get('digest1');

  const actions = [
    {
      proxyId: 0,
      contractAddress: cat.receipt._address,
      params: `${digest}${id.substring(2)}${jane.substring(2)}00`,
    },
  ];
  const orderData = {
    signers: [owner, jane, sara],
    actions,
    seed: common.getCurrentTime(),
    expirationTimestamp: common.getCurrentTime() + 3600,
  };
  const createTuple = ctx.tuple(orderData);

  const claim = await actionsGateway.instance.methods.getOrderDataClaim(createTuple).call();

  const signature1 = await getSignature(ctx.web3, claim, owner);
  const signature2 = await getSignature(ctx.web3, claim, jane);
  const signatureDataTuple = ctx.tuple([signature1, signature2]);

  await cat.instance.methods.grantAbilities(createProxy.receipt._address, XcertAbilities.CREATE_ASSET).send({ from: owner });
  await ctx.reverts(() => actionsGateway.instance.methods.perform(createTuple, signatureDataTuple).send({ from: jane }));
});

spec.test('fails when proxy does not have the create rights', async (ctx) => {
  const actionsGateway = ctx.get('actionsGateway');
  const jane = ctx.get('jane');
  const owner = ctx.get('owner');
  const cat = ctx.get('cat');
  const id = ctx.get('id1');
  const digest = ctx.get('digest1');

  const actions = [
    {
      proxyId: 0,
      contractAddress: cat.receipt._address,
      params: `${digest}${id.substring(2)}${jane.substring(2)}00`,
    },
  ];
  const orderData = {
    signers: [owner],
    actions,
    seed: common.getCurrentTime(),
    expirationTimestamp: common.getCurrentTime() + 3600,
  };
  const createTuple = ctx.tuple(orderData);
  const claim = await actionsGateway.instance.methods.getOrderDataClaim(createTuple).call();

  const signature1 = await getSignature(ctx.web3, claim, owner);
  const signatureDataTuple = ctx.tuple([signature1]);

  await ctx.reverts(() => actionsGateway.instance.methods.perform(createTuple, signatureDataTuple).send({ from: jane }), '017001');
});

spec.test('fails if maker does not have asset creating ability', async (ctx) => {
  const actionsGateway = ctx.get('actionsGateway');
  const createProxy = ctx.get('createProxy');
  const jane = ctx.get('jane');
  const owner = ctx.get('owner');
  const cat = ctx.get('cat');
  const id = ctx.get('id1');
  const digest = ctx.get('digest1');

  const actions = [
    {
      proxyId: 0,
      contractAddress: cat.receipt._address,
      params: `${digest}${id.substring(2)}${jane.substring(2)}00`,
    },
  ];
  const orderData = {
    signers: [owner],
    actions,
    seed: common.getCurrentTime(),
    expirationTimestamp: common.getCurrentTime() + 3600,
  };
  const createTuple = ctx.tuple(orderData);
  const claim = await actionsGateway.instance.methods.getOrderDataClaim(createTuple).call();

  const signature1 = await getSignature(ctx.web3, claim, owner);
  const signatureDataTuple = ctx.tuple([signature1]);

  await cat.instance.methods.revokeAbilities(owner, XcertAbilities.ALLOW_CREATE_ASSET).send({ from: owner });
  await cat.instance.methods.grantAbilities(createProxy.receipt._address, XcertAbilities.CREATE_ASSET).send({ from: owner });
  await ctx.reverts(() => actionsGateway.instance.methods.perform(createTuple, signatureDataTuple).send({ from: jane }), '015009');
});

export default spec;
