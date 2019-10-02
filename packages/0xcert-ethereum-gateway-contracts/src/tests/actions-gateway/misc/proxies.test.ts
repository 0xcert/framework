import { Spec } from '@specron/spec';
import { ActionsGatewayAbilities } from '../../../core/types';

/**
 * Spec context interfaces.
 */

interface Data {
  actionsGateway?: any;
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
  const actionsGateway = await ctx.deploy({
    src: './build/actions-gateway.json',
    contract: 'ActionsGateway',
  });
  await actionsGateway.instance.methods.grantAbilities(owner, ActionsGatewayAbilities.SET_PROXIES).send();
  ctx.set('actionsGateway', actionsGateway);
});

spec.test('correctly adds proxy addresses', async (ctx) => {
  const tokenProxy = ctx.get('tokenProxy');
  const nftProxy = ctx.get('nftProxy');
  const owner = ctx.get('owner');
  const actionsGateway = ctx.get('actionsGateway');

  const logs = await actionsGateway.instance.methods.addProxy(tokenProxy.receipt._address, 0).send({ from: owner });
  ctx.not(logs.events.ProxyChange, undefined);

  let proxy = await actionsGateway.instance.methods.proxies(0).call();
  ctx.is(tokenProxy.receipt._address, proxy.proxyAddress);

  await actionsGateway.instance.methods.addProxy(nftProxy.receipt._address, 0).send({ from: owner });

  proxy = await actionsGateway.instance.methods.proxies(1).call();
  ctx.is(nftProxy.receipt._address, proxy.proxyAddress);
});

spec.test('correctly removes proxy address', async (ctx) => {
  const tokenProxy = ctx.get('tokenProxy');
  const zeroAddress = ctx.get('zeroAddress');
  const owner = ctx.get('owner');
  const actionsGateway = ctx.get('actionsGateway');

  const addLogs = await actionsGateway.instance.methods.addProxy(tokenProxy.receipt._address, 1).send({ from: owner });
  ctx.not(addLogs.events.ProxyChange, undefined);

  let proxy = await actionsGateway.instance.methods.proxies(0).call();
  ctx.is(tokenProxy.receipt._address, proxy.proxyAddress);

  const removeLogs = await actionsGateway.instance.methods.removeProxy(0).send({ from: owner });
  ctx.not(removeLogs.events.ProxyChange, undefined);

  proxy = await actionsGateway.instance.methods.proxies(0).call();
  ctx.is(zeroAddress, proxy.proxyAddress);
});

spec.test('throws when a third party tries to add proxy address', async (ctx) => {
  const zeroAddress = ctx.get('zeroAddress');
  const bob = ctx.get('bob');
  const actionsGateway = ctx.get('actionsGateway');

  await ctx.reverts(() => actionsGateway.instance.methods.addProxy(zeroAddress, 0).send({ from: bob }));
});

export default spec;
