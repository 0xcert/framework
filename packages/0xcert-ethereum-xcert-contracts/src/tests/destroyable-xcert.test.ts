import { Spec } from '@specron/spec';
import * as common from './helpers/common';

interface Data {
  xcert?: any;
  zxc?: any;
  owner?: string;
  bob?: string;
  jane?: string;
  sara?: string;
  id1?: string;
  id2?: string;
  uriPrefix?: string;
  uriPostfix?: string;
  imprint1?: string;
  imprint2?: string;
  decimalsMul?: any;
}

const spec = new Spec<Data>();

spec.beforeEach(async (ctx) => {
  const accounts = await ctx.web3.eth.getAccounts();
  ctx.set('owner', accounts[0]);
  ctx.set('bob', accounts[1]);
  ctx.set('jane', accounts[2]);
  ctx.set('sara', accounts[3]);
});

spec.beforeEach(async (ctx) => {
  const BN = ctx.web3.utils.BN;
  ctx.set('id1', '123');
  ctx.set('id2', '124');
  ctx.set('uriPrefix', 'https://0xcert.org/');
  ctx.set('uriPostfix', '.json');
  ctx.set('imprint1', '0x973124ffc4a03e66d6a4458e587d5d6146f71fc57f359c8d516e0b12a50ab0d9');
  ctx.set('imprint2', '0x6f25b3f4bc7eadafb8f57d69f8a59db3b23f198151dbf3c66ac3082381518329');
  ctx.set('decimalsMul', new BN('1000000000000000000'));
});

spec.beforeEach(async (ctx) => {
  const uriPrefix = ctx.get('uriPrefix');
  const uriPostfix = ctx.get('uriPostfix');
  const xcert = await ctx.deploy({
    src: './build/xcert-mock.json',
    contract: 'XcertMock',
    args: ['Foo', 'F', uriPrefix, uriPostfix, '0x9c22ff5f21f0b81b113e63f7db6da94fedef11b2119b4088b89664fb9a3cb658', ['0x9d118770']],
  });

  ctx.set('xcert', xcert);
});

/**
 * ZXC
 * Bob owns: all
 */
spec.beforeEach(async (ctx) => {
  const bob = ctx.get('bob');
  const zxc = await ctx.deploy({
    src: '@0xcert/ethereum-erc20-contracts/build/token-mock.json',
    contract: 'TokenMock',
    args: ['ERC20', 'ERC', 18, '300000000000000000000000000'],
    from: bob,
  });
  ctx.set('zxc', zxc);
});

spec.test('successfuly destroys an Xcert', async (ctx) => {
  const xcert = ctx.get('xcert');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const id1 = ctx.get('id1');
  const id2 = ctx.get('id2');
  const imprint1 = ctx.get('imprint1');
  const imprint2 = ctx.get('imprint2');

  await xcert.instance.methods.create(bob, id1, imprint1).send({ from: owner });
  await xcert.instance.methods.create(bob, id2, imprint2).send({ from: owner });
  const logs = await xcert.instance.methods.destroy(id1).send({ from: bob });
  ctx.not(logs.events.Transfer, undefined);

  const balance = await xcert.instance.methods.balanceOf(bob).call();
  ctx.is(balance, '1');
  await ctx.reverts(() => xcert.instance.methods.ownerOf(id1).call(), '006002');

  const tokenIndex0 = await xcert.instance.methods.tokenByIndex(0).call();
  ctx.is(tokenIndex0, id2);

  const tokenOwnerIndex0 = await xcert.instance.methods.tokenOfOwnerByIndex(bob, 0).call();
  ctx.is(tokenOwnerIndex0, id2);

  await ctx.reverts(() => xcert.instance.methods.tokenByIndex(1).call(), '006007');
  await ctx.reverts(() => xcert.instance.methods.tokenOfOwnerByIndex(bob, 1).call(), '006007');
});

spec.test('successfuly destroys an Xcert from an operator', async (ctx) => {
  const xcert = ctx.get('xcert');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const sara = ctx.get('sara');
  const id1 = ctx.get('id1');
  const imprint1 = ctx.get('imprint1');

  await xcert.instance.methods.create(bob, id1, imprint1).send({ from: owner });
  await xcert.instance.methods.setApprovalForAll(sara, true).send({ from: bob });

  const logs = await xcert.instance.methods.destroy(id1).send({ from: sara });
  ctx.not(logs.events.Transfer, undefined);
});

spec.test('throws when trying to destroy an already destroyed Xcert', async (ctx) => {
  const xcert = ctx.get('xcert');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const id1 = ctx.get('id1');
  const imprint1 = ctx.get('imprint1');

  await xcert.instance.methods.create(bob, id1, imprint1).send({ from: owner });
  await xcert.instance.methods.destroy(id1).send({ from: bob});
  await ctx.reverts(() => xcert.instance.methods.destroy(id1).send({ from: bob }), '006002');
});

spec.test('throws when a third party tries to destroy a Xcert', async (ctx) => {
  const xcert = ctx.get('xcert');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const sara = ctx.get('sara');
  const id1 = ctx.get('id1');
  const imprint1 = ctx.get('imprint1');

  await xcert.instance.methods.create(bob, id1, imprint1).send({ from: owner });
  await ctx.reverts(() => xcert.instance.methods.destroy(id1).send({ from: sara }, '008001'));
});

/**
 * @notice This test is skipped because ganache cannot handle emmiting Tranfer event from ERC20
 * where there is Transfer event already defined in Xcert.
 */
spec.skip('owner successfuly destroys an Xcert with signature', async (ctx) => {
  const xcert = ctx.get('xcert');
  const zxc = ctx.get('zxc');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const id1 = ctx.get('id1');
  const id2 = ctx.get('id2');
  const imprint1 = ctx.get('imprint1');
  const imprint2 = ctx.get('imprint2');
  const seed = common.getCurrentTime();
  const expiration = common.getCurrentTime() + 3600;
  const decimalsMul = ctx.get('decimalsMul');
  const tokenAmount = decimalsMul.mul(new ctx.web3.utils.BN('100'));

  await xcert.instance.methods.create(bob, id1, imprint1).send({ from: owner });
  await xcert.instance.methods.create(bob, id2, imprint2).send({ from: owner });

  await zxc.instance.methods.approve(xcert.receipt._address, tokenAmount.toString()).send({ from: bob });
  const claim = await xcert.instance.methods.generateDestroyClaim(bob, id1, zxc.receipt._address, tokenAmount.toString(), seed, expiration).call();
  const signature = await ctx.web3.eth.sign(claim, bob);
  const signatureData = {
    r: signature.substr(0, 66),
    s: `0x${signature.substr(66, 64)}`,
    v: parseInt(`0x${signature.substr(130, 2)}`) + 27,
    kind: 0,
  };
  const signatureDataTuple = ctx.tuple(signatureData);

  const logs = await xcert.instance.methods.destroyWithSignature(bob, id1, zxc.receipt._address, tokenAmount.toString(), seed, expiration, signatureDataTuple).send({ from: owner });
  ctx.not(logs.events.Transfer, undefined);

  const balance = await xcert.instance.methods.balanceOf(bob).call();
  ctx.is(balance, '1');
  await ctx.reverts(() => xcert.instance.methods.ownerOf(id1).call(), '006002');

  const tokenIndex0 = await xcert.instance.methods.tokenByIndex(0).call();
  ctx.is(tokenIndex0, id2);

  const tokenOwnerIndex0 = await xcert.instance.methods.tokenOfOwnerByIndex(bob, 0).call();
  ctx.is(tokenOwnerIndex0, id2);

  await ctx.reverts(() => xcert.instance.methods.tokenByIndex(1).call(), '006007');
  await ctx.reverts(() => xcert.instance.methods.tokenOfOwnerByIndex(bob, 1).call(), '006007');

  const ownerBalance = await zxc.instance.methods.balanceOf(owner).call();
  ctx.is(ownerBalance.toString(), tokenAmount.toString());
});

/**
 * @notice This test is skipped because ganache cannot handle emmiting Tranfer event from ERC20
 * where there is Transfer event already defined in Xcert.
 */
spec.skip('operator successfuly destroys an Xcert with signature', async (ctx) => {
  const xcert = ctx.get('xcert');
  const zxc = ctx.get('zxc');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const id1 = ctx.get('id1');
  const id2 = ctx.get('id2');
  const imprint1 = ctx.get('imprint1');
  const imprint2 = ctx.get('imprint2');
  const seed = common.getCurrentTime();
  const expiration = common.getCurrentTime() + 3600;
  const decimalsMul = ctx.get('decimalsMul');
  const tokenAmount = decimalsMul.mul(new ctx.web3.utils.BN('100'));

  await xcert.instance.methods.create(owner, id1, imprint1).send({ from: owner });
  await xcert.instance.methods.create(owner, id2, imprint2).send({ from: owner });
  await xcert.instance.methods.setApprovalForAll(bob, true).send({ from: owner });

  await zxc.instance.methods.approve(xcert.receipt._address, tokenAmount.toString()).send({ from: bob });
  const claim = await xcert.instance.methods.generateDestroyClaim(bob, id1, zxc.receipt._address, tokenAmount.toString(), seed, expiration).call();
  const signature = await ctx.web3.eth.sign(claim, bob);
  const signatureData = {
    r: signature.substr(0, 66),
    s: `0x${signature.substr(66, 64)}`,
    v: parseInt(`0x${signature.substr(130, 2)}`) + 27,
    kind: 0,
  };
  const signatureDataTuple = ctx.tuple(signatureData);

  const logs = await xcert.instance.methods.destroyWithSignature(bob, id1, zxc.receipt._address, tokenAmount.toString(), seed, expiration, signatureDataTuple).send({ from: owner });
  ctx.not(logs.events.Transfer, undefined);

  const balance = await xcert.instance.methods.balanceOf(owner).call();
  ctx.is(balance, '1');
  await ctx.reverts(() => xcert.instance.methods.ownerOf(id1).call(), '006002');

  const tokenIndex0 = await xcert.instance.methods.tokenByIndex(0).call();
  ctx.is(tokenIndex0, id2);

  const tokenOwnerIndex0 = await xcert.instance.methods.tokenOfOwnerByIndex(owner, 0).call();
  ctx.is(tokenOwnerIndex0, id2);

  await ctx.reverts(() => xcert.instance.methods.tokenByIndex(1).call(), '006007');
  await ctx.reverts(() => xcert.instance.methods.tokenOfOwnerByIndex(owner, 1).call(), '006007');

  const ownerBalance = await zxc.instance.methods.balanceOf(owner).call();
  ctx.is(ownerBalance.toString(), tokenAmount.toString());
});

spec.test('throws when trying to destroy with invalid signature kind', async (ctx) => {
  const xcert = ctx.get('xcert');
  const zxc = ctx.get('zxc');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const id1 = ctx.get('id1');
  const imprint1 = ctx.get('imprint1');
  const seed = common.getCurrentTime();
  const expiration = common.getCurrentTime() + 3600;
  const decimalsMul = ctx.get('decimalsMul');
  const tokenAmount = decimalsMul.mul(new ctx.web3.utils.BN('100'));

  await xcert.instance.methods.create(bob, id1, imprint1).send({ from: owner });

  await zxc.instance.methods.approve(xcert.receipt._address, tokenAmount.toString()).send({ from: bob });
  const claim = await xcert.instance.methods.generateDestroyClaim(bob, id1, zxc.receipt._address, tokenAmount.toString(), seed, expiration).call();
  const signature = await ctx.web3.eth.sign(claim, bob);
  const signatureData = {
    r: signature.substr(0, 66),
    s: `0x${signature.substr(66, 64)}`,
    v: parseInt(`0x${signature.substr(130, 2)}`) + 27,
    kind: 5,
  };
  const signatureDataTuple = ctx.tuple(signatureData);

  await ctx.reverts(() => xcert.instance.methods.destroyWithSignature(bob, id1, zxc.receipt._address, tokenAmount.toString(), seed, expiration, signatureDataTuple).send({ from: owner }));
});

spec.test('throws when trying to destroy with invalid signature', async (ctx) => {
  const xcert = ctx.get('xcert');
  const zxc = ctx.get('zxc');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const id1 = ctx.get('id1');
  const imprint1 = ctx.get('imprint1');
  const seed = common.getCurrentTime();
  const expiration = common.getCurrentTime() + 3600;
  const decimalsMul = ctx.get('decimalsMul');
  const tokenAmount = decimalsMul.mul(new ctx.web3.utils.BN('100'));

  await xcert.instance.methods.create(bob, id1, imprint1).send({ from: owner });

  await zxc.instance.methods.approve(xcert.receipt._address, tokenAmount.toString()).send({ from: bob });
  const claim = await xcert.instance.methods.generateDestroyClaim(bob, id1, zxc.receipt._address, tokenAmount.toString(), seed, expiration).call();
  const signature = await ctx.web3.eth.sign(claim, owner);
  const signatureData = {
    r: signature.substr(0, 66),
    s: `0x${signature.substr(66, 64)}`,
    v: parseInt(`0x${signature.substr(130, 2)}`) + 27,
    kind: 0,
  };
  const signatureDataTuple = ctx.tuple(signatureData);

  await ctx.reverts(() => xcert.instance.methods.destroyWithSignature(bob, id1, zxc.receipt._address, tokenAmount.toString(), seed, expiration, signatureDataTuple).send({ from: owner }), '007005');
});

spec.test('throws when trying to destroy with signature if signature is from a third party', async (ctx) => {
  const xcert = ctx.get('xcert');
  const zxc = ctx.get('zxc');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const id1 = ctx.get('id1');
  const imprint1 = ctx.get('imprint1');
  const seed = common.getCurrentTime();
  const expiration = common.getCurrentTime() + 3600;
  const decimalsMul = ctx.get('decimalsMul');
  const tokenAmount = decimalsMul.mul(new ctx.web3.utils.BN('100'));

  await xcert.instance.methods.create(bob, id1, imprint1).send({ from: owner });

  await zxc.instance.methods.approve(xcert.receipt._address, tokenAmount.toString()).send({ from: bob });
  const claim = await xcert.instance.methods.generateDestroyClaim(owner, id1, zxc.receipt._address, tokenAmount.toString(), seed, expiration).call();
  const signature = await ctx.web3.eth.sign(claim, owner);
  const signatureData = {
    r: signature.substr(0, 66),
    s: `0x${signature.substr(66, 64)}`,
    v: parseInt(`0x${signature.substr(130, 2)}`) + 27,
    kind: 0,
  };
  const signatureDataTuple = ctx.tuple(signatureData);

  await ctx.reverts(() => xcert.instance.methods.destroyWithSignature(owner, id1, zxc.receipt._address, tokenAmount.toString(), seed, expiration, signatureDataTuple).send({ from: owner }), '007004');
});

spec.test('throws when trying to destroy an already destroyed Xcert with signature', async (ctx) => {
  const xcert = ctx.get('xcert');
  const zxc = ctx.get('zxc');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const id1 = ctx.get('id1');
  const imprint1 = ctx.get('imprint1');
  const seed = common.getCurrentTime();
  const expiration = common.getCurrentTime() + 3600;
  const decimalsMul = ctx.get('decimalsMul');
  const tokenAmount = decimalsMul.mul(new ctx.web3.utils.BN('100'));

  await xcert.instance.methods.create(bob, id1, imprint1).send({ from: owner });
  await xcert.instance.methods.destroy(id1).send({ from: bob});

  await zxc.instance.methods.approve(xcert.receipt._address, tokenAmount.toString()).send({ from: bob });
  const claim = await xcert.instance.methods.generateDestroyClaim(bob, id1, zxc.receipt._address, tokenAmount.toString(), seed, expiration).call();
  const signature = await ctx.web3.eth.sign(claim, bob);
  const signatureData = {
    r: signature.substr(0, 66),
    s: `0x${signature.substr(66, 64)}`,
    v: parseInt(`0x${signature.substr(130, 2)}`) + 27,
    kind: 0,
  };
  const signatureDataTuple = ctx.tuple(signatureData);

  await ctx.reverts(() => xcert.instance.methods.destroyWithSignature(bob, id1, zxc.receipt._address, tokenAmount.toString(), seed, expiration, signatureDataTuple).send({ from: owner }), '006002');
});

export default spec;
