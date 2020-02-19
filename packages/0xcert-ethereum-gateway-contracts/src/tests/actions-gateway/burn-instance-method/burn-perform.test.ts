import { XcertBurnProxyAbilities } from '@0xcert/ethereum-proxy-contracts/src/core/types';
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
  burnProxy?: any;
  cat?: any;
  owner?: string;
  bob?: string;
  jane?: string;
  sara?: string;
  id1?: string;
  digest1?: string;
  zeroAddress?: string;
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
  ctx.set('digest1', '0x1e205550c221490347e5e2393a02e94d284bbe9903f023ba098355b8d75974c8');
  ctx.set('zeroAddress', '0x0000000000000000000000000000000000000000');
});

/**
 * Cat
 */
spec.beforeEach(async (ctx) => {
  const jane = ctx.get('jane');
  const owner = ctx.get('owner');
  const digest1 = ctx.get('digest1');
  const cat = await ctx.deploy({
    src: '@0xcert/ethereum-xcert-contracts/build/xcert-mock.json',
    contract: 'XcertMock',
    args: ['cat', 'CAT', 'https://0xcert.org/', '.json', '0xa65de9e6', ['0x9d118770']],
  });
  await cat.instance.methods
  .create(jane, 1, digest1)
  .send({
    from: owner,
  });
  ctx.set('cat', cat);
});

spec.beforeEach(async (ctx) => {
  const burnProxy = await ctx.deploy({
    src: '@0xcert/ethereum-proxy-contracts/build/xcert-burn-proxy.json',
    contract: 'XcertBurnProxy',
  });
  ctx.set('burnProxy', burnProxy);
});

spec.beforeEach(async (ctx) => {
  const burnProxy = ctx.get('burnProxy');
  const owner = ctx.get('owner');
  const actionsGateway = await ctx.deploy({
    src: './build/actions-gateway.json',
    contract: 'ActionsGateway',
  });
  await actionsGateway.instance.methods.grantAbilities(owner, ActionsGatewayAbilities.SET_PROXIES).send();
  await actionsGateway.instance.methods.addProxy(burnProxy.receipt._address, 4).send({ from: owner });
  ctx.set('actionsGateway', actionsGateway);
});

spec.beforeEach(async (ctx) => {
  const burnProxy = ctx.get('burnProxy');
  const actionsGateway = ctx.get('actionsGateway');
  const owner = ctx.get('owner');
  await burnProxy.instance.methods.grantAbilities(actionsGateway.receipt._address, XcertBurnProxyAbilities.EXECUTE).send({ from: owner });
});

spec.test('Destroys cat #1 with signature', async (ctx) => {
  const actionsGateway = ctx.get('actionsGateway');
  const burnProxy = ctx.get('burnProxy');
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
    signers: [jane],
    actions,
    seed: common.getCurrentTime(),
    expirationTimestamp: common.getCurrentTime() + 3600,
  };
  const createTuple = ctx.tuple(orderData);

  const claim = await actionsGateway.instance.methods.getOrderDataClaim(createTuple).call();

  const signature = await getSignature(ctx.web3, claim, jane);
  const signatureDataTuple = ctx.tuple([signature]);

  await cat.instance.methods.setApprovalForAll(burnProxy.receipt._address, true).send({ from: jane });
  const logs = await actionsGateway.instance.methods.perform(createTuple, signatureDataTuple).send({ from: owner });
  ctx.not(logs.events.Perform, undefined);

  await ctx.reverts(() => cat.instance.methods.ownerOf(1).call());
});

spec.test('Destroys cat #1 with any taker', async (ctx) => {
  const actionsGateway = ctx.get('actionsGateway');
  const burnProxy = ctx.get('burnProxy');
  const jane = ctx.get('jane');
  const owner = ctx.get('owner');
  const zeroAddress = ctx.get('zeroAddress');
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
    signers: [jane, zeroAddress],
    actions,
    seed: common.getCurrentTime(),
    expirationTimestamp: common.getCurrentTime() + 3600,
  };
  const createTuple = ctx.tuple(orderData);

  const claim = await actionsGateway.instance.methods.getOrderDataClaim(createTuple).call();

  const signature = await getSignature(ctx.web3, claim, jane);
  const signatureDataTuple = ctx.tuple([signature]);

  await cat.instance.methods.setApprovalForAll(burnProxy.receipt._address, true).send({ from: jane });
  const logs = await actionsGateway.instance.methods.perform(createTuple, signatureDataTuple).send({ from: owner });
  ctx.not(logs.events.Perform, undefined);

  await ctx.reverts(() => cat.instance.methods.ownerOf(1).call());
});

spec.test('Destroys cat #1 with any signer', async (ctx) => {
  const actionsGateway = ctx.get('actionsGateway');
  const burnProxy = ctx.get('burnProxy');
  const jane = ctx.get('jane');
  const bob = ctx.get('bob');
  const owner = ctx.get('owner');
  const zeroAddress = ctx.get('zeroAddress');
  const cat = ctx.get('cat');
  const id = ctx.get('id1');

  const actions = [
    {
      proxyId: 0,
      contractAddress: cat.receipt._address,
      params: `${id}01`,
    },
  ];
  const orderData = {
    signers: [bob, zeroAddress],
    actions,
    seed: common.getCurrentTime(),
    expirationTimestamp: common.getCurrentTime() + 3600,
  };
  const createTuple = ctx.tuple(orderData);

  const claim = await actionsGateway.instance.methods.getOrderDataClaim(createTuple).call();

  const signature = await getSignature(ctx.web3, claim, bob);
  const signature2 = await getSignature(ctx.web3, claim, jane);
  const signatureDataTuple = ctx.tuple([signature, signature2]);

  await cat.instance.methods.setApprovalForAll(burnProxy.receipt._address, true).send({ from: jane });
  const logs = await actionsGateway.instance.methods.perform(createTuple, signatureDataTuple).send({ from: owner });
  ctx.not(logs.events.Perform, undefined);

  await ctx.reverts(() => cat.instance.methods.ownerOf(1).call());
});

spec.test('Destroys cat #1 with any destroyer', async (ctx) => {
  const actionsGateway = ctx.get('actionsGateway');
  const burnProxy = ctx.get('burnProxy');
  const jane = ctx.get('jane');
  const bob = ctx.get('bob');
  const owner = ctx.get('owner');
  const zeroAddress = ctx.get('zeroAddress');
  const cat = ctx.get('cat');
  const id = ctx.get('id1');

  const actions = [
    {
      proxyId: 0,
      contractAddress: cat.receipt._address,
      params: `${id}01`,
    },
  ];
  const orderData = {
    signers: [bob, zeroAddress],
    actions,
    seed: common.getCurrentTime(),
    expirationTimestamp: common.getCurrentTime() + 3600,
  };
  const createTuple = ctx.tuple(orderData);

  const claim = await actionsGateway.instance.methods.getOrderDataClaim(createTuple).call();

  const signature = await getSignature(ctx.web3, claim, bob);
  const signatureDataTuple = ctx.tuple([signature]);

  await cat.instance.methods.setApprovalForAll(burnProxy.receipt._address, true).send({ from: jane });
  const logs = await actionsGateway.instance.methods.perform(createTuple, signatureDataTuple).send({ from: jane });
  ctx.not(logs.events.Perform, undefined);

  await ctx.reverts(() => cat.instance.methods.ownerOf(1).call());
});

spec.test('Destroys cat #1 without signature', async (ctx) => {
  const actionsGateway = ctx.get('actionsGateway');
  const burnProxy = ctx.get('burnProxy');
  const jane = ctx.get('jane');
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
    signers: [jane],
    actions,
    seed: common.getCurrentTime(),
    expirationTimestamp: common.getCurrentTime() + 3600,
  };
  const createTuple = ctx.tuple(orderData);
  const signatureDataTuple = ctx.tuple([]);

  await cat.instance.methods.setApprovalForAll(burnProxy.receipt._address, true).send({ from: jane });
  const logs = await actionsGateway.instance.methods.perform(createTuple, signatureDataTuple).send({ from: jane });
  ctx.not(logs.events.Perform, undefined);

  await ctx.reverts(() => cat.instance.methods.ownerOf(1).call());
});

export default spec;
