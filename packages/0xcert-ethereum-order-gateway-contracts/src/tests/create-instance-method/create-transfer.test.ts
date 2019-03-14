import { NFTokenSafeTransferProxyAbilities, TokenTransferProxyAbilities,
  XcertCreateProxyAbilities } from '@0xcert/ethereum-proxy-contracts/src/core/types';
import { XcertAbilities } from '@0xcert/ethereum-xcert-contracts/src/core/types';
import { Spec } from '@specron/spec';
import { OrderGatewayAbilities } from '../../core/types';
import * as common from '../helpers/common';

/**
 * Test creates and transfers a NFT token in one single order.
 * ERC721: Cat
 */

interface Data {
  orderGateway?: any;
  nftSafeProxy?: any;
  createProxy?: any;
  cat?: any;
  owner?: string;
  jane?: string;
  id1?: string;
  imprint1?: string;
}

const spec = new Spec<Data>();

spec.before(async (ctx) => {
  const accounts = await ctx.web3.eth.getAccounts();
  ctx.set('owner', accounts[0]);
  ctx.set('jane', accounts[1]);
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
    args: ['cat', 'CAT', 'http://0xcert.org/', '0xa65de9e6', []],
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
  const orderGateway = await ctx.deploy({
    src: './build/order-gateway.json',
    contract: 'OrderGateway',
  });
  await orderGateway.instance.methods.grantAbilities(owner, OrderGatewayAbilities.SET_PROXIES).send();
  await orderGateway.instance.methods.addProxy(nftSafeProxy.receipt._address).send({ from: owner });
  await orderGateway.instance.methods.addProxy(createProxy.receipt._address).send({ from: owner });
  ctx.set('orderGateway', orderGateway);
});

spec.beforeEach(async (ctx) => {
  const nftSafeProxy = ctx.get('nftSafeProxy');
  const orderGateway = ctx.get('orderGateway');
  const owner = ctx.get('owner');
  const createProxy = ctx.get('createProxy');
  await nftSafeProxy.instance.methods.grantAbilities(orderGateway.receipt._address, NFTokenSafeTransferProxyAbilities.EXECUTE).send({ from: owner });
  await createProxy.instance.methods.grantAbilities(orderGateway.receipt._address, XcertCreateProxyAbilities.EXECUTE).send({ from: owner });
});

spec.test('Create and transfer token in a single order', async (ctx) => {
  const orderGateway = ctx.get('orderGateway');
  const createProxy = ctx.get('createProxy');
  const nftSafeProxy = ctx.get('nftSafeProxy');
  const owner = ctx.get('owner');
  const jane = ctx.get('jane');
  const cat = ctx.get('cat');
  const id = ctx.get('id1');
  const imprint = ctx.get('imprint1');

  const actions = [
    {
      kind: 0,
      proxy: 1,
      token: cat.receipt._address,
      param1: imprint,
      to: owner,
      value: id,
    },
    {
      kind: 1,
      proxy: 0,
      token: cat.receipt._address,
      param1: owner,
      to: jane,
      value: id,
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

  const claim = await orderGateway.instance.methods.getOrderDataClaim(createTuple).call();

  const signature = await ctx.web3.eth.sign(claim, owner);
  const signatureData = {
    r: signature.substr(0, 66),
    s: `0x${signature.substr(66, 64)}`,
    v: parseInt(`0x${signature.substr(130, 2)}`) + 27,
    kind: 0,
  };
  const signatureDataTuple = ctx.tuple(signatureData);

  await cat.instance.methods.grantAbilities(createProxy.receipt._address, XcertAbilities.CREATE_ASSET).send({ from: owner });
  await cat.instance.methods.setApprovalForAll(nftSafeProxy.receipt._address, true).send({ from: owner });

  const logs = await orderGateway.instance.methods.perform(createTuple, signatureDataTuple).send({ from: jane });
  ctx.not(logs.events.Perform, undefined);

  const cat1Owner = await cat.instance.methods.ownerOf(id).call();
  ctx.is(cat1Owner, jane);
});

export default spec;
