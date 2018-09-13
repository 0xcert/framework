import { Spec } from '@specron/spec';
import * as common from './helpers/common';

/**
 * Spec context interfaces.
 */

interface Data {
  minter?: any;
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
  ctx.set('bob', accounts[1]);
  ctx.set('jane', accounts[2]);
  ctx.set('sara', accounts[3]);
  ctx.set('randomAddress', '0x0000000000000000000000000000000000000001');
});

spec.beforeEach(async (ctx) => {
  const randomAddress = ctx.get('randomAddress');
  const minter = await ctx.deploy({
    src: './build/minter.json',
    contract: 'Minter',
    args: [randomAddress, randomAddress]
  });
  ctx.set('minter', minter);
});

spec.beforeEach(async (ctx) => {
  const id = '1';
  const uri = "http://0xcert.org/1";
  const proof = '1e205550c271490347e5e2393a02e94d284bbe9903f023ba098355b8d75974c8';
  const config = [ctx.web3.utils.padLeft(ctx.web3.utils.numberToHex(1821195657), 64)];
  const data = [ctx.web3.utils.padLeft(ctx.web3.utils.numberToHex(3), 64)];
  const bob = ctx.get('bob');
  const jane = ctx.get('jane');
  const sara = ctx.get('sara');
  const randomAddress = ctx.get('randomAddress');
  const minter = ctx.get('minter');

  const xcertData = {
    xcert: randomAddress,
    id,
    uri,
    proof,
    config,
    data,
  };
  const fees = [
    {
      token: randomAddress,
      to: jane,
      amount: 5000,
    },
    {
      token: randomAddress,
      to: sara,
      amount: 100,
    },
  ];
  const mintData = {
    to: bob,
    xcertData,
    fees,
    seed: common.getCurrentTime(),
    expirationTimestamp: common.getCurrentTime() + 3600,
  }
  const mintTuple = ctx.tuple(mintData);

  const hash = await minter.methods.getMintDataClaim(mintTuple).call();
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
  const minter = ctx.get('minter');
  const account = ctx.get('jane');
  const hash = ctx.get('hash');
  const signature = ctx.get('signature');
  const tuple = ctx.tuple(signature);
  const valid = await minter.methods.isValidSignature(account, hash, tuple).call();
  ctx.true(valid);
});

spec.test('check with invalid signature', async (ctx) => {
  const minter = ctx.get('minter');
  const signatureData = ctx.get('signature');
  signatureData.v = 30;
  const account = ctx.get('jane');
  const hash = ctx.get('hash');
  const tuple = ctx.tuple(signatureData);
  const valid = await minter.methods.isValidSignature(account, hash, tuple).call();
  ctx.false(valid);
});

spec.test('check signature from a third party account', async (ctx) => {
  const minter = ctx.get('minter');
  const account = ctx.get('sara');
  const hash = ctx.get('hash');
  const signature = ctx.get('signature');
  const tuple = ctx.tuple(signature);
  const valid = await minter.methods.isValidSignature(account, hash, tuple).call();
  ctx.false(valid);
});