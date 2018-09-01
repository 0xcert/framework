import { Spec } from '@specron/spec';
import * as common from './helpers/common';

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
    src: '@0xcert/web3-erc721/build/NFTokenMetadataEnumerableMock.json',
    contract: 'NFTokenMetadataEnumerableMock',
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


spec.beforeEach(async (ctx) => {
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
    seed: common.getCurrentTime(), 
    expiration: common.getCurrentTime() + 600,
  };
  const exchange = ctx.get('exchange');
  const tuple = ctx.tuple(claim);
  const hash = await exchange.methods.getSwapDataClaim(tuple).call();
  ctx.set('hash', hash);
});

spec.beforeEach(async (ctx) => {
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

spec.test('check valid signature', async (ctx) => {
  const exchange = ctx.get('exchange');
  const account = ctx.get('jane');
  const hash = ctx.get('hash');
  const signature = ctx.get('signature');
  const tuple = ctx.tuple(signature);
  const valid = await exchange.methods.isValidSignature(account, hash, tuple).call();
  ctx.true(valid);
});

spec.test('check invalid signature', async (ctx) => {
  const exchange = ctx.get('exchange');
  const signatureData = ctx.get('signature');
  signatureData.v = 30;
  const account = ctx.get('jane');
  const hash = ctx.get('hash');
  const tuple = ctx.tuple(signatureData);
  const valid = await exchange.methods.isValidSignature(account, hash, tuple).call();
  ctx.false(valid);
});

spec.test('check signature from a third party account', async (ctx) => {
  const exchange = ctx.get('exchange');
  const account = ctx.get('sara');
  const hash = ctx.get('hash');
  const signature = ctx.get('signature');
  const tuple = ctx.tuple(signature);
  const valid = await exchange.methods.isValidSignature(account, hash, tuple).call();
  ctx.false(valid);
});
