import { Spec } from '@specron/spec';

/**
 * Spec context interfaces.
 */

interface Data {
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
  const zeroAddress = '0x0000000000000000000000000000000000000000';
  const randomAddress = '0x0000000000000000000000000000000000000001';
  ctx.set('zeroAddress', zeroAddress);
  ctx.set('randomAddress', randomAddress);
});

spec.test('deploy minter with correct token transfer proxy address', async (ctx) => {
  const tokenProxy = ctx.get('tokenProxy');
  const zeroAddress = ctx.get('zeroAddress');
  const randomAddress = ctx.get('randomAddress');

  await ctx.reverts(() => ctx.deploy({
    src: './build/minter.json',
    contract: 'Minter',
    args: [zeroAddress, randomAddress]
  }));

  const minter = await ctx.deploy({
    src: './build/minter.json',
    contract: 'Minter',
    args: [tokenProxy._address, randomAddress]
  });

  const minterTokenTransferProxyAddress = await minter.methods.tokenTransferProxy().call();
  ctx.is(tokenProxy._address, minterTokenTransferProxyAddress);
});

spec.test('deploy minter with correct Xcert minter proxy address', async (ctx) => {
  const mintProxy = ctx.get('mintProxy');
  const zeroAddress = ctx.get('zeroAddress');
  const randomAddress = ctx.get('randomAddress');

  await ctx.reverts(() => ctx.deploy({
    src: './build/minter.json',
    contract: 'Minter',
    args: [zeroAddress, randomAddress]
  }));

  const minter = await ctx.deploy({
    src: './build/minter.json',
    contract: 'Minter',
    args: [randomAddress, mintProxy._address]
  });

  const minterXcertMintProxyAddress = await minter.methods.xcertMintProxy().call();
  ctx.is(mintProxy._address, minterXcertMintProxyAddress);
});