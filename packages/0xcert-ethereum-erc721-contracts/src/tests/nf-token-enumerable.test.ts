import { Spec } from '@specron/spec';

interface Data {
  nfToken?: any;
  owner?: string;
  bob?: string;
  jane?: string;
  sara?: string;
  zeroAddress?: string;
  id1?: string;
  id2?: string;
  id3?: string;
}

const spec = new Spec<Data>();

spec.beforeEach(async (ctx) => {
  const accounts = await ctx.web3.eth.getAccounts();
  ctx.set('owner', accounts[0]);
  ctx.set('bob', accounts[1]);
  ctx.set('jane', accounts[2]);
  ctx.set('sara', accounts[3]);
  ctx.set('zeroAddress', '0x0000000000000000000000000000000000000000');
});

spec.beforeEach(async (ctx) => {
  ctx.set('id1', '123');
  ctx.set('id2', '124');
  ctx.set('id3', '125');
});

spec.beforeEach(async (ctx) => {
  const nfToken = await ctx.deploy({
    src: './build/nf-token-enumerable-test-mock.json',
    contract: 'NFTokenEnumerableTestMock',
  });
  ctx.set('nfToken', nfToken);
});

spec.test('correctly checks all the supported interfaces', async (ctx) => {
  const nftoken = ctx.get('nfToken');
  const nftokenInterface = await nftoken.instance.methods.supportsInterface('0x80ac58cd').call();
  const nftokenEnumerableInterface = await nftoken.instance.methods.supportsInterface('0x780e9d63').call();
  const nftokenNonExistingInterface = await nftoken.instance.methods.supportsInterface('0x5b5e139f').call();
  ctx.is(nftokenInterface, true);
  ctx.is(nftokenEnumerableInterface, true);
  ctx.is(nftokenNonExistingInterface, false);
});

spec.test('correctly creates a NFT', async (ctx) => {
  const nftoken = ctx.get('nfToken');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const id1 = ctx.get('id1');

  const logs = await nftoken.instance.methods.create(bob, id1).send({ from: owner });
  ctx.not(logs.events.Transfer, undefined);
  const count = await nftoken.instance.methods.balanceOf(bob).call();
  ctx.is(count.toString(), '1');
  const totalSupply = await nftoken.instance.methods.totalSupply().call();
  ctx.is(totalSupply.toString(), '1');
});

spec.test('returns correct balanceOf', async (ctx) => {
  const nftoken = ctx.get('nfToken');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const id1 = ctx.get('id1');
  const id2 = ctx.get('id2');

  let count = await nftoken.instance.methods.balanceOf(bob).call();
  ctx.is(count.toString(), '0');

  await nftoken.instance.methods.create(bob, id1).send({ from: owner });
  count = await nftoken.instance.methods.balanceOf(bob).call();
  ctx.is(count.toString(), '1');

  await nftoken.instance.methods.create(bob, id2).send({ from: owner });
  count = await nftoken.instance.methods.balanceOf(bob).call();
  ctx.is(count.toString(), '2');
});

spec.test('throws when trying to get count of NFTs owned by 0x0 address', async (ctx) => {
  const nftoken = ctx.get('nfToken');
  const zeroAddress = ctx.get('zeroAddress');

  await ctx.reverts(() => nftoken.instance.methods.balanceOf(zeroAddress).call(), '005001');
});

spec.test('throws when trying to create 2 NFTs with the same ids', async (ctx) => {
  const nftoken = ctx.get('nfToken');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const id1 = ctx.get('id1');
  await nftoken.instance.methods.create(bob, id1).send({ from: owner });
  await ctx.reverts(() => nftoken.instance.methods.create(bob, id1).send({ from: owner }), '005006');
});

spec.test('throws when trying to create NFT to 0x0 address', async (ctx) => {
  const nftoken = ctx.get('nfToken');
  const owner = ctx.get('owner');
  const zeroAddress = ctx.get('zeroAddress');
  const id1 = ctx.get('id1');
  await ctx.reverts(() => nftoken.instance.methods.create(zeroAddress, id1).send({ from: owner }), '005001');
});

spec.test('finds the correct owner of NFToken id', async (ctx) => {
  const nftoken = ctx.get('nfToken');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const id1 = ctx.get('id1');

  await nftoken.instance.methods.create(bob, id1).send({ from: owner });
  const id1Owner = await nftoken.instance.methods.ownerOf(id1).call();
  ctx.is(id1Owner, bob);
});

spec.test('throws when trying to find owner od non-existing NFT id', async (ctx) => {
  const nftoken = ctx.get('nfToken');
  const id1 = ctx.get('id1');

  await ctx.reverts(() => nftoken.instance.methods.ownerOf(id1).call(), '005002');
});

spec.test('correctly approves account', async (ctx) => {
  const nftoken = ctx.get('nfToken');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const sara = ctx.get('sara');
  const id1 = ctx.get('id1');

  await nftoken.instance.methods.create(bob, id1).send({ from: owner });
  const logs = await nftoken.instance.methods.approve(sara, id1).send({ from: bob });
  ctx.not(logs.events.Approval, undefined);

  const address = await nftoken.instance.methods.getApproved(id1).call();
  ctx.is(address, sara);
});

spec.test('correctly cancels approval', async (ctx) => {
  const nftoken = ctx.get('nfToken');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const sara = ctx.get('sara');
  const id1 = ctx.get('id1');
  const zeroAddress = ctx.get('zeroAddress');

  await nftoken.instance.methods.create(bob, id1).send({ from: owner });
  await nftoken.instance.methods.approve(sara, id1).send({ from: bob });
  await nftoken.instance.methods.approve(zeroAddress, id1).send({ from: bob });

  const address = await nftoken.instance.methods.getApproved(id1).call();
  ctx.is(address, zeroAddress);
});

spec.test('throws when trying to get approval of non-existing NFT id', async (ctx) => {
  const nftoken = ctx.get('nfToken');
  const id1 = ctx.get('id1');

  await ctx.reverts(() => nftoken.instance.methods.getApproved(id1).call(), '005002');
});

spec.test('throws when trying to approve NFT ID from a third party', async (ctx) => {
  const nftoken = ctx.get('nfToken');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const sara = ctx.get('sara');
  const id1 = ctx.get('id1');

  await nftoken.instance.methods.create(bob, id1).send({ from: owner });
  await ctx.reverts(() => nftoken.instance.methods.approve(sara, id1).send({ from: sara }), '005003');
});

spec.test('correctly sets an operator', async (ctx) => {
  const nftoken = ctx.get('nfToken');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const sara = ctx.get('sara');
  const id1 = ctx.get('id1');

  await nftoken.instance.methods.create(bob, id1).send({ from: owner });
  const logs = await nftoken.instance.methods.setApprovalForAll(sara, true).send({ from: bob });
  ctx.not(logs.events.ApprovalForAll, undefined);
  const isApprovedForAll = await nftoken.instance.methods.isApprovedForAll(bob, sara).call();
  ctx.is(isApprovedForAll, true);
});

spec.test('correctly sets then cancels an operator', async (ctx) => {
  const nftoken = ctx.get('nfToken');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const sara = ctx.get('sara');
  const id1 = ctx.get('id1');

  await nftoken.instance.methods.create(bob, id1).send({ from: owner });
  await nftoken.instance.methods.setApprovalForAll(sara, true).send({ from: bob });
  await nftoken.instance.methods.setApprovalForAll(sara, false).send({ from: bob });
  const isApprovedForAll = await nftoken.instance.methods.isApprovedForAll(bob, sara).call();
  ctx.is(isApprovedForAll, false);
});

spec.test('corectly transfers NFT from owner', async (ctx) => {
  const nftoken = ctx.get('nfToken');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const sara = ctx.get('sara');
  const id1 = ctx.get('id1');

  await nftoken.instance.methods.create(bob, id1).send({ from: owner });
  const logs = await nftoken.instance.methods.transferFrom(bob, sara, id1).send({ from: bob });
  ctx.not(logs.events.Transfer, undefined);

  const bobBalance = await nftoken.instance.methods.balanceOf(bob).call();
  const saraBalance = await nftoken.instance.methods.balanceOf(sara).call();
  const ownerOfId1 =  await nftoken.instance.methods.ownerOf(id1).call();

  ctx.is(bobBalance, '0');
  ctx.is(saraBalance, '1');
  ctx.is(ownerOfId1, sara);
});

spec.test('corectly transfers NFT from approved address', async (ctx) => {
  const nftoken = ctx.get('nfToken');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const sara = ctx.get('sara');
  const jane = ctx.get('jane');
  const id1 = ctx.get('id1');

  await nftoken.instance.methods.create(bob, id1).send({ from: owner });
  await nftoken.instance.methods.approve(sara, id1).send({ from: bob });
  await nftoken.instance.methods.transferFrom(bob, jane, id1).send({ from: sara });

  const bobBalance = await nftoken.instance.methods.balanceOf(bob).call();
  const janeBalance = await nftoken.instance.methods.balanceOf(jane).call();
  const ownerOfId1 =  await nftoken.instance.methods.ownerOf(id1).call();

  ctx.is(bobBalance, '0');
  ctx.is(janeBalance, '1');
  ctx.is(ownerOfId1, jane);
});

spec.test('corectly transfers NFT as operator', async (ctx) => {
  const nftoken = ctx.get('nfToken');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const sara = ctx.get('sara');
  const jane = ctx.get('jane');
  const id1 = ctx.get('id1');

  await nftoken.instance.methods.create(bob, id1).send({ from: owner });
  await nftoken.instance.methods.setApprovalForAll(sara, true).send({ from: bob });
  await nftoken.instance.methods.transferFrom(bob, jane, id1).send({ from: sara  });

  const bobBalance = await nftoken.instance.methods.balanceOf(bob).call();
  const janeBalance = await nftoken.instance.methods.balanceOf(jane).call();
  const ownerOfId1 =  await nftoken.instance.methods.ownerOf(id1).call();

  ctx.is(bobBalance, '0');
  ctx.is(janeBalance, '1');
  ctx.is(ownerOfId1, jane);
});

spec.test('throws when trying to transfer NFT as an address that is not owner, approved or operator', async (ctx) => {
  const nftoken = ctx.get('nfToken');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const sara = ctx.get('sara');
  const jane = ctx.get('jane');
  const id1 = ctx.get('id1');

  await nftoken.instance.methods.create(bob, id1).send({ from: owner });
  await ctx.reverts(() => nftoken.instance.methods.transferFrom(bob, jane, id1).send({ from: sara }), '005004');
});

spec.test('throws when trying to transfer NFT to a zero address', async (ctx) => {
  const nftoken = ctx.get('nfToken');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const zeroAddress = ctx.get('zeroAddress');
  const id1 = ctx.get('id1');

  await nftoken.instance.methods.create(bob, id1).send({ from: owner });
  await ctx.reverts(() => nftoken.instance.methods.transferFrom(bob, zeroAddress, id1).send({ from: bob }), '005001');
});

spec.test('throws when trying to transfer a invalid NFT', async (ctx) => {
  const nftoken = ctx.get('nfToken');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const sara = ctx.get('sara');
  const id1 = ctx.get('id1');
  const id2 = ctx.get('id2');

  await nftoken.instance.methods.create(bob, id1).send({ from: owner });
  await ctx.reverts(() => nftoken.instance.methods.transferFrom(bob, sara, id2).send({ from: bob }), '005002');
});

spec.test('corectly safe transfers NFT from owner', async (ctx) => {
  const nftoken = ctx.get('nfToken');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const sara = ctx.get('sara');
  const id1 = ctx.get('id1');

  await nftoken.instance.methods.create(bob, id1).send({ from: owner });
  const logs = await nftoken.instance.methods.safeTransferFrom(bob, sara, id1).send({ from: bob  });
  ctx.not(logs.events.Transfer, undefined);

  const bobBalance = await nftoken.instance.methods.balanceOf(bob).call();
  const saraBalance = await nftoken.instance.methods.balanceOf(sara).call();
  const ownerOfId1 =  await nftoken.instance.methods.ownerOf(id1).call();

  ctx.is(bobBalance, '0');
  ctx.is(saraBalance, '1');
  ctx.is(ownerOfId1, sara);
});

spec.test('throws when trying to safe transfers NFT from owner to a smart contract', async (ctx) => {
  const nftoken = ctx.get('nfToken');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const id1 = ctx.get('id1');

  await nftoken.instance.methods.create(bob, id1).send({ from: owner });
  await ctx.reverts(() => nftoken.instance.methods.safeTransferFrom(bob, nftoken.receipt._address, id1).send({ from: bob }));
});

spec.test('corectly safe transfers NFT from owner to smart contract that can recieve NFTs', async (ctx) => {
  const nftoken = ctx.get('nfToken');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const id1 = ctx.get('id1');

  const tokenReceiver = await ctx.deploy({
    src: './build/nf-token-receiver-test-mock.json',
    contract: 'NFTokenReceiverTestMock',
  });

  await nftoken.instance.methods.create(bob, id1).send({ from: owner });
  await nftoken.instance.methods.safeTransferFrom(bob, tokenReceiver.receipt._address, id1).send({ from: bob  });

  const bobBalance = await nftoken.instance.methods.balanceOf(bob).call();
  const saraBalance = await nftoken.instance.methods.balanceOf(tokenReceiver.receipt._address).call();
  const ownerOfId1 =  await nftoken.instance.methods.ownerOf(id1).call();

  ctx.is(bobBalance, '0');
  ctx.is(saraBalance, '1');
  ctx.is(ownerOfId1, tokenReceiver.receipt._address);
});

spec.test('corectly safe transfers NFT from owner to smart contract that can recieve NFTs with data', async (ctx) => {
  const nftoken = ctx.get('nfToken');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const id1 = ctx.get('id1');

  const tokenReceiver = await ctx.deploy({
    src: './build/nf-token-receiver-test-mock.json',
    contract: 'NFTokenReceiverTestMock',
  });

  await nftoken.instance.methods.create(bob, id1).send({ from: owner });
  await nftoken.instance.methods.safeTransferFrom(bob, tokenReceiver.receipt._address, id1, '0x01').send({ from: bob  });

  const bobBalance = await nftoken.instance.methods.balanceOf(bob).call();
  const saraBalance = await nftoken.instance.methods.balanceOf(tokenReceiver.receipt._address).call();
  const ownerOfId1 =  await nftoken.instance.methods.ownerOf(id1).call();

  ctx.is(bobBalance, '0');
  ctx.is(saraBalance, '1');
  ctx.is(ownerOfId1, tokenReceiver.receipt._address);
});

spec.test('corectly destroys a NFT', async (ctx) => {
  const nftoken = ctx.get('nfToken');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const id1 = ctx.get('id1');
  const id2 = ctx.get('id2');

  await nftoken.instance.methods.create(bob, id1).send({ from: owner });
  await nftoken.instance.methods.create(bob, id2).send({ from: owner });
  const logs = await nftoken.instance.methods.destroy(id1).send({ from: owner });
  ctx.not(logs.events.Transfer, undefined);

  const totalSupply = await nftoken.instance.methods.totalSupply().call();
  ctx.is(totalSupply.toString(), '1');

  const balance = await nftoken.instance.methods.balanceOf(bob).call();
  ctx.is(balance, '1');
  await ctx.reverts(() => nftoken.instance.methods.ownerOf(id1).call(), '005002');

  const tokenIndex0 = await nftoken.instance.methods.tokenByIndex(0).call();
  ctx.is(tokenIndex0, id2);

  const tokenOwnerIndex0 = await nftoken.instance.methods.tokenOfOwnerByIndex(bob, 0).call();
  ctx.is(tokenOwnerIndex0, id2);

  await ctx.reverts(() => nftoken.instance.methods.tokenByIndex(1).call(), '005007');
  await ctx.reverts(() => nftoken.instance.methods.tokenOfOwnerByIndex(bob, 1).call(), '005007');
});

spec.test('throws when trying to destroy non existant NFT', async (ctx) => {
  const nftoken = ctx.get('nfToken');
  const owner = ctx.get('owner');
  const id1 = ctx.get('id1');

  await ctx.reverts(() => nftoken.instance.methods.destroy(id1).send({ from: owner }), '005002');
});

spec.test('returns the correct token by index', async (ctx) => {
  const nftoken = ctx.get('nfToken');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const sara = ctx.get('sara');
  const id1 = ctx.get('id1');
  const id2 = ctx.get('id2');
  const id3 = ctx.get('id3');

  await nftoken.instance.methods.create(bob, id1).send({ from: owner });
  await nftoken.instance.methods.create(bob, id2).send({ from: owner });
  await nftoken.instance.methods.create(sara, id3).send({ from: owner });

  const tokenIndex0 = await nftoken.instance.methods.tokenByIndex(0).call();
  const tokenIndex1 = await nftoken.instance.methods.tokenByIndex(1).call();
  const tokenIndex2 = await nftoken.instance.methods.tokenByIndex(2).call();

  ctx.is(tokenIndex0, id1);
  ctx.is(tokenIndex1, id2);
  ctx.is(tokenIndex2, id3);
});

spec.test('throws when trying to get token by non-existing index', async (ctx) => {
  const nftoken = ctx.get('nfToken');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const id1 = ctx.get('id1');

  await nftoken.instance.methods.create(bob, id1).send({ from: owner });
  await ctx.reverts(() => nftoken.instance.methods.tokenByIndex(1).call(), '005007');
});

spec.test('returns the correct token of owner by index', async (ctx) => {
  const nftoken = ctx.get('nfToken');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const sara = ctx.get('sara');
  const id1 = ctx.get('id1');
  const id2 = ctx.get('id2');
  const id3 = ctx.get('id3');

  await nftoken.instance.methods.create(bob, id1).send({ from: owner });
  await nftoken.instance.methods.create(bob, id2).send({ from: owner });
  await nftoken.instance.methods.create(sara, id3).send({ from: owner });

  const tokenOwnerIndex1 = await nftoken.instance.methods.tokenOfOwnerByIndex(bob, 1).call();
  ctx.is(tokenOwnerIndex1, id2);
});

spec.test('throws when trying to get token of owner by non-existing index', async (ctx) => {
  const nftoken = ctx.get('nfToken');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const id1 = ctx.get('id1');

  await nftoken.instance.methods.create(bob, id1).send({ from: owner });
  await ctx.reverts(() => nftoken.instance.methods.tokenOfOwnerByIndex(bob, 1).call(), '005007');
});

spec.test('create should correctly set ownerToIds and idToOwnerIndex and idToIndex', async (ctx) => {
  const nftoken = ctx.get('nfToken');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const id1 = ctx.get('id1');
  const id2 = ctx.get('id2');
  const id3 = ctx.get('id3');

  await nftoken.instance.methods.create(bob, id1).send({ from: owner });
  await nftoken.instance.methods.create(bob, id3).send({ from: owner });
  await nftoken.instance.methods.create(bob, id2).send({ from: owner });

  const idToOwnerIndexId1 = await nftoken.instance.methods.idToOwnerIndexWrapper(id1).call();
  const idToOwnerIndexId3 = await nftoken.instance.methods.idToOwnerIndexWrapper(id3).call();
  const idToOwnerIndexId2 = await nftoken.instance.methods.idToOwnerIndexWrapper(id2).call();
  ctx.is(idToOwnerIndexId1, '0');
  ctx.is(idToOwnerIndexId3, '1');
  ctx.is(idToOwnerIndexId2, '2');

  const ownerToIdsLenPrior = await nftoken.instance.methods.ownerToIdsLen(bob).call();
  const ownerToIdsFirst = await nftoken.instance.methods.ownerToIdbyIndex(bob, 0).call();
  const ownerToIdsSecond = await nftoken.instance.methods.ownerToIdbyIndex(bob, 1).call();
  const ownerToIdsThird = await nftoken.instance.methods.ownerToIdbyIndex(bob, 2).call();
  ctx.is(ownerToIdsLenPrior, '3');
  ctx.is(ownerToIdsFirst, id1);
  ctx.is(ownerToIdsSecond, id3);
  ctx.is(ownerToIdsThird, id2);

  const idToIndexFirst = await nftoken.instance.methods.idToIndexWrapper(id1).call();
  const idToIndexSecond = await nftoken.instance.methods.idToIndexWrapper(id3).call();
  const idToIndexThird = await nftoken.instance.methods.idToIndexWrapper(id2).call();

  ctx.is(idToIndexFirst, '0');
  ctx.is(idToIndexSecond, '1');
  ctx.is(idToIndexThird, '2');
});

spec.test('destroy should correctly set ownerToIds and idToOwnerIndex and idToIndex', async (ctx) => {
  const nftoken = ctx.get('nfToken');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const id1 = ctx.get('id1');
  const id2 = ctx.get('id2');
  const id3 = ctx.get('id3');

  await nftoken.instance.methods.create(bob, id1).send({ from: owner });
  await nftoken.instance.methods.create(bob, id3).send({ from: owner });
  await nftoken.instance.methods.create(bob, id2).send({ from: owner });

  // destroy id1
  await nftoken.instance.methods.destroy(id1).send({ from: owner });

  let idToOwnerIndexId3 = await nftoken.instance.methods.idToOwnerIndexWrapper(id3).call();
  const idToOwnerIndexId2 = await nftoken.instance.methods.idToOwnerIndexWrapper(id2).call();
  ctx.is(idToOwnerIndexId3, '1');
  ctx.is(idToOwnerIndexId2, '0');

  let ownerToIdsLenPrior = await nftoken.instance.methods.ownerToIdsLen(bob).call();
  let ownerToIdsFirst = await nftoken.instance.methods.ownerToIdbyIndex(bob, 0).call();
  const ownerToIdsSecond = await nftoken.instance.methods.ownerToIdbyIndex(bob, 1).call();
  ctx.is(ownerToIdsLenPrior, '2');
  ctx.is(ownerToIdsFirst, id2);
  ctx.is(ownerToIdsSecond, id3);

  let idToIndexFirst = await nftoken.instance.methods.idToIndexWrapper(id2).call();
  const idToIndexSecond = await nftoken.instance.methods.idToIndexWrapper(id3).call();
  ctx.is(idToIndexFirst, '0');
  ctx.is(idToIndexSecond, '1');

  let tokenIndexFirst = await nftoken.instance.methods.tokenByIndex(0).call();
  const tokenIndexSecond = await nftoken.instance.methods.tokenByIndex(1).call();
  ctx.is(tokenIndexFirst, id2);
  ctx.is(tokenIndexSecond, id3);

  // destroy id2
  await nftoken.instance.methods.destroy(id2).send({ from: owner });

  idToOwnerIndexId3 = await nftoken.instance.methods.idToOwnerIndexWrapper(id3).call();
  ctx.is(idToOwnerIndexId3, '0');

  ownerToIdsLenPrior = await nftoken.instance.methods.ownerToIdsLen(bob).call();
  ownerToIdsFirst = await nftoken.instance.methods.ownerToIdbyIndex(bob, 0).call();
  ctx.is(ownerToIdsLenPrior, '1');
  ctx.is(ownerToIdsFirst, id3);

  idToIndexFirst = await nftoken.instance.methods.idToIndexWrapper(id3).call();
  ctx.is(idToIndexFirst, '0');

  tokenIndexFirst = await nftoken.instance.methods.tokenByIndex(0).call();
  ctx.is(tokenIndexFirst, id3);

  // destroy id3
  await nftoken.instance.methods.destroy(id3).send({ from: owner });

  idToOwnerIndexId3 = await nftoken.instance.methods.idToOwnerIndexWrapper(id3).call();
  ctx.is(idToOwnerIndexId3, '0');

  ownerToIdsLenPrior = await nftoken.instance.methods.ownerToIdsLen(bob).call();
  ctx.is(ownerToIdsLenPrior.toString(), '0');

  await ctx.throws(() => nftoken.instance.methods.ownerToIdbyIndex(bob, 0).call());

  idToIndexFirst = await nftoken.instance.methods.idToIndexWrapper(id3).call();
  ctx.is(idToIndexFirst, '0');
});

spec.test('transfer should correctly set ownerToIds and idToOwnerIndex and idToIndex', async (ctx) => {
  const nftoken = ctx.get('nfToken');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const sara = ctx.get('sara');
  const id1 = ctx.get('id1');
  const id2 = ctx.get('id2');
  const id3 = ctx.get('id3');

  await nftoken.instance.methods.create(bob, id1).send({ from: owner });
  await nftoken.instance.methods.create(bob, id3).send({ from: owner });
  await nftoken.instance.methods.create(bob, id2).send({ from: owner });
  await nftoken.instance.methods.transferFrom(bob, sara, id1).send({ from: bob });

  const idToOwnerIndexId1 = await nftoken.instance.methods.idToOwnerIndexWrapper(id1).call();
  const idToOwnerIndexId3 = await nftoken.instance.methods.idToOwnerIndexWrapper(id3).call();
  const idToOwnerIndexId2 = await nftoken.instance.methods.idToOwnerIndexWrapper(id2).call();
  ctx.is(idToOwnerIndexId1, '0');
  ctx.is(idToOwnerIndexId3, '1');
  ctx.is(idToOwnerIndexId2, '0');

  let ownerToIdsLenPrior = await nftoken.instance.methods.ownerToIdsLen(bob).call();
  let ownerToIdsFirst = await nftoken.instance.methods.ownerToIdbyIndex(bob, 0).call();
  const ownerToIdsSecond = await nftoken.instance.methods.ownerToIdbyIndex(bob, 1).call();
  ctx.is(ownerToIdsLenPrior, '2');
  ctx.is(ownerToIdsFirst, id2);
  ctx.is(ownerToIdsSecond, id3);

  await ctx.throws(() => nftoken.instance.methods.ownerToIdbyIndex(bob, 2).call());

  ownerToIdsLenPrior = await nftoken.instance.methods.ownerToIdsLen(sara).call();
  ownerToIdsFirst = await nftoken.instance.methods.ownerToIdbyIndex(sara, 0).call();
  ctx.is(ownerToIdsLenPrior, '1');
  ctx.is(ownerToIdsFirst, id1);
});

export default spec;
