import { XcertUpdateProxyAbilities } from '@0xcert/ethereum-proxy-contracts/src/core/types';
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
  updateProxy?: any;
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
  ctx.set('id1', '1');
  ctx.set('imprint1', '0x1e205550c221490347e5e2393a02e94d284bbe9903f023ba098355b8d75974c8');
  ctx.set('imprint2', '0x5e20552dc271490347e5e2391b02e94d684bbe9903f023fa098355bed7597434');
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
    args: ['cat', 'CAT', 'https://0xcert.org/', '.json', '0xa65de9e6', ['0x0d04c3b8']],
  });
  await cat.instance.methods
  .create(bob, id, imprint1)
  .send({
    from: owner,
  });
  ctx.set('cat', cat);
});

spec.beforeEach(async (ctx) => {
  const updateProxy = await ctx.deploy({
    src: '@0xcert/ethereum-proxy-contracts/build/xcert-update-proxy.json',
    contract: 'XcertUpdateProxy',
  });
  ctx.set('updateProxy', updateProxy);
});

spec.beforeEach(async (ctx) => {
  const updateProxy = ctx.get('updateProxy');
  const owner = ctx.get('owner');
  const actionsGateway = await ctx.deploy({
    src: './build/actions-gateway.json',
    contract: 'ActionsGateway',
  });
  await actionsGateway.instance.methods.grantAbilities(owner, ActionsGatewayAbilities.SET_PROXIES).send();
  await actionsGateway.instance.methods.addProxy(updateProxy.receipt._address, 2).send({ from: owner });
  ctx.set('actionsGateway', actionsGateway);
});

spec.beforeEach(async (ctx) => {
  const updateProxy = ctx.get('updateProxy');
  const actionsGateway = ctx.get('actionsGateway');
  const owner = ctx.get('owner');
  await updateProxy.instance.methods.grantAbilities(actionsGateway.receipt._address, XcertUpdateProxyAbilities.EXECUTE).send({ from: owner });
});

spec.test('throws when signer does not have ability to sign an update asset', async (ctx) => {
  const actionsGateway = ctx.get('actionsGateway');
  const jane = ctx.get('jane');
  const bob = ctx.get('bob');
  const owner = ctx.get('owner');
  const cat = ctx.get('cat');
  const id = ctx.get('id1');
  const imprint2 = ctx.get('imprint2');
  const updateProxy = ctx.get('updateProxy');

  const actions = [
    {
      proxyId: 0,
      contractAddress: cat.receipt._address,
      params: `${imprint2}${id.substring(2)}00`,
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

  await cat.instance.methods.grantAbilities(updateProxy.receipt._address, XcertAbilities.UPDATE_ASSET_IMPRINT).send({ from: owner });
  await ctx.reverts(() => actionsGateway.instance.methods.perform(createTuple, signatureDataTuple).send({ from: bob }), '015010');
});

spec.test('throws when proxy does not have ability to update assets', async (ctx) => {
  const actionsGateway = ctx.get('actionsGateway');
  const jane = ctx.get('jane');
  const owner = ctx.get('owner');
  const cat = ctx.get('cat');
  const id = ctx.get('id1');
  const imprint2 = ctx.get('imprint2');

  const actions = [
    {
      proxyId: 0,
      contractAddress: cat.receipt._address,
      params: `${imprint2}${id.substring(2)}00`,
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

spec.test('throws when proxy does not have ability to execute', async (ctx) => {
  const actionsGateway = ctx.get('actionsGateway');
  const updateProxy = ctx.get('updateProxy');
  const jane = ctx.get('jane');
  const owner = ctx.get('owner');
  const cat = ctx.get('cat');
  const id = ctx.get('id1');
  const imprint2 = ctx.get('imprint2');

  const actions = [
    {
      proxyId: 0,
      contractAddress: cat.receipt._address,
      params: `${imprint2}${id.substring(2)}00`,
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

  await cat.instance.methods.grantAbilities(updateProxy.receipt._address, XcertAbilities.UPDATE_ASSET_IMPRINT).send({ from: owner });

  await updateProxy.instance.methods.revokeAbilities(actionsGateway.receipt._address, XcertUpdateProxyAbilities.EXECUTE).send({ from: owner });
  await ctx.reverts(() => actionsGateway.instance.methods.perform(createTuple, signatureDataTuple).send({ from: jane }), '017001');
});

export default spec;
