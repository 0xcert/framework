import { NFTokenSafeTransferProxyAbilities } from '@0xcert/ethereum-proxy-contracts/src/core/types';
import { Spec } from '@specron/spec';
import { ActionsGatewayAbilities } from '../../../core/types';
import * as common from '../../helpers/common';
import { getSignature } from '../../helpers/signature';

/**
 * Test definition.
 *
 * ERC-721: Cat, Dog, Fox, Bee
 */

/**
 * Spec context interfaces.
 */

interface Data {
  actionsGateway?: any;
  nftSafeProxy?: any;
  cat?: any;
  owner?: string;
  bob?: string;
  jane?: string;
  sara?: string;
  zeroAddress?: string;
  id1?: string;
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
  ctx.set('id1', '0x0000000000000000000000000000000000000000000000000000000000000001');
});

/**
 * Cat
 * Jane owns: #1
 */
spec.beforeEach(async (ctx) => {
  const cat = await ctx.deploy({
    src: '@0xcert/ethereum-erc721-contracts/build/nf-token-metadata-enumerable-mock.json',
    contract: 'NFTokenMetadataEnumerableMock',
    args: ['cat', 'CAT', 'https://0xcert.org/', '.json'],
  });
  await cat.instance.methods
    .create(ctx.get('jane'), 1)
    .send({
      from: ctx.get('owner'),
      gas: 4000000,
    });
  ctx.set('cat', cat);
});

spec.beforeEach(async (ctx) => {
  const nftSafeProxy = await ctx.deploy({
    src: '@0xcert/ethereum-proxy-contracts/build/nftoken-safe-transfer-proxy.json',
    contract: 'NFTokenSafeTransferProxy',
  });
  ctx.set('nftSafeProxy', nftSafeProxy);
});

spec.beforeEach(async (ctx) => {
  const nftSafeProxy = ctx.get('nftSafeProxy');
  const owner = ctx.get('owner');
  const actionsGateway = await ctx.deploy({
    src: './build/actions-gateway.json',
    contract: 'ActionsGateway',
  });
  await actionsGateway.instance.methods.grantAbilities(owner, ActionsGatewayAbilities.SET_PROXIES).send();
  await actionsGateway.instance.methods.addProxy(nftSafeProxy.receipt._address, 1).send({ from: owner });
  ctx.set('actionsGateway', actionsGateway);
});

spec.beforeEach(async (ctx) => {
  const nftSafeProxy = ctx.get('nftSafeProxy');
  const actionsGateway = ctx.get('actionsGateway');
  const owner = ctx.get('owner');
  await nftSafeProxy.instance.methods.grantAbilities(actionsGateway.receipt._address, NFTokenSafeTransferProxyAbilities.EXECUTE).send({ from: owner });
});

spec.test('Transfer Cat #1 with signature', async (ctx) => {
  const actionsGateway = ctx.get('actionsGateway');
  const nftSafeProxy = ctx.get('nftSafeProxy');
  const jane = ctx.get('jane');
  const bob = ctx.get('bob');
  const cat = ctx.get('cat');
  const id = ctx.get('id1');

  const actions = [
    {
      proxyId: 0,
      contractAddress: cat.receipt._address,
      params: `${id}${bob.substring(2)}00`,
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

  await cat.instance.methods.approve(nftSafeProxy.receipt._address, 1).send({ from: jane });
  const logs = await actionsGateway.instance.methods.perform(orderDataTuple, signatureDataTuple).send({ from: bob });
  ctx.not(logs.events.Perform, undefined);

  const cat1Owner = await cat.instance.methods.ownerOf(1).call();
  ctx.is(cat1Owner, bob);
});

spec.test('Transfer Cat #1 without signature', async (ctx) => {
  const actionsGateway = ctx.get('actionsGateway');
  const nftSafeProxy = ctx.get('nftSafeProxy');
  const jane = ctx.get('jane');
  const bob = ctx.get('bob');
  const cat = ctx.get('cat');
  const id = ctx.get('id1');

  const actions = [
    {
      proxyId: 0,
      contractAddress: cat.receipt._address,
      params: `${id}${bob.substring(2)}00`,
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

  await cat.instance.methods.approve(nftSafeProxy.receipt._address, 1).send({ from: jane });

  const logs = await actionsGateway.instance.methods.perform(orderDataTuple, signatureDataTuple).send({ from: jane });
  ctx.not(logs.events.Perform, undefined);

  const cat1Owner = await cat.instance.methods.ownerOf(1).call();
  ctx.is(cat1Owner, bob);
});

spec.test('Transfer Cat #1 with any taker', async (ctx) => {
  const actionsGateway = ctx.get('actionsGateway');
  const nftSafeProxy = ctx.get('nftSafeProxy');
  const jane = ctx.get('jane');
  const bob = ctx.get('bob');
  const zeroAddress = ctx.get('zeroAddress');
  const cat = ctx.get('cat');
  const id = ctx.get('id1');

  const actions = [
    {
      proxyId: 0,
      contractAddress: cat.receipt._address,
      params: `${id}${zeroAddress.substring(2)}00`,
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

  await cat.instance.methods.approve(nftSafeProxy.receipt._address, 1).send({ from: jane });
  const logs = await actionsGateway.instance.methods.perform(orderDataTuple, signatureDataTuple).send({ from: bob });
  ctx.not(logs.events.Perform, undefined);

  const cat1Owner = await cat.instance.methods.ownerOf(1).call();
  ctx.is(cat1Owner, bob);
});

spec.test('Transfer Cat #1 with any signer', async (ctx) => {
  const actionsGateway = ctx.get('actionsGateway');
  const nftSafeProxy = ctx.get('nftSafeProxy');
  const jane = ctx.get('jane');
  const bob = ctx.get('bob');
  const sara = ctx.get('sara');
  const zeroAddress = ctx.get('zeroAddress');
  const cat = ctx.get('cat');
  const id = ctx.get('id1');

  const actions = [
    {
      proxyId: 0,
      contractAddress: cat.receipt._address,
      params: `${id}${zeroAddress.substring(2)}00`,
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

  await cat.instance.methods.approve(nftSafeProxy.receipt._address, 1).send({ from: jane });
  const logs = await actionsGateway.instance.methods.perform(orderDataTuple, signatureDataTuple).send({ from: sara });
  ctx.not(logs.events.Perform, undefined);

  const cat1Owner = await cat.instance.methods.ownerOf(1).call();
  ctx.is(cat1Owner, bob);
});

export default spec;
