import { Spec } from '@specron/spec';
import { XcertAbilities } from '../core/types';
import * as common from './helpers/common';

interface Data {
  xcert?: any;
  zxc?: any;
  decimalsMul?: any;
  owner?: string;
  bob?: string;
  jane?: string;
  sara?: string;
  zeroAddress?: string;
  id1?: string;
  id2?: string;
  id3?: string;
  uriPrefix?: string;
  uriPostfix?: string;
  digest1?: string;
  digest2?: string;
  digest3?: string;
}

const spec = new Spec<Data>();

spec.beforeEach(async (ctx) => {
  const accounts = await ctx.web3.eth.getAccounts();
  const BN = ctx.web3.utils.BN;
  ctx.set('owner', accounts[0]);
  ctx.set('bob', accounts[1]);
  ctx.set('jane', accounts[2]);
  ctx.set('sara', accounts[3]);
  ctx.set('zeroAddress', '0x0000000000000000000000000000000000000000');
  ctx.set('decimalsMul', new BN('1000000000000000000'));
});

spec.beforeEach(async (ctx) => {
  ctx.set('id1', '123');
  ctx.set('id2', '124');
  ctx.set('id3', '125');
  ctx.set('uriPrefix', 'https://0xcert.org/');
  ctx.set('uriPostfix', '.json');
  ctx.set('digest1', '0x973124ffc4a03e66d6a4458e587d5d6146f71fc57f359c8d516e0b12a50ab0d9');
  ctx.set('digest2', '0x6f25b3f4bc7eadafb8f57d69f8a59db3b23f198151dbf3c66ac3082381518329');
  ctx.set('digest3', '0xc77a290be17f8a4ef301c4ca46497c5beb4a0556ec2d5a04dce4ce6ebd439ad1');
});

spec.beforeEach(async (ctx) => {
  const uriPrefix = ctx.get('uriPrefix');
  const uriPostfix = ctx.get('uriPostfix');
  const xcert = await ctx.deploy({
    src: './build/xcert-mock.json',
    contract: 'XcertMock',
    args: ['Foo', 'F', uriPrefix, uriPostfix, '0x9c22ff5f21f0b81b113e63f7db6da94fedef11b2119b4088b89664fb9a3cb658', []],
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

spec.test('returns correct convention per token', async (ctx) => {
  const xcert = ctx.get('xcert');
  const bob = ctx.get('bob');
  const id = ctx.get('id1');
  const digest = ctx.get('digest1');
  const owner = ctx.get('owner');

  await xcert.instance.methods.create(bob, id, digest).send({ from: owner });
  const convention = await xcert.instance.methods.tokenURISchemaIntegrity(id).call();
  ctx.is(convention.digest, '0x9c22ff5f21f0b81b113e63f7db6da94fedef11b2119b4088b89664fb9a3cb658');
});

spec.test('correctly checks all the supported interfaces', async (ctx) => {
  const xcert = ctx.get('xcert');
  const nftokenInterface = await xcert.instance.methods.supportsInterface('0x80ac58cd').call();
  const nftokenMetadataInterface = await xcert.instance.methods.supportsInterface('0x5b5e139f').call();
  const nftokenMetadataEnumerableInterface = await xcert.instance.methods.supportsInterface('0x780e9d63').call();
  const nonExistingInterface = await xcert.instance.methods.supportsInterface('0xa40e9c95').call();
  ctx.is(nftokenInterface, true);
  ctx.is(nftokenMetadataInterface, true);
  ctx.is(nftokenMetadataEnumerableInterface, true);
  ctx.is(nonExistingInterface, false);
});

spec.test('returns correct balance after creation', async (ctx) => {
  const xcert = ctx.get('xcert');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const id = ctx.get('id1');
  const digest = ctx.get('digest1');

  await xcert.instance.methods.create(bob, id, digest).send({ from: owner });

  const xcertId1Owner = await xcert.instance.methods.ownerOf(id).call();
  ctx.is(xcertId1Owner, bob);

  const bobXcertCount = await xcert.instance.methods.balanceOf(bob).call();
  ctx.is(bobXcertCount, '1');

  const xcertCount = await xcert.instance.methods.totalSupply().call();
  ctx.is(xcertCount, '1');
});

spec.test('throws when trying to create two xcerts with the same id', async (ctx) => {
  const xcert = ctx.get('xcert');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const id = ctx.get('id1');
  const digest = ctx.get('digest1');

  await xcert.instance.methods.create(bob, id, digest).send({ from: owner });
  await ctx.reverts(() => xcert.instance.methods.create(bob, id, digest).send({ from: owner }), '006006');
});

spec.test('throws when a third party tries to create an Xcert', async (ctx) => {
  const xcert = ctx.get('xcert');
  const bob = ctx.get('bob');
  const id = ctx.get('id1');
  const digest = ctx.get('digest1');
  const sara = ctx.get('sara');

  await ctx.reverts(() => xcert.instance.methods.create(bob, id, digest).send({ from: sara }), '017001');
});

spec.test('throws when trying to create an Xcert to zero address', async (ctx) => {
  const xcert = ctx.get('xcert');
  const owner = ctx.get('owner');
  const zeroAddress = ctx.get('zeroAddress');
  const id = ctx.get('id1');
  const digest = ctx.get('digest1');

  await ctx.reverts(() => xcert.instance.methods.create(zeroAddress, id, digest).send({ from: owner }), '006001');
});

spec.test('corectly grants create ability', async (ctx) => {
  const xcert = ctx.get('xcert');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');

  const logs =  await xcert.instance.methods.grantAbilities(bob, XcertAbilities.CREATE_ASSET).send({ from: owner });
  ctx.not(logs.events.SetAbilities, undefined);

  const bobHasAbility1 = await xcert.instance.methods.isAble(bob, XcertAbilities.CREATE_ASSET).call();
  ctx.is(bobHasAbility1, true);
});

spec.test('throws when a third party tries to grant create ability', async (ctx) => {
  const xcert = ctx.get('xcert');
  const bob = ctx.get('bob');
  const sara = ctx.get('sara');

  await ctx.reverts(() => xcert.instance.methods.grantAbilities(bob, XcertAbilities.CREATE_ASSET).send({ from: sara }));
});

spec.test('correctly creates an Xcert from an address with create ability', async (ctx) => {
  const xcert = ctx.get('xcert');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const sara = ctx.get('sara');
  const id = ctx.get('id1');
  const digest = ctx.get('digest1');

  await xcert.instance.methods.grantAbilities(bob, XcertAbilities.CREATE_ASSET).send({ from: owner });
  await xcert.instance.methods.create(sara, id, digest).send({ from: bob });
  const saraXcertCount = await xcert.instance.methods.balanceOf(sara).call();
  ctx.is(saraXcertCount, '1');
});

spec.test('throws trying to create from address which authorization got revoked', async (ctx) => {
  const xcert = ctx.get('xcert');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const sara = ctx.get('sara');
  const id = ctx.get('id1');
  const digest = ctx.get('digest1');

  await xcert.instance.methods.grantAbilities(bob, XcertAbilities.CREATE_ASSET).send({ from: owner });
  await xcert.instance.methods.revokeAbilities(bob, XcertAbilities.CREATE_ASSET).send({ from: owner });
  await ctx.reverts(() => xcert.instance.methods.create(sara, id, digest).send({ from: bob }), '017001');
});

spec.test('throws when trying to find owner of a non-existing Xcert', async (ctx) => {
  const xcert = ctx.get('xcert');
  const id = ctx.get('id1');

  await ctx.reverts(() => xcert.instance.methods.ownerOf(id).call(), '006002');
});

spec.test('finds the correct amount of xcerts owned by account', async (ctx) => {
  const xcert = ctx.get('xcert');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const id = ctx.get('id1');

  const digest = ctx.get('digest1');
  const id2 = ctx.get('id2');
  const digest2 = ctx.get('digest2');

  await xcert.instance.methods.create(bob, id, digest).send({ from: owner });
  await xcert.instance.methods.create(bob, id2, digest2).send({ from: owner });

  const count = await xcert.instance.methods.balanceOf(bob).call();
  ctx.is(count, '2');
});

spec.test('throws when trying to get count of xcerts owned by zero address', async (ctx) => {
  const xcert = ctx.get('xcert');
  const zeroAddress = ctx.get('zeroAddress');
  await ctx.reverts(() => xcert.instance.methods.balanceOf(zeroAddress).call(), '006001');
});

spec.test('throws when trying to find owner of non-existant Xcert', async (ctx) => {
  const xcert = ctx.get('xcert');
  const id = ctx.get('id1');
  await ctx.reverts(() => xcert.instance.methods.ownerOf(id).call(), '006002');
});

spec.test('correctly approves account', async (ctx) => {
  const xcert = ctx.get('xcert');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const sara = ctx.get('sara');
  const id1 = ctx.get('id1');
  const digest1 = ctx.get('digest1');

  await xcert.instance.methods.create(bob, id1, digest1).send({ from: owner });
  const logs = await xcert.instance.methods.approve(sara, id1).send({ from: bob });
  ctx.not(logs.events.Approval, undefined);

  const address = await xcert.instance.methods.getApproved(id1).call();
  ctx.is(address, sara);
});

spec.test('correctly cancels approval', async (ctx) => {
  const xcert = ctx.get('xcert');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const sara = ctx.get('sara');
  const id1 = ctx.get('id1');
  const digest1 = ctx.get('digest1');
  const zeroAddress = ctx.get('zeroAddress');

  await xcert.instance.methods.create(bob, id1, digest1).send({ from: owner });
  await xcert.instance.methods.approve(sara, id1).send({ from: bob });
  await xcert.instance.methods.approve(zeroAddress, id1).send({ from: bob });

  const address = await xcert.instance.methods.getApproved(id1).call();
  ctx.is(address, zeroAddress);
});

spec.test('throws when trying to get approval of non-existing Xcert', async (ctx) => {
  const xcert = ctx.get('xcert');
  const id1 = ctx.get('id1');

  await ctx.reverts(() => xcert.instance.methods.getApproved(id1).call(), '006002');
});

spec.test('throws when trying to approve a Xcert from a third party', async (ctx) => {
  const xcert = ctx.get('xcert');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const sara = ctx.get('sara');
  const id1 = ctx.get('id1');
  const digest1 = ctx.get('digest1');

  await xcert.instance.methods.create(bob, id1, digest1).send({ from: owner });
  await ctx.reverts(() => xcert.instance.methods.approve(sara, id1).send({ from: sara }), '006003');
});

spec.test('correctly sets an operator', async (ctx) => {
  const xcert = ctx.get('xcert');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const sara = ctx.get('sara');
  const id1 = ctx.get('id1');
  const digest1 = ctx.get('digest1');

  await xcert.instance.methods.create(bob, id1, digest1).send({ from: owner });
  const logs = await xcert.instance.methods.setApprovalForAll(sara, true).send({ from: bob });
  ctx.not(logs.events.ApprovalForAll, undefined);
  const isApprovedForAll = await xcert.instance.methods.isApprovedForAll(bob, sara).call();
  ctx.is(isApprovedForAll, true);
});

spec.test('correctly sets then cancels an operator', async (ctx) => {
  const xcert = ctx.get('xcert');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const sara = ctx.get('sara');
  const id1 = ctx.get('id1');
  const digest1 = ctx.get('digest1');

  await xcert.instance.methods.create(bob, id1, digest1).send({ from: owner });
  await xcert.instance.methods.setApprovalForAll(sara, true).send({ from: bob });
  await xcert.instance.methods.setApprovalForAll(sara, false).send({ from: bob });
  const isApprovedForAll = await xcert.instance.methods.isApprovedForAll(bob, sara).call();
  ctx.is(isApprovedForAll, false);
});

/**
 * @notice This test is skipped because ganache cannot handle emmiting Tranfer event from ERC20
 * where there is Transfer event already defined in Xcert.
 */
spec.skip('correctly sets an operator with signature', async (ctx) => {
  const xcert = ctx.get('xcert');
  const zxc = ctx.get('zxc');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const sara = ctx.get('sara');
  const jane = ctx.get('jane');
  const seed = common.getCurrentTime();
  const expiration = common.getCurrentTime() + 3600;
  const decimalsMul = ctx.get('decimalsMul');
  const tokenAmount = decimalsMul.mul(new ctx.web3.utils.BN('100'));

  await zxc.instance.methods.approve(xcert.receipt._address, tokenAmount.toString()).send({ from: bob });
  const claim = await xcert.instance.methods.generateClaim(bob, sara, true, zxc.receipt._address, tokenAmount.toString(), jane, seed, expiration).call();
  const signature = await ctx.web3.eth.sign(claim, bob);
  const signatureData = {
    r: signature.substr(0, 66),
    s: `0x${signature.substr(66, 64)}`,
    v: parseInt(`0x${signature.substr(130, 2)}`) + 27,
    kind: 0,
  };
  const signatureDataTuple = ctx.tuple(signatureData);
  const logs = await xcert.instance.methods
    .setApprovalForAllWithSignature(bob, sara, true, zxc.receipt._address, tokenAmount.toString(), jane, seed, expiration, signatureDataTuple)
    .send({ from: owner });
  ctx.not(logs.events.ApprovalForAll, undefined);
  const isApprovedForAll = await xcert.instance.methods.isApprovedForAll(bob, sara).call();
  ctx.is(isApprovedForAll, true);

  const janeBalance = await zxc.instance.methods.balanceOf(jane).call();
  ctx.is(janeBalance.toString(), tokenAmount.toString());
});

/**
 * @notice This test is skipped because ganache cannot handle emmiting Tranfer event from ERC20
 * where there is Transfer event already defined in Xcert.
 */
spec.skip('correctly sets an operator with signature when fee recipient is not specified', async (ctx) => {
  const xcert = ctx.get('xcert');
  const zxc = ctx.get('zxc');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const sara = ctx.get('sara');
  const zeroAddress = ctx.get('zeroAddress');
  const seed = common.getCurrentTime();
  const expiration = common.getCurrentTime() + 3600;
  const decimalsMul = ctx.get('decimalsMul');
  const tokenAmount = decimalsMul.mul(new ctx.web3.utils.BN('100'));

  await zxc.instance.methods.approve(xcert.receipt._address, tokenAmount.toString()).send({ from: bob });
  const claim = await xcert.instance.methods.generateClaim(bob, sara, true, zxc.receipt._address, tokenAmount.toString(), zeroAddress, seed, expiration).call();
  const signature = await ctx.web3.eth.sign(claim, bob);
  const signatureData = {
    r: signature.substr(0, 66),
    s: `0x${signature.substr(66, 64)}`,
    v: parseInt(`0x${signature.substr(130, 2)}`) + 27,
    kind: 0,
  };
  const signatureDataTuple = ctx.tuple(signatureData);
  const logs = await xcert.instance.methods
    .setApprovalForAllWithSignature(bob, sara, true, zxc.receipt._address, tokenAmount.toString(), zeroAddress, seed, expiration, signatureDataTuple)
    .send({ from: owner });
  ctx.not(logs.events.ApprovalForAll, undefined);
  const isApprovedForAll = await xcert.instance.methods.isApprovedForAll(bob, sara).call();
  ctx.is(isApprovedForAll, true);

  const ownerBalance = await zxc.instance.methods.balanceOf(owner).call();
  ctx.is(ownerBalance.toString(), tokenAmount.toString());
});

spec.test('fails setting an operator with signature if signature kind is invalid', async (ctx) => {
  const xcert = ctx.get('xcert');
  const zxc = ctx.get('zxc');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const sara = ctx.get('sara');
  const jane = ctx.get('jane');
  const seed = common.getCurrentTime();
  const expiration = common.getCurrentTime() + 3600;
  const decimalsMul = ctx.get('decimalsMul');
  const tokenAmount = decimalsMul.mul(new ctx.web3.utils.BN('100'));

  await zxc.instance.methods.approve(xcert.receipt._address, tokenAmount.toString()).send({ from: bob });
  const claim = await xcert.instance.methods.generateClaim(bob, sara, true, zxc.receipt._address, tokenAmount.toString(), jane, seed, expiration).call();
  const signature = await ctx.web3.eth.sign(claim, bob);
  const signatureData = {
    r: signature.substr(0, 66),
    s: `0x${signature.substr(66, 64)}`,
    v: parseInt(`0x${signature.substr(130, 2)}`) + 27,
    kind: 3,
  };
  const signatureDataTuple = ctx.tuple(signatureData);
  await ctx.reverts(
    () => xcert.instance.methods.setApprovalForAllWithSignature(bob, sara, true, zxc.receipt._address, tokenAmount.toString(), jane, seed, expiration, signatureDataTuple)
      .send({ from: owner }));
});

spec.test('fails setting an operator with signature if signature is from a third party', async (ctx) => {
  const xcert = ctx.get('xcert');
  const zxc = ctx.get('zxc');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const sara = ctx.get('sara');
  const jane = ctx.get('jane');
  const seed = common.getCurrentTime();
  const expiration = common.getCurrentTime() + 3600;
  const decimalsMul = ctx.get('decimalsMul');
  const tokenAmount = decimalsMul.mul(new ctx.web3.utils.BN('100'));

  await zxc.instance.methods.approve(xcert.receipt._address, tokenAmount.toString()).send({ from: bob });
  const claim = await xcert.instance.methods.generateClaim(bob, sara, true, zxc.receipt._address, tokenAmount.toString(), jane, seed, expiration).call();
  const signature = await ctx.web3.eth.sign(claim, owner);
  const signatureData = {
    r: signature.substr(0, 66),
    s: `0x${signature.substr(66, 64)}`,
    v: parseInt(`0x${signature.substr(130, 2)}`) + 27,
    kind: 0,
  };
  const signatureDataTuple = ctx.tuple(signatureData);
  await ctx.reverts(
    () => xcert.instance.methods.setApprovalForAllWithSignature(bob, sara, true, zxc.receipt._address, tokenAmount.toString(), jane, seed, expiration, signatureDataTuple)
      .send({ from: owner }), '007005');
});

/**
 * @notice This test is skipped because ganache cannot handle emmiting Tranfer event from ERC20
 * where there is Transfer event already defined in Xcert.
 */
spec.skip('fails setting an operator with signature if claim was already used', async (ctx) => {
  const xcert = ctx.get('xcert');
  const zxc = ctx.get('zxc');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const sara = ctx.get('sara');
  const jane = ctx.get('jane');
  const seed = common.getCurrentTime();
  const expiration = common.getCurrentTime() + 3600;
  const decimalsMul = ctx.get('decimalsMul');
  const tokenAmount = decimalsMul.mul(new ctx.web3.utils.BN('100'));

  await zxc.instance.methods.approve(xcert.receipt._address, tokenAmount.toString()).send({ from: bob });
  const claim = await xcert.instance.methods.generateClaim(bob, sara, true, zxc.receipt._address, tokenAmount.toString(), jane, seed, expiration).call();
  const signature = await ctx.web3.eth.sign(claim, bob);
  const signatureData = {
    r: signature.substr(0, 66),
    s: `0x${signature.substr(66, 64)}`,
    v: parseInt(`0x${signature.substr(130, 2)}`) + 27,
    kind: 0,
  };
  const signatureDataTuple = ctx.tuple(signatureData);
  await xcert.instance.methods.setApprovalForAllWithSignature(bob, sara, true, zxc.receipt._address, tokenAmount.toString(), jane, seed, expiration, signatureDataTuple).send({ from: owner });
  await ctx.reverts(
    () => xcert.instance.methods.setApprovalForAllWithSignature(bob, sara, true, zxc.receipt._address, tokenAmount.toString(), jane, seed, expiration, signatureDataTuple)
      .send({ from: owner }), '007007');
});

spec.test('fails setting an operator with signature if claim has expired', async (ctx) => {
  const xcert = ctx.get('xcert');
  const zxc = ctx.get('zxc');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const sara = ctx.get('sara');
  const jane = ctx.get('jane');
  const seed = common.getCurrentTime();
  const expiration = common.getCurrentTime() - 3600;
  const decimalsMul = ctx.get('decimalsMul');
  const tokenAmount = decimalsMul.mul(new ctx.web3.utils.BN('100'));

  await zxc.instance.methods.approve(xcert.receipt._address, tokenAmount.toString()).send({ from: bob });
  const claim = await xcert.instance.methods.generateClaim(bob, sara, true, zxc.receipt._address, tokenAmount.toString(), jane, seed, expiration).call();
  const signature = await ctx.web3.eth.sign(claim, bob);
  const signatureData = {
    r: signature.substr(0, 66),
    s: `0x${signature.substr(66, 64)}`,
    v: parseInt(`0x${signature.substr(130, 2)}`) + 27,
    kind: 0,
  };
  const signatureDataTuple = ctx.tuple(signatureData);
  await ctx.reverts(
    () => xcert.instance.methods.setApprovalForAllWithSignature(bob, sara, true, zxc.receipt._address, tokenAmount.toString(), jane, seed, expiration, signatureDataTuple)
      .send({ from: owner }), '007008');
});

spec.test('sucessfully cancels set an operator with signature claim', async (ctx) => {
  const xcert = ctx.get('xcert');
  const zxc = ctx.get('zxc');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const sara = ctx.get('sara');
  const jane = ctx.get('jane');
  const seed = common.getCurrentTime();
  const expiration = common.getCurrentTime() + 3600;
  const decimalsMul = ctx.get('decimalsMul');
  const tokenAmount = decimalsMul.mul(new ctx.web3.utils.BN('100'));

  await zxc.instance.methods.approve(xcert.receipt._address, tokenAmount.toString()).send({ from: bob });
  await xcert.instance.methods
    .cancelSetApprovalForAllWithSignature(bob, sara, true, zxc.receipt._address, tokenAmount.toString(), jane, seed, expiration)
    .send({ from: bob });

  const claim = await xcert.instance.methods.generateClaim(bob, sara, true, zxc.receipt._address, tokenAmount.toString(), jane, seed, expiration).call();
  const signature = await ctx.web3.eth.sign(claim, bob);
  const signatureData = {
    r: signature.substr(0, 66),
    s: `0x${signature.substr(66, 64)}`,
    v: parseInt(`0x${signature.substr(130, 2)}`) + 27,
    kind: 0,
  };
  const signatureDataTuple = ctx.tuple(signatureData);
  await ctx.reverts(() => xcert.instance.methods
    .setApprovalForAllWithSignature(bob, sara, true, zxc.receipt._address, tokenAmount.toString(), jane, seed, expiration, signatureDataTuple)
    .send({ from: owner }), '007009');
});

spec.test('fails canceling set an operator with signature claim when sender is not the owner', async (ctx) => {
  const xcert = ctx.get('xcert');
  const zxc = ctx.get('zxc');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const sara = ctx.get('sara');
  const jane = ctx.get('jane');
  const seed = common.getCurrentTime();
  const expiration = common.getCurrentTime() + 3600;
  const decimalsMul = ctx.get('decimalsMul');
  const tokenAmount = decimalsMul.mul(new ctx.web3.utils.BN('100'));

  await zxc.instance.methods.approve(xcert.receipt._address, tokenAmount.toString()).send({ from: bob });
  await ctx.reverts(() => xcert.instance.methods
    .cancelSetApprovalForAllWithSignature(bob, sara, true, zxc.receipt._address, tokenAmount.toString(), jane, seed, expiration)
    .send({ from: owner }), '007010');
});

spec.test('corectly transfers Xcert from owner', async (ctx) => {
  const xcert = ctx.get('xcert');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const sara = ctx.get('sara');
  const id1 = ctx.get('id1');
  const digest1 = ctx.get('digest1');

  await xcert.instance.methods.create(bob, id1, digest1).send({ from: owner });
  const logs = await xcert.instance.methods.transferFrom(bob, sara, id1).send({ from: bob });
  ctx.not(logs.events.Transfer, undefined);

  const bobBalance = await xcert.instance.methods.balanceOf(bob).call();
  const saraBalance = await xcert.instance.methods.balanceOf(sara).call();
  const ownerOfId1 =  await xcert.instance.methods.ownerOf(id1).call();

  ctx.is(bobBalance, '0');
  ctx.is(saraBalance, '1');
  ctx.is(ownerOfId1, sara);
});

spec.test('corectly transfers Xcert from approved address', async (ctx) => {
  const xcert = ctx.get('xcert');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const sara = ctx.get('sara');
  const jane = ctx.get('jane');
  const zeroAddress = ctx.get('zeroAddress');
  const id1 = ctx.get('id1');
  const digest1 = ctx.get('digest1');

  await xcert.instance.methods.create(bob, id1, digest1).send({ from: owner });
  await xcert.instance.methods.approve(sara, id1).send({ from: bob });
  await xcert.instance.methods.transferFrom(bob, jane, id1).send({ from: sara });

  const bobBalance = await xcert.instance.methods.balanceOf(bob).call();
  const janeBalance = await xcert.instance.methods.balanceOf(jane).call();
  const ownerOfId1 =  await xcert.instance.methods.ownerOf(id1).call();
  const isApproved = await xcert.instance.methods.getApproved(id1).call();

  ctx.is(isApproved, zeroAddress);
  ctx.is(bobBalance, '0');
  ctx.is(janeBalance, '1');
  ctx.is(ownerOfId1, jane);
});

spec.test('corectly transfers Xcert as operator', async (ctx) => {
  const xcert = ctx.get('xcert');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const sara = ctx.get('sara');
  const jane = ctx.get('jane');
  const id1 = ctx.get('id1');
  const digest1 = ctx.get('digest1');

  await xcert.instance.methods.create(bob, id1, digest1).send({ from: owner });
  await xcert.instance.methods.setApprovalForAll(sara, true).send({ from: bob });
  await xcert.instance.methods.transferFrom(bob, jane, id1).send({ from: sara });

  const bobBalance = await xcert.instance.methods.balanceOf(bob).call();
  const janeBalance = await xcert.instance.methods.balanceOf(jane).call();
  const ownerOfId1 =  await xcert.instance.methods.ownerOf(id1).call();

  ctx.is(bobBalance, '0');
  ctx.is(janeBalance, '1');
  ctx.is(ownerOfId1, jane);
});

spec.test('throws when trying to transfer Xcert as an address that is not owner, approved or operator', async (ctx) => {
  const xcert = ctx.get('xcert');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const sara = ctx.get('sara');
  const jane = ctx.get('jane');
  const id1 = ctx.get('id1');
  const digest1 = ctx.get('digest1');

  await xcert.instance.methods.create(bob, id1, digest1).send({ from: owner });
  await ctx.reverts(() => xcert.instance.methods.transferFrom(bob, jane, id1).send({ from: sara }), '006004');
});

spec.test('throws when trying to transfer Xcert to a zero address', async (ctx) => {
  const xcert = ctx.get('xcert');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const zeroAddress = ctx.get('zeroAddress');
  const id1 = ctx.get('id1');
  const digest1 = ctx.get('digest1');

  await xcert.instance.methods.create(bob, id1, digest1).send({ from: owner });
  await ctx.reverts(() => xcert.instance.methods.transferFrom(bob, zeroAddress, id1).send({ from: bob }), '006001');
});

spec.test('throws when trying to transfer a invalid Xcert', async (ctx) => {
  const xcert = ctx.get('xcert');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const sara = ctx.get('sara');
  const id1 = ctx.get('id1');
  const digest1 = ctx.get('digest1');
  const id2 = ctx.get('id2');

  await xcert.instance.methods.create(bob, id1, digest1).send({ from: owner });
  await ctx.reverts(() => xcert.instance.methods.transferFrom(bob, sara, id2).send({ from: bob }), '006002');
});

spec.test('corectly safe transfers Xcert from owner', async (ctx) => {
  const xcert = ctx.get('xcert');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const sara = ctx.get('sara');
  const id1 = ctx.get('id1');
  const digest1 = ctx.get('digest1');

  await xcert.instance.methods.create(bob, id1, digest1).send({ from: owner });
  const logs = await xcert.instance.methods.safeTransferFrom(bob, sara, id1).send({ from: bob });
  ctx.not(logs.events.Transfer, undefined);

  const bobBalance = await xcert.instance.methods.balanceOf(bob).call();
  const saraBalance = await xcert.instance.methods.balanceOf(sara).call();
  const ownerOfId1 =  await xcert.instance.methods.ownerOf(id1).call();

  ctx.is(bobBalance, '0');
  ctx.is(saraBalance, '1');
  ctx.is(ownerOfId1, sara);
});

spec.test('throws when trying to safe transfers Xcert from owner to a smart contract', async (ctx) => {
  const xcert = ctx.get('xcert');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const id1 = ctx.get('id1');
  const digest1 = ctx.get('digest1');

  await xcert.instance.methods.create(bob, id1, digest1).send({ from: owner });
  await ctx.reverts(() => xcert.instance.methods.safeTransferFrom(bob, xcert.receipt._address, id1).send({ from: bob }));
});

spec.test('corectly safe transfers xcert from owner to smart contract that can recieve NTFs', async (ctx) => {
  const xcert = ctx.get('xcert');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const id1 = ctx.get('id1');
  const digest1 = ctx.get('digest1');

  const tokenReceiver = await ctx.deploy({
    src: '@0xcert/ethereum-erc721-contracts/build/nf-token-receiver-test-mock.json',
    contract: 'NFTokenReceiverTestMock',
  });

  await xcert.instance.methods.create(bob, id1, digest1).send({ from: owner });
  await xcert.instance.methods.safeTransferFrom(bob, tokenReceiver.receipt._address, id1).send({ from: bob });

  const bobBalance = await xcert.instance.methods.balanceOf(bob).call();
  const saraBalance = await xcert.instance.methods.balanceOf(tokenReceiver.receipt._address).call();
  const ownerOfId1 =  await xcert.instance.methods.ownerOf(id1).call();

  ctx.is(bobBalance, '0');
  ctx.is(saraBalance, '1');
  ctx.is(ownerOfId1, tokenReceiver.receipt._address);
});

spec.test('corectly safe transfers xcert from owner to smart contract that can recieve NFTs with data', async (ctx) => {
  const xcert = ctx.get('xcert');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const id1 = ctx.get('id1');
  const digest1 = ctx.get('digest1');

  const tokenReceiver = await ctx.deploy({
    src: '@0xcert/ethereum-erc721-contracts/build/nf-token-receiver-test-mock.json',
    contract: 'NFTokenReceiverTestMock',
  });

  await xcert.instance.methods.create(bob, id1, digest1).send({ from: owner });
  await xcert.instance.methods.safeTransferFrom(bob, tokenReceiver.receipt._address, id1, '0x01').send({ from: bob });

  const bobBalance = await xcert.instance.methods.balanceOf(bob).call();
  const saraBalance = await xcert.instance.methods.balanceOf(tokenReceiver.receipt._address).call();
  const ownerOfId1 =  await xcert.instance.methods.ownerOf(id1).call();

  ctx.is(bobBalance, '0');
  ctx.is(saraBalance, '1');
  ctx.is(ownerOfId1, tokenReceiver.receipt._address);
});

spec.test('returns the correct issuer name', async (ctx) => {
  const xcert = ctx.get('xcert');
  const name = await xcert.instance.methods.name().call();

  ctx.is(name, 'Foo');
});

spec.test('returns the correct issuer symbol', async (ctx) => {
  const xcert = ctx.get('xcert');
  const symbol = await xcert.instance.methods.symbol().call();

  ctx.is(symbol, 'F');
});
spec.test('return the correct URI', async (ctx) => {
  const xcert = ctx.get('xcert');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const id1 = ctx.get('id1');
  const id2 = ctx.get('id2');
  const digest1 = ctx.get('digest1');
  const digest2 = ctx.get('digest2');
  const digest3 = ctx.get('digest3');
  const uriPrefix = ctx.get('uriPrefix');
  const uriPostfix = ctx.get('uriPostfix');

  await xcert.instance.methods.create(bob, id1, digest1).send({ from: owner });
  let uri = await xcert.instance.methods.tokenURI(id1).call();
  ctx.is(uri, uriPrefix + id1 + uriPostfix);

  await xcert.instance.methods.create(bob, id2, digest2).send({ from: owner });
  uri = await xcert.instance.methods.tokenURI(id2).call();
  ctx.is(uri, uriPrefix + id2 + uriPostfix);

  const bigId = new ctx.web3.utils.BN('115792089237316195423570985008687907853269984665640564039457584007913129639935').toString();
  await xcert.instance.methods.create(bob, bigId, digest3).send({ from: owner });
  uri = await xcert.instance.methods.tokenURI(bigId).call();
  ctx.is(uri, uriPrefix + bigId + uriPostfix);
});

spec.test('succesfully changes URI prefix', async (ctx) => {
  const xcert = ctx.get('xcert');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const id1 = ctx.get('id1');
  const digest1 = ctx.get('digest1');
  const uriPrefix = ctx.get('uriPrefix');
  const uriPostfix = ctx.get('uriPostfix');
  const newUriPrefix = 'https://example.com/';

  await xcert.instance.methods.create(bob, id1, digest1).send({ from: owner });
  let uri = await xcert.instance.methods.tokenURI(id1).call();
  ctx.is(uri, uriPrefix + id1 + uriPostfix);

  await xcert.instance.methods.setUri(newUriPrefix, uriPostfix).send({ from: owner });
  uri = await xcert.instance.methods.tokenURI(id1).call();
  ctx.is(uri, newUriPrefix + id1 + uriPostfix);
});

spec.test('succesfully changes URI postfix', async (ctx) => {
  const xcert = ctx.get('xcert');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const id1 = ctx.get('id1');
  const digest1 = ctx.get('digest1');
  const uriPrefix = ctx.get('uriPrefix');
  const uriPostfix = ctx.get('uriPostfix');
  const newPostfix = '/metadata';

  await xcert.instance.methods.create(bob, id1, digest1).send({ from: owner });
  let uri = await xcert.instance.methods.tokenURI(id1).call();
  ctx.is(uri, uriPrefix + id1 + uriPostfix);

  await xcert.instance.methods.setUri(uriPrefix, newPostfix).send({ from: owner });
  uri = await xcert.instance.methods.tokenURI(id1).call();
  ctx.is(uri, uriPrefix + id1 + newPostfix);
});

spec.test('succesfully changes URI postfix to empty', async (ctx) => {
  const xcert = ctx.get('xcert');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const id1 = ctx.get('id1');
  const digest1 = ctx.get('digest1');
  const uriPrefix = ctx.get('uriPrefix');
  const uriPostfix = ctx.get('uriPostfix');
  const newPostfix = '';

  await xcert.instance.methods.create(bob, id1, digest1).send({ from: owner });
  let uri = await xcert.instance.methods.tokenURI(id1).call();
  ctx.is(uri, uriPrefix + id1 + uriPostfix);

  await xcert.instance.methods.setUri(uriPrefix, newPostfix).send({ from: owner });
  uri = await xcert.instance.methods.tokenURI(id1).call();
  ctx.is(uri, uriPrefix + id1 + newPostfix);
});

spec.test('return empty string if URI prefix is empty', async (ctx) => {
  const xcert = ctx.get('xcert');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const id1 = ctx.get('id1');
  const digest1 = ctx.get('digest1');
  const uriPrefix = ctx.get('uriPrefix');
  const uriPostfix = ctx.get('uriPostfix');
  const newUriPrefix = '';

  await xcert.instance.methods.create(bob, id1, digest1).send({ from: owner });
  let uri = await xcert.instance.methods.tokenURI(id1).call();
  ctx.is(uri, uriPrefix + id1 + uriPostfix);

  await xcert.instance.methods.setUri(newUriPrefix, uriPostfix).send({ from: owner });
  uri = await xcert.instance.methods.tokenURI(id1).call();
  ctx.is(uri, '');
});

spec.test('throws when trying to get URI of invalid NFT ID', async (ctx) => {
  const xcert = ctx.get('xcert');
  const id1 = ctx.get('id1');

  await ctx.reverts(() => xcert.instance.methods.tokenURI(id1).call(), '006002');
});

spec.test('returns the correct token by index', async (ctx) => {
  const xcert = ctx.get('xcert');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const sara = ctx.get('sara');
  const id1 = ctx.get('id1');
  const id2 = ctx.get('id2');
  const id3 = ctx.get('id3');
  const digest1 = ctx.get('digest1');
  const digest2 = ctx.get('digest2');
  const digest3 = ctx.get('digest3');

  await xcert.instance.methods.create(bob, id1, digest1).send({ from: owner });
  await xcert.instance.methods.create(bob, id2, digest2).send({ from: owner });
  await xcert.instance.methods.create(sara, id3, digest3).send({ from: owner });

  const tokenIndex0 = await xcert.instance.methods.tokenByIndex(0).call();
  const tokenIndex1 = await xcert.instance.methods.tokenByIndex(1).call();
  const tokenIndex2 = await xcert.instance.methods.tokenByIndex(2).call();

  ctx.is(tokenIndex0, id1);
  ctx.is(tokenIndex1, id2);
  ctx.is(tokenIndex2, id3);
});

spec.test('throws when trying to get xcert by non-existing index', async (ctx) => {
  const xcert = ctx.get('xcert');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const id1 = ctx.get('id1');
  const digest1 = ctx.get('digest1');

  await xcert.instance.methods.create(bob, id1, digest1).send({ from: owner });
  await ctx.reverts(() => xcert.instance.methods.tokenByIndex(1).call(), '006007');
});

spec.test('returns the correct token of owner by index', async (ctx) => {
  const xcert = ctx.get('xcert');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const sara = ctx.get('sara');
  const id1 = ctx.get('id1');
  const id2 = ctx.get('id2');
  const id3 = ctx.get('id3');
  const digest1 = ctx.get('digest1');
  const digest2 = ctx.get('digest2');
  const digest3 = ctx.get('digest3');

  await xcert.instance.methods.create(bob, id1, digest1).send({ from: owner });
  await xcert.instance.methods.create(bob, id2, digest2).send({ from: owner });
  await xcert.instance.methods.create(sara, id3, digest3).send({ from: owner });

  const tokenOwnerIndex1 = await xcert.instance.methods.tokenOfOwnerByIndex(bob, 1).call();
  ctx.is(tokenOwnerIndex1, id2);
});

spec.test('throws when trying to get xcert of owner by non-existing index', async (ctx) => {
  const xcert = ctx.get('xcert');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const id1 = ctx.get('id1');
  const digest1 = ctx.get('digest1');

  await xcert.instance.methods.create(bob, id1, digest1).send({ from: owner });
  await ctx.reverts(() => xcert.instance.methods.tokenOfOwnerByIndex(bob, 1).call(), '006007');
});

spec.test('returns the correct token uri integrity digest', async (ctx) => {
  const xcert = ctx.get('xcert');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const id = ctx.get('id1');
  const digest = ctx.get('digest1');

  await xcert.instance.methods.create(bob, id, digest).send({ from: owner });
  const xcertId1Imprint = await xcert.instance.methods.tokenURIIntegrity(id).call();
  ctx.is(xcertId1Imprint.digest, digest);
});

spec.test('throws when trying to use revoke capability', async (ctx) => {
  const xcert = ctx.get('xcert');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const id1 = ctx.get('id1');
  const digest1 = ctx.get('digest1');

  await xcert.instance.methods.create(bob, id1, digest1).send({ from: owner });
  await ctx.reverts(() => xcert.instance.methods.revoke(id1).send({ from: owner }), '007001');
});

spec.test('throws when trying to use pause capability', async (ctx) => {
  const xcert = ctx.get('xcert');
  const owner = ctx.get('owner');

  await ctx.reverts(() => xcert.instance.methods.setPause(true).send({ from: owner }), '007001');
});

spec.test('throws when trying to use mutable capability', async (ctx) => {
  const xcert = ctx.get('xcert');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const id1 = ctx.get('id1');
  const digest1 = ctx.get('digest1');
  const newImprint = ctx.get('digest2');

  await xcert.instance.methods.create(bob, id1, digest1).send({ from: owner });
  await ctx.reverts(() => xcert.instance.methods.updateTokenURIIntegrityDigest(id1, newImprint).send({ from: owner }), '007001');
});

spec.test('throws when trying to use destroy capability', async (ctx) => {
  const xcert = ctx.get('xcert');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const id1 = ctx.get('id1');
  const digest1 = ctx.get('digest1');

  await xcert.instance.methods.create(bob, id1, digest1).send({ from: owner });
  await ctx.reverts(() => xcert.instance.methods.destroy(id1).send({ from: bob }), '007001');
});

export default spec;
