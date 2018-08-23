import { Spec } from '@specron/spec';

/**
 * Spec context interfaces.
 */

interface Data {
  exchange?: any;
  cat?: any;
  owner?: string;
  bob?: string;
  jane?: string;
  sara?: string;
  signature?: any;
  hash?: string;
  randomAddress?: string;
}

/**
 * Spec stack instances.
 */

const spec = new Spec<Data>();
const specRaw = new Spec<Data>();
const specSigned = new Spec<Data>();

export default spec;

spec.beforeEach(async (ctx) => {
  const accounts = await ctx.web3.eth.getAccounts();
  ctx.set('owner', accounts[0]);
  ctx.set('bob', accounts[1]);
  ctx.set('jane', accounts[2]);
  ctx.set('sara', accounts[3]);
  const randomAddress = '0x0000000000000000000000000000000000000001';
  ctx.set('randomAddress', randomAddress);
});

spec.beforeEach(async (ctx) => {
  const cat = await ctx.deploy({ 
    src: '@0xcert/ethereum-erc721/build/contracts/NFTokenMetadataEnumerableMock.json',
    args: ['cat', 'CAT'],
  });
  await cat.methods
    .mint(ctx.get('jane'), 1, '0xcert.org')
    .send({
      from: ctx.get('owner'),
      gas: 4000000,
    });
  ctx.set('cat', cat);
});

spec.beforeEach(async (ctx) => {
  const randomAddress = ctx.get('randomAddress');

  const exchange = await ctx.deploy({
    src: './build/exchange.json',
    contract: 'Exchange',
    args: [randomAddress, randomAddress],
  });
  ctx.set('exchange', exchange);
});

/**
 * Test definitions.
 */

spec.spec('generate claim', specRaw);

specRaw.test('from valid data', async (ctx) => {
  const exchange = ctx.get('exchange');
  const transfer = {
    token: ctx.get('cat')._address,
    kind: 1,
    from: ctx.get('jane'),
    to: ctx.get('sara'),
    value: 1,
  };
  const claim = {
    maker: ctx.get('jane'),
    taker: ctx.get('sara'),
    transfers: [transfer],
    seed: new Date().getTime(), 
    expiration: new Date().getTime() + 600,
  };
  const tuple = ctx.tuple(claim);
  const hash = await exchange.methods.getSwapDataClaim(tuple).call();
  // TODO(Tadej): generate hash locally and compare.
  // TODO(Tadej): ctx.is(hash);
});

specRaw.test('from invalid data', async (ctx) => {
  // TODO(Tadej): add test when we know how to generate hash locally.
});

spec.spec('validate signed claim', specSigned);

specSigned.beforeEach(async (ctx) => {
  const transfer = {
    token: ctx.get('cat')._address,
    kind: 1,
    from: ctx.get('jane'),
    to: ctx.get('sara'),
    value: 1,
  };
  const claim = {
    maker: ctx.get('jane'),
    taker: ctx.get('sara'),
    transfers: [transfer],
    seed: new Date().getTime(), 
    expiration: new Date().getTime() + 600,
  };
  const exchange = ctx.get('exchange');
  const tuple = ctx.tuple(claim);
  const hash = await exchange.methods.getSwapDataClaim(tuple).call();
  ctx.set('hash', hash);
});

specSigned.beforeEach(async (ctx) => {
  const hash = ctx.get('hash');
  const account = ctx.get('jane');
  const signature = await ctx.web3.eth.sign(hash, account);
  const signatureData = {
    r: signature.substr(0, 66),
    s: `0x${signature.substr(66, 64)}`,
    v: parseInt(`0x${signature.substr(130, 2)}`) + 27,
    kind: 0,
  };
  ctx.set('signature', signatureData);
});

specSigned.test('with valid signature data', async (ctx) => {
  const exchange = ctx.get('exchange');
  const account = ctx.get('jane');
  const hash = ctx.get('hash');
  const signature = ctx.get('signature');
  const tuple = ctx.tuple(signature);
  const valid = await exchange.methods.isValidSignature(account, hash, tuple).call();
  ctx.true(valid);
});

specSigned.test('with invalid signature data', async (ctx) => {
  const exchange = ctx.get('exchange');
  const signatureData = ctx.get('signature');
  signatureData.v = 30;
  const account = ctx.get('jane');
  const hash = ctx.get('hash');
  const tuple = ctx.tuple(signatureData);
  const valid = await exchange.methods.isValidSignature(account, hash, tuple).call();
  ctx.false(valid);
});

specSigned.test('from a third party account', async (ctx) => {
  const exchange = ctx.get('exchange');
  const account = ctx.get('sara');
  const hash = ctx.get('hash');
  const signature = ctx.get('signature');
  const tuple = ctx.tuple(signature);
  const valid = await exchange.methods.isValidSignature(account, hash, tuple).call();
  ctx.false(valid);
});
