import { NFTokenSafeTransferProxyAbilities, TokenTransferProxyAbilities,
  XcertCreateProxyAbilities } from '@0xcert/ethereum-proxy-contracts/src/core/types';
import { XcertAbilities } from '@0xcert/ethereum-xcert-contracts/src/core/types';
import { Spec } from '@specron/spec';
import { ActionsGatewayAbilities } from '../../../core/types';
import * as common from '../../helpers/common';
import { getSignature } from '../../helpers/signature';

/**
 * Test definition.
 * ERC20: ZXC, BNB
 * ERC-721: Cat, Dog, Fox
 */

interface Data {
  actionsGateway?: any;
  tokenProxy?: any;
  nftSafeProxy?: any;
  createProxy?: any;
  cat?: any;
  dog?: any;
  fox?: any;
  owner?: string;
  jane?: string;
  sara?: string;
  zxc?: any;
  bnb?: any;
  zeroAddress?: string;
  id1?: string;
  id2?: string;
  id3?: string;
  digest1?: string;
  digest2?: string;
  digest3?: string;
}

const spec = new Spec<Data>();

spec.before(async (ctx) => {
  const accounts = await ctx.web3.eth.getAccounts();
  ctx.set('owner', accounts[0]);
  ctx.set('jane', accounts[1]);
  ctx.set('sara', accounts[2]);
});

spec.before(async (ctx) => {
  ctx.set('id1', '0x0000000000000000000000000000000000000000000000000000000000000001');
  ctx.set('id2', '0x0000000000000000000000000000000000000000000000000000000000000002');
  ctx.set('id3', '0x0000000000000000000000000000000000000000000000000000000000000003');
  ctx.set('digest1', '0x1e205550c221490347e5e2393a02e94d284bbe9903f023ba098355b8d75974c8');
  ctx.set('digest2', '0x5e20552dc271490347e5e2391b02e94d684bbe9903f023fa098355bed7597434');
  ctx.set('digest3', '0x53f0df2dc671410347e5eef91b02344d687bbe9903f456fa0983eebed7517521');
  ctx.set('zeroAddress', '0x0000000000000000000000000000000000000000');
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
 * Dog
 * Jane owns: #1, #2, #3
 */
spec.beforeEach(async (ctx) => {
  const jane = ctx.get('jane');
  const owner = ctx.get('owner');
  const dog = await ctx.deploy({
    src: '@0xcert/ethereum-xcert-contracts/build/xcert-mock.json',
    contract: 'XcertMock',
    args: ['dog', 'DOG', 'https://0xcert.org/', '.json', '0xa65de9e6', []],
  });
  await dog.instance.methods
    .create(jane, 1, '0x0')
    .send({
      from: owner,
    });
  await dog.instance.methods
    .create(jane, 2, '0x0')
    .send({
      from: owner,
    });
  await dog.instance.methods
    .create(jane, 3, '0x0')
    .send({
      from: owner,
    });
  ctx.set('dog', dog);
});

/**
 * Fox
 * Jane owns: #1
 */
spec.beforeEach(async (ctx) => {
  const jane = ctx.get('jane');
  const owner = ctx.get('owner');
  const fox = await ctx.deploy({
    src: '@0xcert/ethereum-xcert-contracts/build/xcert-mock.json',
    contract: 'XcertMock',
    args: ['fox', 'FOX', 'https://0xcert.org/', '.json', '0xa65de9e6', []],
  });
  await fox.instance.methods
    .create(jane, 1, '0x0')
    .send({
      from: owner,
    });
  ctx.set('fox', fox);
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

spec.beforeEach(async (ctx) => {
  const tokenProxy = await ctx.deploy({
    src: '@0xcert/ethereum-proxy-contracts/build/token-transfer-proxy.json',
    contract: 'TokenTransferProxy',
  });
  ctx.set('tokenProxy', tokenProxy);
});

spec.beforeEach(async (ctx) => {
  const nftSafeProxy = await ctx.deploy({
    src: '@0xcert/ethereum-proxy-contracts/build/nftoken-safe-transfer-proxy.json',
    contract: 'NFTokenSafeTransferProxy',
  });
  ctx.set('nftSafeProxy', nftSafeProxy);
});

spec.beforeEach(async (ctx) => {
  const createProxy = await ctx.deploy({
    src: '@0xcert/ethereum-proxy-contracts/build/xcert-create-proxy.json',
    contract: 'XcertCreateProxy',
  });
  ctx.set('createProxy', createProxy);
});

spec.beforeEach(async (ctx) => {
  const nftSafeProxy = ctx.get('nftSafeProxy');
  const createProxy = ctx.get('createProxy');
  const owner = ctx.get('owner');
  const actionsGateway = await ctx.deploy({
    src: './build/actions-gateway.json',
    contract: 'ActionsGateway',
  });
  await actionsGateway.instance.methods.grantAbilities(owner, ActionsGatewayAbilities.SET_PROXIES).send();
  await actionsGateway.instance.methods.addProxy(nftSafeProxy.receipt._address, 1).send({ from: owner });
  await actionsGateway.instance.methods.addProxy(createProxy.receipt._address, 0).send({ from: owner });
  ctx.set('actionsGateway', actionsGateway);
});

spec.beforeEach(async (ctx) => {
  const tokenProxy = ctx.get('tokenProxy');
  const nftSafeProxy = ctx.get('nftSafeProxy');
  const actionsGateway = ctx.get('actionsGateway');
  const owner = ctx.get('owner');
  const createProxy = ctx.get('createProxy');
  await tokenProxy.instance.methods.grantAbilities(actionsGateway.receipt._address, TokenTransferProxyAbilities.EXECUTE).send({ from: owner });
  await nftSafeProxy.instance.methods.grantAbilities(actionsGateway.receipt._address, NFTokenSafeTransferProxyAbilities.EXECUTE).send({ from: owner });
  await createProxy.instance.methods.grantAbilities(actionsGateway.receipt._address, XcertCreateProxyAbilities.EXECUTE).send({ from: owner });
});

spec.test('Create cat #1 with signature', async (ctx) => {
  const actionsGateway = ctx.get('actionsGateway');
  const createProxy = ctx.get('createProxy');
  const jane = ctx.get('jane');
  const owner = ctx.get('owner');
  const cat = ctx.get('cat');
  const id = ctx.get('id1');
  const digest = ctx.get('digest1');

  const actions = [
    {
      proxyId: 1,
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

  const signature = await getSignature(ctx.web3, claim, owner);
  const signatureDataTuple = ctx.tuple([signature]);

  await cat.instance.methods.grantAbilities(createProxy.receipt._address, XcertAbilities.CREATE_ASSET).send({ from: owner });
  const logs = await actionsGateway.instance.methods.perform(createTuple, signatureDataTuple).send({ from: jane });
  ctx.not(logs.events.Perform, undefined);

  const cat1Owner = await cat.instance.methods.ownerOf(1).call();
  ctx.is(cat1Owner, jane);
});

spec.test('Create cat #1 with any taker', async (ctx) => {
  const actionsGateway = ctx.get('actionsGateway');
  const createProxy = ctx.get('createProxy');
  const jane = ctx.get('jane');
  const owner = ctx.get('owner');
  const cat = ctx.get('cat');
  const id = ctx.get('id1');
  const digest = ctx.get('digest1');
  const zeroAddress = ctx.get('zeroAddress');

  const actions = [
    {
      proxyId: 1,
      contractAddress: cat.receipt._address,
      params: `${digest}${id.substring(2)}${zeroAddress.substring(2)}00`,
    },
  ];
  const orderData = {
    signers: [owner, zeroAddress],
    actions,
    seed: common.getCurrentTime(),
    expirationTimestamp: common.getCurrentTime() + 3600,
  };
  const createTuple = ctx.tuple(orderData);

  const claim = await actionsGateway.instance.methods.getOrderDataClaim(createTuple).call();

  const signature = await getSignature(ctx.web3, claim, owner);
  const signatureDataTuple = ctx.tuple([signature]);

  await cat.instance.methods.grantAbilities(createProxy.receipt._address, XcertAbilities.CREATE_ASSET).send({ from: owner });
  const logs = await actionsGateway.instance.methods.perform(createTuple, signatureDataTuple).send({ from: jane });
  ctx.not(logs.events.Perform, undefined);

  const cat1Owner = await cat.instance.methods.ownerOf(1).call();
  ctx.is(cat1Owner, jane);
});

spec.test('Create cat #1 with any signer', async (ctx) => {
  const actionsGateway = ctx.get('actionsGateway');
  const createProxy = ctx.get('createProxy');
  const jane = ctx.get('jane');
  const owner = ctx.get('owner');
  const sara = ctx.get('sara');
  const cat = ctx.get('cat');
  const id = ctx.get('id1');
  const digest = ctx.get('digest1');
  const zeroAddress = ctx.get('zeroAddress');

  const actions = [
    {
      proxyId: 1,
      contractAddress: cat.receipt._address,
      params: `${digest}${id.substring(2)}${zeroAddress.substring(2)}00`,
    },
  ];
  const orderData = {
    signers: [owner, zeroAddress],
    actions,
    seed: common.getCurrentTime(),
    expirationTimestamp: common.getCurrentTime() + 3600,
  };
  const createTuple = ctx.tuple(orderData);

  const claim = await actionsGateway.instance.methods.getOrderDataClaim(createTuple).call();

  const signature = await getSignature(ctx.web3, claim, owner);
  const signature2 = await getSignature(ctx.web3, claim, jane);
  const signatureDataTuple = ctx.tuple([signature, signature2]);

  await cat.instance.methods.grantAbilities(createProxy.receipt._address, XcertAbilities.CREATE_ASSET).send({ from: owner });
  const logs = await actionsGateway.instance.methods.perform(createTuple, signatureDataTuple).send({ from: sara });
  ctx.not(logs.events.Perform, undefined);

  const cat1Owner = await cat.instance.methods.ownerOf(1).call();
  ctx.is(cat1Owner, jane);
});

spec.test('Create cat #1 with any creator', async (ctx) => {
  const actionsGateway = ctx.get('actionsGateway');
  const createProxy = ctx.get('createProxy');
  const jane = ctx.get('jane');
  const owner = ctx.get('owner');
  const sara = ctx.get('sara');
  const cat = ctx.get('cat');
  const id = ctx.get('id1');
  const digest = ctx.get('digest1');
  const zeroAddress = ctx.get('zeroAddress');

  const actions = [
    {
      proxyId: 1,
      contractAddress: cat.receipt._address,
      params: `${digest}${id.substring(2)}${jane.substring(2)}00`,
    },
  ];
  const orderData = {
    signers: [zeroAddress],
    actions,
    seed: common.getCurrentTime(),
    expirationTimestamp: common.getCurrentTime() + 3600,
  };
  const createTuple = ctx.tuple(orderData);

  const claim = await actionsGateway.instance.methods.getOrderDataClaim(createTuple).call();

  const signature = await getSignature(ctx.web3, claim, owner);
  const signatureDataTuple = ctx.tuple([signature]);

  await cat.instance.methods.grantAbilities(createProxy.receipt._address, XcertAbilities.CREATE_ASSET).send({ from: owner });
  const logs = await actionsGateway.instance.methods.perform(createTuple, signatureDataTuple).send({ from: sara });
  ctx.not(logs.events.Perform, undefined);

  const cat1Owner = await cat.instance.methods.ownerOf(1).call();
  ctx.is(cat1Owner, jane);
});

spec.test('Create cat #1 without signature', async (ctx) => {
  const actionsGateway = ctx.get('actionsGateway');
  const createProxy = ctx.get('createProxy');
  const jane = ctx.get('jane');
  const owner = ctx.get('owner');
  const cat = ctx.get('cat');
  const id = ctx.get('id1');
  const digest = ctx.get('digest1');

  const actions = [
    {
      proxyId: 1,
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

  const signatureDataTuple = ctx.tuple([]);

  await cat.instance.methods.grantAbilities(createProxy.receipt._address, XcertAbilities.CREATE_ASSET).send({ from: owner });
  const logs = await actionsGateway.instance.methods.perform(createTuple, signatureDataTuple).send({ from: owner });
  ctx.not(logs.events.Perform, undefined);

  const cat1Owner = await cat.instance.methods.ownerOf(1).call();
  ctx.is(cat1Owner, jane);
});

spec.test('Create and transfer token in a single order', async (ctx) => {
  const actionsGateway = ctx.get('actionsGateway');
  const createProxy = ctx.get('createProxy');
  const nftSafeProxy = ctx.get('nftSafeProxy');
  const owner = ctx.get('owner');
  const jane = ctx.get('jane');
  const cat = ctx.get('cat');
  const id = ctx.get('id1');
  const digest = ctx.get('digest1');

  const actions = [
    {
      proxyId: 1,
      contractAddress: cat.receipt._address,
      params: `${digest}${id.substring(2)}${jane.substring(2)}00`,
    },
    {
      proxyId: 0,
      contractAddress: cat.receipt._address,
      params: `${id}${owner.substring(2)}01`,
    },
  ];
  const orderData = {
    signers: [owner, jane],
    actions,
    seed: common.getCurrentTime(),
    expirationTimestamp: common.getCurrentTime() + 3600,
  };
  const createTuple = ctx.tuple(orderData);

  const claim = await actionsGateway.instance.methods.getOrderDataClaim(createTuple).call();

  const signature = await getSignature(ctx.web3, claim, owner);
  const signatureDataTuple = ctx.tuple([signature]);

  await cat.instance.methods.grantAbilities(createProxy.receipt._address, XcertAbilities.CREATE_ASSET).send({ from: owner });
  await cat.instance.methods.setApprovalForAll(nftSafeProxy.receipt._address, true).send({ from: jane });

  const logs = await actionsGateway.instance.methods.perform(createTuple, signatureDataTuple).send({ from: jane });
  ctx.not(logs.events.Perform, undefined);

  const cat1Owner = await cat.instance.methods.ownerOf(id).call();
  ctx.is(cat1Owner, owner);
});

export default spec;
