import { Spec } from '@specron/spec';
import { OrderGatewayAbilities } from '../core/types';

/**
 * Spec context interfaces.
 */

interface Data {
  orderGateway?: any;
  tokenProxy?: any;
  nftProxy?: any;
  owner?: string;
  bob?: string;
  zeroAddress?: string;
}

const spec = new Spec<Data>();

spec.beforeEach(async (ctx) => {
  const accounts = await ctx.web3.eth.getAccounts();
  ctx.set('owner', accounts[0]);
  ctx.set('bob', accounts[1]);
  ctx.set('zeroAddress', '0x0000000000000000000000000000000000000000');
});

spec.beforeEach(async (ctx) => {
  const tokenProxy = await ctx.deploy({
    src: '@0xcert/ethereum-proxy-contracts/build/token-transfer-proxy.json',
    contract: 'TokenTransferProxy',
  });
  ctx.set('tokenProxy', tokenProxy);
});

spec.beforeEach(async (ctx) => {
  const nftProxy = await ctx.deploy({
    src: '@0xcert/ethereum-proxy-contracts/build/nftoken-transfer-proxy.json',
    contract: 'NFTokenTransferProxy',
  });
  ctx.set('nftProxy', nftProxy);
});

spec.beforeEach(async (ctx) => {
  const owner = ctx.get('owner');
  const orderGateway = await ctx.deploy({
    src: './build/order-gateway.json',
    contract: 'OrderGateway',
  });
  await orderGateway.instance.methods.grantAbilities(owner, OrderGatewayAbilities.SET_PROXIES).send();
  ctx.set('orderGateway', orderGateway);
});

spec.test('correctly set proxy addresses', async (ctx) => {
  const tokenProxy = ctx.get('tokenProxy');
  const nftProxy = ctx.get('nftProxy');
  const zeroAddress = ctx.get('zeroAddress');
  const owner = ctx.get('owner');
  const orderGateway = ctx.get('orderGateway');

  const logs = await orderGateway.instance.methods.setProxy(0, tokenProxy.receipt._address).send({ from: owner });
  ctx.not(logs.events.ProxyChange, undefined);

  let proxy = await orderGateway.instance.methods.idToProxy(0).call();
  ctx.is(tokenProxy.receipt._address, proxy);

  await orderGateway.instance.methods.setProxy(1, nftProxy.receipt._address).send({ from: owner });
  await orderGateway.instance.methods.setProxy(0, zeroAddress).send({ from: owner });

  proxy = await orderGateway.instance.methods.idToProxy(0).call();
  ctx.is(zeroAddress, proxy);
  proxy = await orderGateway.instance.methods.idToProxy(1).call();
  ctx.is(nftProxy.receipt._address, proxy);
});

spec.test('throws when a third party tries to set proxy address', async (ctx) => {
  const zeroAddress = ctx.get('zeroAddress');
  const bob = ctx.get('bob');
  const orderGateway = ctx.get('orderGateway');

  await ctx.reverts(() => orderGateway.instance.methods.setProxy(0, zeroAddress).send({ from: bob }));
});

export default spec;
