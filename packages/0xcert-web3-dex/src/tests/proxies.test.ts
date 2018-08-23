import { Spec } from '@specron/spec';

/**
 * Spec context interfaces.
 */

interface Data {
  tokenProxy?: any;
  nftProxy?: any;
  zeroAddress?: string;
  randomAddress?: string;
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
    src: '@0xcert/web3-proxy/build/nftokens-transfer-proxy.json',
    contract: 'NFTokenTransferProxy',
  });
  ctx.set('nftProxy', nftProxy);
});

spec.beforeEach(async (ctx) => {
  const zeroAddress = '0x0000000000000000000000000000000000000000';
  const randomAddress = '0x0000000000000000000000000000000000000001';
  ctx.set('zeroAddress', zeroAddress);
  ctx.set('randomAddress', randomAddress);
});

spec.test('deploy exchange with correct ERC20 transfer proxy address', async (ctx) => {
  const tokenProxy = ctx.get('tokenProxy');
  const zeroAddress = ctx.get('zeroAddress');
  const randomAddress = ctx.get('randomAddress');

  await ctx.reverts(() => ctx.deploy({
    src: './build/exchange.json',
    contract: 'Exchange',
    args: [zeroAddress, randomAddress]
  }));

  const exchange = await ctx.deploy({
    src: './build/exchange.json',
    contract: 'Exchange',
    args: [tokenProxy._address, randomAddress]
  });

  const exhangeTokenProxyAddress = await exchange.methods.tokenTransferProxy().call();

  ctx.is(tokenProxy._address, exhangeTokenProxyAddress);
});

spec.test('deploy exchange with correct ERC721 transfer proxy address', async (ctx) => {

  const nftProxy = ctx.get('nftProxy');
  const zeroAddress = ctx.get('zeroAddress');
  const randomAddress = ctx.get('randomAddress');

  await ctx.reverts(() => ctx.deploy({
    src: './build/exchange.json',
    contract: 'Exchange',
    args: [randomAddress, zeroAddress]
  }));

  const exchange = await ctx.deploy({
    src: './build/exchange.json',
    contract: 'Exchange',
    args: [randomAddress, nftProxy._address]
  });

  const exhangeNFTokenProxyAddress = await exchange.methods.nfTokenTransferProxy().call();

  ctx.is(nftProxy._address, exhangeNFTokenProxyAddress);
  
});

export default spec;