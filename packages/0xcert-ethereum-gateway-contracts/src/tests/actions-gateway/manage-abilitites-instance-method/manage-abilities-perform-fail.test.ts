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
}

const spec = new Spec<Data>();

spec.before(async (ctx) => {
  const accounts = await ctx.web3.eth.getAccounts();
  ctx.set('owner', accounts[0]);
  ctx.set('jane', accounts[1]);
  ctx.set('sara', accounts[2]);
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

spec.test('fails when proxy does not have the manage ability rights', async (ctx) => {
  const actionsGateway = ctx.get('actionsGateway');
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

  await ctx.reverts(() => actionsGateway.instance.methods.perform(createTuple, signatureDataTuple).send({ from: jane }), '017001');
});

spec.test('fails if maker does not have allow manage ability', async (ctx) => {
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

  await cat.instance.methods.revokeAbilities(owner, XcertAbilities.ALLOW_MANAGE_ABILITIES).send({ from: owner });
  await cat.instance.methods.grantAbilities(abilitableManageProxy.receipt._address, XcertAbilities.MANAGE_ABILITIES).send({ from: owner });
  await ctx.reverts(() => actionsGateway.instance.methods.perform(createTuple, signatureDataTuple).send({ from: jane }), '015011');
});

export default spec;
