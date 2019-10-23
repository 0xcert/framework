import { AbilitableManageProxyAbilities } from '@0xcert/ethereum-proxy-contracts/src/core/types';
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
  abilitableManageProxy?: any;
  cat?: any;
  owner?: string;
  jane?: string;
  sara?: string;
  zeroAddress?: string;
}

const spec = new Spec<Data>();

spec.before(async (ctx) => {
  const accounts = await ctx.web3.eth.getAccounts();
  ctx.set('owner', accounts[0]);
  ctx.set('jane', accounts[1]);
  ctx.set('sara', accounts[2]);
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

spec.beforeEach(async (ctx) => {
  const abilitableManageProxy = await ctx.deploy({
    src: '@0xcert/ethereum-proxy-contracts/build/abilitable-manage-proxy.json',
    contract: 'AbilitableManageProxy',
  });
  ctx.set('abilitableManageProxy', abilitableManageProxy);
});

spec.beforeEach(async (ctx) => {
  const abilitableManageProxy = ctx.get('abilitableManageProxy');
  const owner = ctx.get('owner');
  const actionsGateway = await ctx.deploy({
    src: './build/actions-gateway.json',
    contract: 'ActionsGateway',
  });
  await actionsGateway.instance.methods.grantAbilities(owner, ActionsGatewayAbilities.SET_PROXIES).send();
  await actionsGateway.instance.methods.addProxy(abilitableManageProxy.receipt._address, 3).send({ from: owner });
  ctx.set('actionsGateway', actionsGateway);
});

spec.beforeEach(async (ctx) => {
  const actionsGateway = ctx.get('actionsGateway');
  const owner = ctx.get('owner');
  const abilitableManageProxy = ctx.get('abilitableManageProxy');
  await abilitableManageProxy.instance.methods.grantAbilities(actionsGateway.receipt._address, AbilitableManageProxyAbilities.EXECUTE).send({ from: owner });
});

spec.test('Successfully sets ability no signature', async (ctx) => {
  const actionsGateway = ctx.get('actionsGateway');
  const abilitableManageProxy = ctx.get('abilitableManageProxy');
  const jane = ctx.get('jane');
  const owner = ctx.get('owner');
  const cat = ctx.get('cat');
  const createAbility = '0x0000000000000000000000000000000000000000000000000000000000000010'; // create asset in hex uint256

  const actions = [
    {
      proxyId: 0,
      contractAddress: cat.receipt._address,
      params: `${createAbility}${jane.substring(2)}00`,
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

  let janeCreateAsset = await cat.instance.methods.isAble(jane, XcertAbilities.CREATE_ASSET).call();
  ctx.false(janeCreateAsset);

  await cat.instance.methods.grantAbilities(abilitableManageProxy.receipt._address, XcertAbilities.MANAGE_ABILITIES).send({ from: owner });
  const logs = await actionsGateway.instance.methods.perform(createTuple, signatureDataTuple).send({ from: owner });
  ctx.not(logs.events.Perform, undefined);

  janeCreateAsset = await cat.instance.methods.isAble(jane, XcertAbilities.CREATE_ASSET).call();
  ctx.true(janeCreateAsset);
});

spec.test('Successfully sets ability with signature', async (ctx) => {
  const actionsGateway = ctx.get('actionsGateway');
  const abilitableManageProxy = ctx.get('abilitableManageProxy');
  const jane = ctx.get('jane');
  const owner = ctx.get('owner');
  const cat = ctx.get('cat');
  const createAbility = '0x0000000000000000000000000000000000000000000000000000000000000010'; // create asset in hex uint256

  const actions = [
    {
      proxyId: 0,
      contractAddress: cat.receipt._address,
      params: `${createAbility}${jane.substring(2)}00`,
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

  let janeCreateAsset = await cat.instance.methods.isAble(jane, XcertAbilities.CREATE_ASSET).call();
  ctx.false(janeCreateAsset);

  await cat.instance.methods.grantAbilities(abilitableManageProxy.receipt._address, XcertAbilities.MANAGE_ABILITIES).send({ from: owner });
  const logs = await actionsGateway.instance.methods.perform(createTuple, signatureDataTuple).send({ from: jane });
  ctx.not(logs.events.Perform, undefined);

  janeCreateAsset = await cat.instance.methods.isAble(jane, XcertAbilities.CREATE_ASSET).call();
  ctx.true(janeCreateAsset);
});

spec.test('Successfully sets ability with any taker', async (ctx) => {
  const actionsGateway = ctx.get('actionsGateway');
  const abilitableManageProxy = ctx.get('abilitableManageProxy');
  const jane = ctx.get('jane');
  const owner = ctx.get('owner');
  const cat = ctx.get('cat');
  const createAbility = '0x0000000000000000000000000000000000000000000000000000000000000010'; // create asset in hex uint256
  const zeroAddress = ctx.get('zeroAddress');

  const actions = [
    {
      proxyId: 0,
      contractAddress: cat.receipt._address,
      params: `${createAbility}${zeroAddress.substring(2)}00`,
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

  let janeCreateAsset = await cat.instance.methods.isAble(jane, XcertAbilities.CREATE_ASSET).call();
  ctx.false(janeCreateAsset);

  await cat.instance.methods.grantAbilities(abilitableManageProxy.receipt._address, XcertAbilities.MANAGE_ABILITIES).send({ from: owner });
  const logs = await actionsGateway.instance.methods.perform(createTuple, signatureDataTuple).send({ from: jane });
  ctx.not(logs.events.Perform, undefined);

  janeCreateAsset = await cat.instance.methods.isAble(jane, XcertAbilities.CREATE_ASSET).call();
  ctx.true(janeCreateAsset);
});

spec.test('Successfully sets ability with any signer', async (ctx) => {
  const actionsGateway = ctx.get('actionsGateway');
  const abilitableManageProxy = ctx.get('abilitableManageProxy');
  const jane = ctx.get('jane');
  const sara = ctx.get('sara');
  const owner = ctx.get('owner');
  const cat = ctx.get('cat');
  const createAbility = '0x0000000000000000000000000000000000000000000000000000000000000010'; // create asset in hex uint256
  const zeroAddress = ctx.get('zeroAddress');

  const actions = [
    {
      proxyId: 0,
      contractAddress: cat.receipt._address,
      params: `${createAbility}${zeroAddress.substring(2)}00`,
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

  let janeCreateAsset = await cat.instance.methods.isAble(jane, XcertAbilities.CREATE_ASSET).call();
  ctx.false(janeCreateAsset);

  await cat.instance.methods.grantAbilities(abilitableManageProxy.receipt._address, XcertAbilities.MANAGE_ABILITIES).send({ from: owner });
  const logs = await actionsGateway.instance.methods.perform(createTuple, signatureDataTuple).send({ from: sara });
  ctx.not(logs.events.Perform, undefined);

  janeCreateAsset = await cat.instance.methods.isAble(jane, XcertAbilities.CREATE_ASSET).call();
  ctx.true(janeCreateAsset);
});

spec.test('Successfully removes own manage ability', async (ctx) => {
  const actionsGateway = ctx.get('actionsGateway');
  const abilitableManageProxy = ctx.get('abilitableManageProxy');
  const jane = ctx.get('jane');
  const owner = ctx.get('owner');
  const cat = ctx.get('cat');
  const noAbilities = '0x0000000000000000000000000000000000000000000000000000000000000000'; // no abilities in hex uint256

  const actions = [
    {
      proxyId: 0,
      contractAddress: cat.receipt._address,
      params: `${noAbilities}${owner.substring(2)}00`,
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

  let ownerManageAbilitites = await cat.instance.methods.isAble(owner, XcertAbilities.MANAGE_ABILITIES).call();
  ctx.true(ownerManageAbilitites);

  await cat.instance.methods.grantAbilities(abilitableManageProxy.receipt._address, XcertAbilities.MANAGE_ABILITIES).send({ from: owner });
  const logs = await actionsGateway.instance.methods.perform(createTuple, signatureDataTuple).send({ from: jane });
  ctx.not(logs.events.Perform, undefined);

  ownerManageAbilitites = await cat.instance.methods.isAble(owner, XcertAbilities.MANAGE_ABILITIES).call();
  ctx.false(ownerManageAbilitites);
});

spec.test('Successfully sets multiple abilities', async (ctx) => {
  const actionsGateway = ctx.get('actionsGateway');
  const abilitableManageProxy = ctx.get('abilitableManageProxy');
  const jane = ctx.get('jane');
  const owner = ctx.get('owner');
  const cat = ctx.get('cat');
  const createAndRevokeAssetAbilities = '0x0000000000000000000000000000000000000000000000000000000000000030'; // create and revoke in hex uint256
  const manageAbilities = '0x0000000000000000000000000000000000000000000000000000000000000001'; // manage abilities in hex uint256

  const actions = [
    {
      proxyId: 0,
      contractAddress: cat.receipt._address,
      params: `${createAndRevokeAssetAbilities}${jane.substring(2)}00`,
    },
    {
      proxyId: 0,
      contractAddress: cat.receipt._address,
      params: `${manageAbilities}${owner.substring(2)}00`,
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

  let janeCatCreateAsset = await cat.instance.methods.isAble(jane, XcertAbilities.CREATE_ASSET).call();
  let janeCatRevokeAsset = await cat.instance.methods.isAble(jane, XcertAbilities.REVOKE_ASSET).call();
  let ownerCatAllowManageAbilitites = await cat.instance.methods.isAble(owner, XcertAbilities.ALLOW_MANAGE_ABILITIES).call();
  ctx.false(janeCatCreateAsset);
  ctx.false(janeCatRevokeAsset);
  ctx.true(ownerCatAllowManageAbilitites);

  await cat.instance.methods.grantAbilities(abilitableManageProxy.receipt._address, XcertAbilities.MANAGE_ABILITIES).send({ from: owner });
  const logs = await actionsGateway.instance.methods.perform(createTuple, signatureDataTuple).send({ from: jane });
  ctx.not(logs.events.Perform, undefined);

  janeCatCreateAsset = await cat.instance.methods.isAble(jane, XcertAbilities.CREATE_ASSET).call();
  janeCatRevokeAsset = await cat.instance.methods.isAble(jane, XcertAbilities.REVOKE_ASSET).call();
  ownerCatAllowManageAbilitites = await cat.instance.methods.isAble(owner, XcertAbilities.ALLOW_MANAGE_ABILITIES).call();
  ctx.true(janeCatCreateAsset);
  ctx.true(janeCatRevokeAsset);
  ctx.false(ownerCatAllowManageAbilitites);
});

export default spec;
