import { Spec } from '@specron/spec';

/**
 * Spec context interfaces.
 */

interface Data {
  owner?: string;
  bob?: string;
  tokenProxy?: any;
  mintProxy?: any;
  zeroAddress?: string;
  randomAddress?: string;
}

const spec = new Spec<Data>();

export default spec;

spec.beforeEach(async (ctx) => {
  const tokenProxy = await ctx.deploy({
    src: '@0xcert/web3-proxy/build/token-transfer-proxy.json',
    contract: 'TokenTransferProxy'
  });
  ctx.set('tokenProxy', tokenProxy);
});

spec.beforeEach(async (ctx) => {
  const mintProxy = await ctx.deploy({
    src: '@0xcert/web3-proxy/build/xcert-mint-proxy.json',
    contract: 'XcertMintProxy',
  });
  ctx.set('mintProxy', mintProxy);
});

spec.beforeEach(async (ctx) => { 
  const accounts = await ctx.web3.eth.getAccounts();
  const zeroAddress = '0x0000000000000000000000000000000000000000';
  const randomAddress = '0x0000000000000000000000000000000000000001';

  ctx.set('owner', accounts[0]);
  ctx.set('bob', accounts[1]);
  ctx.set('zeroAddress', zeroAddress);
  ctx.set('randomAddress', randomAddress);
});

spec.test('deploy minter with correct token transfer proxy address', async (ctx) => {
  const tokenProxy = ctx.get('tokenProxy');
  const randomAddress = ctx.get('randomAddress');
  const owner = ctx.get('owner');

  const minter = await ctx.deploy({
    src: './build/minter.json',
    contract: 'Minter',
    args: [randomAddress]
  });

  await minter.instance.methods.assignAbilities(owner, [1]).send();
  const logs = await minter.instance.methods.setProxy(0, tokenProxy.receipt._address).send({ from: owner });
  ctx.not(logs.events.ProxyChange, undefined);

  let proxy = await minter.instance.methods.idToProxy(0).call();
  ctx.is(tokenProxy.receipt._address, proxy);
});

spec.test('throws when a third party tries to set proxy address', async (ctx) => {
  const zeroAddress = ctx.get('zeroAddress');
  const randomAddress = ctx.get('randomAddress');
  const bob = ctx.get('bob');
  
  const minter = await ctx.deploy({
    src: './build/minter.json',
    contract: 'Minter',
    args: [randomAddress]
  });
  await ctx.reverts(() => minter.instance.methods.setProxy(0, zeroAddress).send({ from: bob }));
});

spec.test('deploy minter with correct Xcert minter proxy address', async (ctx) => {
  const mintProxy = ctx.get('mintProxy');
  const zeroAddress = ctx.get('zeroAddress');

  await ctx.reverts(() => ctx.deploy({
    src: './build/minter.json',
    contract: 'Minter',
    args: [zeroAddress]
  }));

  const minter = await ctx.deploy({
    src: './build/minter.json',
    contract: 'Minter',
    args: [mintProxy.receipt._address]
  });

  const minterXcertMintProxyAddress = await minter.instance.methods.xcertMintProxy().call();
  ctx.is(mintProxy.receipt._address, minterXcertMintProxyAddress);
});