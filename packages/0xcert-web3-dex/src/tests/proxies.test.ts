import { Spec } from '@specron/spec';

/**
 * Spec context interfaces.
 */

interface Data {
  exchange?: any;
  tokenProxy?: any;
  nftProxy?: any;
  owner?: string;
  bob?: string;
  zeroAddress?: string;
}

const spec = new Spec<Data>();

spec.beforeEach(async (ctx) => {
  const tokenProxy = await ctx.deploy({
    src: '@0xcert/web3-proxy/build/token-transfer-proxy.json',
    contract: 'TokenTransferProxy'
  });
  ctx.set('tokenProxy', tokenProxy);
});

spec.beforeEach(async (ctx) => {
  const nftProxy = await ctx.deploy({
    src: '@0xcert/web3-proxy/build/nftoken-transfer-proxy.json',
    contract: 'NFTokenTransferProxy',
  });
  ctx.set('nftProxy', nftProxy);
});

spec.beforeEach(async (ctx) => {
  const exchange = await ctx.deploy({
    src: './build/exchange.json',
    contract: 'Exchange',
  });
  ctx.set('exchange', exchange);
});

spec.beforeEach(async (ctx) => {
  const accounts = await ctx.web3.eth.getAccounts();
  ctx.set('owner', accounts[0]);
  ctx.set('bob', accounts[1]);
  ctx.set('zeroAddress', '0x0000000000000000000000000000000000000000');
});

spec.test('correctly set proxy addresses', async (ctx) => {
  const tokenProxy = ctx.get('tokenProxy');
  const nftProxy = ctx.get('nftProxy');
  const zeroAddress = ctx.get('zeroAddress');
  const owner = ctx.get('owner');
  const exchange = ctx.get('exchange');

  const logs = await exchange.methods.setProxy(0, tokenProxy._address).send({ from: owner });
  ctx.not(logs.events.ProxyChange, undefined);

  let proxy = await exchange.methods.idToProxy(0).call();
  ctx.is(tokenProxy._address, proxy);

  await exchange.methods.setProxy(1, nftProxy._address).send({ from: owner });
  await exchange.methods.setProxy(0, zeroAddress).send({ from: owner });

  proxy = await exchange.methods.idToProxy(0).call();
  ctx.is(zeroAddress, proxy);
  proxy = await exchange.methods.idToProxy(1).call();
  ctx.is(nftProxy._address, proxy);
});

spec.test('throws when a third party tries to set proxy address', async (ctx) => {
  const zeroAddress = ctx.get('zeroAddress');
  const bob = ctx.get('bob');
  const exchange = ctx.get('exchange');

  await ctx.reverts(() => exchange.methods.setProxy(0, zeroAddress).send({ from: bob }));
});

export default spec;