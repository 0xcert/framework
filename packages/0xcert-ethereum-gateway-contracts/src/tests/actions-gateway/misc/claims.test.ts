import { Spec } from '@specron/spec';
import * as common from '../../helpers/common';

/**
 * Spec context interfaces.
 */

interface Data {
  actionsGateway?: any;
  cat?: any;
  owner?: string;
  bob?: string;
  jane?: string;
  sara?: string;
  signature?: any;
  hash?: string;
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
});

spec.beforeEach(async (ctx) => {
  const cat = await ctx.deploy({
    src: '@0xcert/ethereum-erc721-contracts/build/nf-token-metadata-enumerable-mock.json',
    contract: 'NFTokenMetadataEnumerableMock',
    args: ['cat', 'CAT', 'https://0xcert.org/', '.json'],
  });
  await cat.instance.methods
    .create(ctx.get('jane'), 1)
    .send({
      from: ctx.get('owner'),
      gas: 4000000,
    });
  ctx.set('cat', cat);
});

spec.beforeEach(async (ctx) => {
  const actionsGateway = await ctx.deploy({
    src: './build/actions-gateway.json',
    contract: 'ActionsGateway',
  });
  ctx.set('actionsGateway', actionsGateway);
});

spec.beforeEach(async (ctx) => {
  const action = {
    proxyId: 0,
    contractAddress: ctx.get('cat').receipt._address,
    params: `${ctx.get('jane')}${ctx.get('sara').substr(2)}`,
  };
  const claim = {
    signers: [ctx.get('jane'), ctx.get('sara')],
    actions: [action],
    seed: common.getCurrentTime(),
    expiration: common.getCurrentTime() + 600,
  };
  const actionsGateway = ctx.get('actionsGateway');
  const tuple = ctx.tuple(claim);
  const hash = await actionsGateway.instance.methods.getOrderDataClaim(tuple).call();
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
  const actionsGateway = ctx.get('actionsGateway');
  const account = ctx.get('jane');
  const hash = ctx.get('hash');
  const signature = ctx.get('signature');
  const tuple = ctx.tuple(signature);
  const valid = await actionsGateway.instance.methods.isValidSignature(account, hash, tuple).call();
  ctx.true(valid);
});

spec.test('check invalid signature', async (ctx) => {
  const actionsGateway = ctx.get('actionsGateway');
  const signatureData = ctx.get('signature');
  signatureData.v = 30;
  const account = ctx.get('jane');
  const hash = ctx.get('hash');
  const tuple = ctx.tuple(signatureData);
  const valid = await actionsGateway.instance.methods.isValidSignature(account, hash, tuple).call();
  ctx.false(valid);
});

spec.test('check signature from a third party account', async (ctx) => {
  const actionsGateway = ctx.get('actionsGateway');
  const account = ctx.get('sara');
  const hash = ctx.get('hash');
  const signature = ctx.get('signature');
  const tuple = ctx.tuple(signature);
  const valid = await actionsGateway.instance.methods.isValidSignature(account, hash, tuple).call();
  ctx.false(valid);
});
