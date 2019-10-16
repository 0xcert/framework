import { XcertRevokeProxyAbilities } from '@0xcert/ethereum-proxy-contracts/src/core/types';
import { XcertAbilities } from '@0xcert/ethereum-xcert-contracts/src/core/types';
import { Spec } from '@specron/spec';
import { ActionsGatewayAbilities } from '../../../core/types';
import * as common from '../../helpers/common';
import { getSignature } from '../../helpers/signature';

/**
 * Test definition.
 * ERC20: ZXC, BNB, OMG, BAT, GNT
 * ERC-721: Cat, Dog, Fox, Bee, Ant, Ape, Pig
 */

interface Data {
  actionsGateway?: any;
  revokeProxy?: any;
  cat?: any;
  owner?: string;
  bob?: string;
  jane?: string;
  sara?: string;
  id1?: string;
  imprint1?: string;
  imprint2?: string;
  signatureTuple?: any;
  dataTuple?: any;
}

const spec = new Spec<Data>();

spec.beforeEach(async (ctx) => {
  const accounts = await ctx.web3.eth.getAccounts();
  ctx.set('owner', accounts[0]);
  ctx.set('bob', accounts[1]);
  ctx.set('jane', accounts[2]);
  ctx.set('sara', accounts[3]);
});

spec.beforeEach(async (ctx) => {
  ctx.set('id1', '0x0000000000000000000000000000000000000000000000000000000000000001');
  ctx.set('imprint1', '0x1e205550c221490347e5e2393a02e94d284bbe9903f023ba098355b8d75974c8');
});

/**
 * Cat
 * Jane owns: #1
 */
spec.beforeEach(async (ctx) => {
  const bob = ctx.get('bob');
  const owner = ctx.get('owner');
  const imprint1 = ctx.get('imprint1');
  const id = ctx.get('id1');
  const cat = await ctx.deploy({
    src: '@0xcert/ethereum-xcert-contracts/build/xcert-mock.json',
    contract: 'XcertMock',
    args: ['cat', 'CAT', 'https://0xcert.org/', '.json', '0xa65de9e6', ['0x20c5429b']],
  });
  await cat.instance.methods
  .create(bob, id, imprint1)
  .send({
    from: owner,
  });
  ctx.set('cat', cat);
});

spec.beforeEach(async (ctx) => {
  const revokeProxy = await ctx.deploy({
    src: '@0xcert/ethereum-proxy-contracts/build/xcert-revoke-proxy.json',
    contract: 'XcertRevokeProxy',
  });
  ctx.set('revokeProxy', revokeProxy);
});

spec.beforeEach(async (ctx) => {
  const revokeProxy = ctx.get('revokeProxy');
  const owner = ctx.get('owner');
  const actionsGateway = await ctx.deploy({
    src: './build/actions-gateway.json',
    contract: 'ActionsGateway',
  });
  await actionsGateway.instance.methods.grantAbilities(owner, ActionsGatewayAbilities.SET_PROXIES).send();
  await actionsGateway.instance.methods.addProxy(revokeProxy.receipt._address, 4).send({ from: owner });
  ctx.set('actionsGateway', actionsGateway);
});

spec.beforeEach(async (ctx) => {
  const revokeProxy = ctx.get('revokeProxy');
  const actionsGateway = ctx.get('actionsGateway');
  const owner = ctx.get('owner');
  await revokeProxy.instance.methods.grantAbilities(actionsGateway.receipt._address, XcertRevokeProxyAbilities.EXECUTE).send({ from: owner });
});

spec.test('throws when signer does not have ability to sign an revoke asset', async (ctx) => {
  const actionsGateway = ctx.get('actionsGateway');
  const jane = ctx.get('jane');
  const bob = ctx.get('bob');
  const owner = ctx.get('owner');
  const cat = ctx.get('cat');
  const id = ctx.get('id1');
  const revokeProxy = ctx.get('revokeProxy');

  const actions = [
    {
      proxyId: 0,
      contractAddress: cat.receipt._address,
      params: `${id.substring(2)}00`,
    },
  ];
  const orderData = {
    signers: [jane],
    actions,
    seed: common.getCurrentTime(),
    expirationTimestamp: common.getCurrentTime() + 3600,
  };
  const createTuple = ctx.tuple(orderData);

  const claim = await actionsGateway.instance.methods.getOrderDataClaim(createTuple).call();

  const signature = await getSignature(ctx.web3, claim, jane);
  const signatureDataTuple = ctx.tuple([signature]);

  await cat.instance.methods.grantAbilities(revokeProxy.receipt._address, XcertAbilities.REVOKE_ASSET).send({ from: owner });
  await ctx.reverts(() => actionsGateway.instance.methods.perform(createTuple, signatureDataTuple).send({ from: bob }), '015010');
});

spec.only('throws when proxy does not have ability to recoke revoke', async (ctx) => {
  const actionsGateway = ctx.get('actionsGateway');
  const jane = ctx.get('jane');
  const owner = ctx.get('owner');
  const cat = ctx.get('cat');
  const id = ctx.get('id1');

  const actions = [
    {
      proxyId: 0,
      contractAddress: cat.receipt._address,
      params: `${id}00`,
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

  const signature = await getSignature(ctx.web3, claim, owner);
  const signatureDataTuple = ctx.tuple([signature]);

  await ctx.reverts(() => actionsGateway.instance.methods.perform(createTuple, signatureDataTuple).send({ from: jane }), '017001');
});

spec.only('throws when proxy does not have ability to execute', async (ctx) => {
  const actionsGateway = ctx.get('actionsGateway');
  const revokeProxy = ctx.get('revokeProxy');
  const jane = ctx.get('jane');
  const owner = ctx.get('owner');
  const cat = ctx.get('cat');
  const id = ctx.get('id1');

  const actions = [
    {
      proxyId: 0,
      contractAddress: cat.receipt._address,
      params: `${id}00`,
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

  const signature = await getSignature(ctx.web3, claim, owner);
  const signatureDataTuple = ctx.tuple([signature]);

  await cat.instance.methods.grantAbilities(revokeProxy.receipt._address, XcertAbilities.REVOKE_ASSET).send({ from: owner });

  await revokeProxy.instance.methods.revokeAbilities(actionsGateway.receipt._address, XcertRevokeProxyAbilities.EXECUTE).send({ from: owner });
  await ctx.reverts(() => actionsGateway.instance.methods.perform(createTuple, signatureDataTuple).send({ from: jane }), '017001');
});

export default spec;
