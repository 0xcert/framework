import { Spec } from '@specron/spec';

/**
 * Spec context interfaces.
 */

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
  const nftokenInterface = await nftoken.methods.supportsInterface('0x80ac58cd').call();
  const nftokenNonExistingInterface = await nftoken.methods.supportsInterface('0x5b5e139f').call();
  ctx.is(nftokenInterface, true);
  ctx.is(nftokenNonExistingInterface, false);
});

spec.test('correctly mints a NFT', async (ctx) => {
  const nftoken = ctx.get('nfToken');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const id1 = ctx.get('id1');

  const logs = await nftoken.methods.mint(bob, id1).send({ from: owner, gas: 4000000 });
  ctx.not(logs.events.Transfer, undefined);
  const count = await nftoken.methods.balanceOf(bob).call();
  ctx.is(count.toString(), '1');
  const totalSupply = await nftoken.methods.totalSupply().call();
  ctx.is(totalSupply.toString(), '1');
});

spec.test('returns correct balanceOf', async (ctx) => {
  const nftoken = ctx.get('nfToken');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const id1 = ctx.get('id1');
  const id2 = ctx.get('id2');

  let count = await nftoken.methods.balanceOf(bob).call();
  ctx.is(count.toString(), '0');

  await nftoken.methods.mint(bob, id1).send({ from: owner, gas: 4000000 });
  count = await nftoken.methods.balanceOf(bob).call();
  ctx.is(count.toString(), '1');

  await nftoken.methods.mint(bob, id2).send({ from: owner, gas: 4000000 });
  count = await nftoken.methods.balanceOf(bob).call();
  ctx.is(count.toString(), '2');
});

spec.test('throws when trying to get count of NFTs owned by 0x0 address', async (ctx) => {
  const nftoken = ctx.get('nfToken');
  const zeroAddress = ctx.get('zeroAddress');

  await ctx.reverts(() => nftoken.methods.balanceOf(zeroAddress).call());
});

spec.test('throws when trying to mint 2 NFTs with the same ids', async (ctx) => {
  const nftoken = ctx.get('nfToken');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const id1 = ctx.get('id1');
  await nftoken.methods.mint(bob, id1).send({ from: owner, gas: 4000000 });
  await ctx.reverts(() => nftoken.methods.mint(bob, id1).send({ from: owner, gas: 4000000 }));
});

spec.test('throws when trying to mint NFT to 0x0 address', async (ctx) => {
  const nftoken = ctx.get('nfToken');
  const owner = ctx.get('owner');
  const zeroAddress = ctx.get('zeroAddress');
  const id1 = ctx.get('id1');
  await ctx.reverts(() => nftoken.methods.mint(zeroAddress, id1).send({ from: owner, gas: 4000000 }));
});

spec.test('finds the correct owner of NFToken id', async (ctx) => {
  const nftoken = ctx.get('nfToken');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const id1 = ctx.get('id1');

  await nftoken.methods.mint(bob, id1).send({ from: owner, gas: 4000000 });
  const id1Owner = await nftoken.methods.ownerOf(id1).call();
  ctx.is(id1Owner, bob);
});

spec.test('throws when trying to find owner od non-existing NFT id', async (ctx) => {
  const nftoken = ctx.get('nfToken');
  const id1 = ctx.get('id1');

  await ctx.reverts(() => nftoken.methods.ownerOf(id1).call());
});

spec.test('correctly approves account', async (ctx) => {
  const nftoken = ctx.get('nfToken');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const sara = ctx.get('sara');
  const id1 = ctx.get('id1');

  await nftoken.methods.mint(bob, id1).send({ from: owner, gas: 4000000 });
  const logs = await nftoken.methods.approve(sara, id1).send({ from: bob });
  ctx.not(logs.events.Approval, undefined);
  
  const address = await nftoken.methods.getApproved(id1).call();;
  ctx.is(address, sara);
});

spec.test('correctly cancels approval', async (ctx) => {
  const nftoken = ctx.get('nfToken');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const sara = ctx.get('sara');
  const id1 = ctx.get('id1');
  const zeroAddress = ctx.get('zeroAddress');

  await nftoken.methods.mint(bob, id1).send({ from: owner, gas: 4000000 });
  await nftoken.methods.approve(sara, id1).send({ from: bob });
  await nftoken.methods.approve(zeroAddress, id1).send({ from: bob });
  
  const address = await nftoken.methods.getApproved(id1).call();
  ctx.is(address, zeroAddress);
});

spec.test('throws when trying to get approval of non-existing NFT id', async (ctx) => {
  const nftoken = ctx.get('nfToken');
  const id1 = ctx.get('id1');
  
  await ctx.reverts(() => nftoken.methods.getApproved(id1).call());
});

spec.test('throws when trying to approve NFT ID from a third party', async (ctx) => {
  const nftoken = ctx.get('nfToken');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const sara = ctx.get('sara');
  const id1 = ctx.get('id1');

  await nftoken.methods.mint(bob, id1).send({ from: owner, gas: 4000000 });
  await ctx.reverts(() => nftoken.methods.approve(sara, id1).send({ from: sara }));
});

spec.test('correctly sets an operator', async (ctx) => {
  const nftoken = ctx.get('nfToken');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const sara = ctx.get('sara');
  const id1 = ctx.get('id1');

  await nftoken.methods.mint(bob, id1).send({ from: owner, gas: 4000000 });
  const logs = await nftoken.methods.setApprovalForAll(sara, true).send({ from: bob });
  ctx.not(logs.events.ApprovalForAll, undefined);
  const isApprovedForAll = await nftoken.methods.isApprovedForAll(bob, sara).call();
  ctx.is(isApprovedForAll, true);
});

spec.test('correctly sets then cancels an operator', async (ctx) => {
  const nftoken = ctx.get('nfToken');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const sara = ctx.get('sara');
  const id1 = ctx.get('id1');

  await nftoken.methods.mint(bob, id1).send({ from: owner, gas: 4000000 });
  await nftoken.methods.setApprovalForAll(sara, true).send({ from: bob });
  await nftoken.methods.setApprovalForAll(sara, false).send({ from: bob });
  const isApprovedForAll = await nftoken.methods.isApprovedForAll(bob, sara).call();
  ctx.is(isApprovedForAll, false);
});

spec.test('corectly transfers NFT from owner', async (ctx) => {
  const nftoken = ctx.get('nfToken');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const sara = ctx.get('sara');
  const id1 = ctx.get('id1');

  await nftoken.methods.mint(bob, id1).send({ from: owner, gas: 4000000 });
  const logs = await nftoken.methods.transferFrom(bob, sara, id1).send({ from: bob, gas: 4000000 });
  ctx.not(logs.events.Transfer, undefined);

  const bobBalance = await nftoken.methods.balanceOf(bob).call();
  const saraBalance = await nftoken.methods.balanceOf(sara).call();
  const ownerOfId1 =  await nftoken.methods.ownerOf(id1).call();

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

  await nftoken.methods.mint(bob, id1).send({ from: owner, gas: 4000000 });
  await nftoken.methods.approve(sara, id1).send({ from: bob });
  await nftoken.methods.transferFrom(bob, jane, id1).send({ from: sara, gas: 4000000 });

  const bobBalance = await nftoken.methods.balanceOf(bob).call();
  const janeBalance = await nftoken.methods.balanceOf(jane).call();
  const ownerOfId1 =  await nftoken.methods.ownerOf(id1).call();

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

  await nftoken.methods.mint(bob, id1).send({ from: owner, gas: 4000000 });
  await nftoken.methods.setApprovalForAll(sara, true).send({ from: bob });
  await nftoken.methods.transferFrom(bob, jane, id1).send({ from: sara, gas: 4000000  });

  const bobBalance = await nftoken.methods.balanceOf(bob).call();
  const janeBalance = await nftoken.methods.balanceOf(jane).call();
  const ownerOfId1 =  await nftoken.methods.ownerOf(id1).call();

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

  await nftoken.methods.mint(bob, id1).send({ from: owner, gas: 4000000 });
  await ctx.reverts(() => nftoken.methods.transferFrom(bob, jane, id1).send({ from: sara, gas: 4000000  }));
});

spec.test('throws when trying to transfer NFT to a zero address', async (ctx) => {
  const nftoken = ctx.get('nfToken');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const zeroAddress = ctx.get('zeroAddress');
  const id1 = ctx.get('id1');

  await nftoken.methods.mint(bob, id1).send({ from: owner, gas: 4000000 });
  await ctx.reverts(() => nftoken.methods.transferFrom(bob, zeroAddress, id1).send({ from: bob, gas: 4000000  }));
});

spec.test('throws when trying to transfer a invalid NFT', async (ctx) => {
  const nftoken = ctx.get('nfToken');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const sara = ctx.get('sara');
  const id1 = ctx.get('id1');
  const id2 = ctx.get('id2');

  await nftoken.methods.mint(bob, id1).send({ from: owner, gas: 4000000 });
  await ctx.reverts(() => nftoken.methods.transferFrom(bob, sara, id2).send({ from: bob, gas: 4000000  }));
});

spec.test('corectly safe transfers NFT from owner', async (ctx) => {
  const nftoken = ctx.get('nfToken');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const sara = ctx.get('sara');
  const id1 = ctx.get('id1');

  await nftoken.methods.mint(bob, id1).send({ from: owner, gas: 4000000 });
  const logs = await nftoken.methods.safeTransferFrom(bob, sara, id1).send({ from: bob, gas: 4000000  });
  ctx.not(logs.events.Transfer, undefined);

  const bobBalance = await nftoken.methods.balanceOf(bob).call();
  const saraBalance = await nftoken.methods.balanceOf(sara).call();
  const ownerOfId1 =  await nftoken.methods.ownerOf(id1).call();

  ctx.is(bobBalance, '0');
  ctx.is(saraBalance, '1');
  ctx.is(ownerOfId1, sara);
});

spec.test('throws when trying to safe transfers NFT from owner to a smart contract', async (ctx) => {
  const nftoken = ctx.get('nfToken');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const id1 = ctx.get('id1');

  await nftoken.methods.mint(bob, id1).send({ from: owner, gas: 4000000 });
  await ctx.reverts(() => nftoken.methods.safeTransferFrom(bob, nftoken._address, id1).send({ from: bob, gas: 4000000  }));
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

  await nftoken.methods.mint(bob, id1).send({ from: owner, gas: 4000000 });
  await nftoken.methods.safeTransferFrom(bob, tokenReceiver._address, id1).send({ from: bob, gas: 4000000  });

  const bobBalance = await nftoken.methods.balanceOf(bob).call();
  const saraBalance = await nftoken.methods.balanceOf(tokenReceiver._address).call();
  const ownerOfId1 =  await nftoken.methods.ownerOf(id1).call();

  ctx.is(bobBalance, '0');
  ctx.is(saraBalance, '1');
  ctx.is(ownerOfId1, tokenReceiver._address);
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

  await nftoken.methods.mint(bob, id1).send({ from: owner, gas: 4000000 });
  await nftoken.methods.safeTransferFrom(bob, tokenReceiver._address, id1, '0x01').send({ from: bob, gas: 4000000  });

  const bobBalance = await nftoken.methods.balanceOf(bob).call();
  const saraBalance = await nftoken.methods.balanceOf(tokenReceiver._address).call();
  const ownerOfId1 =  await nftoken.methods.ownerOf(id1).call();

  ctx.is(bobBalance, '0');
  ctx.is(saraBalance, '1');
  ctx.is(ownerOfId1, tokenReceiver._address);
});

spec.test('corectly burns a NFT', async (ctx) => {
  const nftoken = ctx.get('nfToken');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const id1 = ctx.get('id1');
  const id2= ctx.get('id2');

  await nftoken.methods.mint(bob, id1).send({ from: owner, gas: 4000000 });
  await nftoken.methods.mint(bob, id2).send({ from: owner, gas: 4000000 });
  const logs = await nftoken.methods.burn(id1).send({ from: owner });
  ctx.not(logs.events.Transfer, undefined);

  const totalSupply = await nftoken.methods.totalSupply().call();
  ctx.is(totalSupply.toString(), '1');

  const balance = await nftoken.methods.balanceOf(bob).call();
  ctx.is(balance, '1');
  await ctx.reverts(() => nftoken.methods.ownerOf(id1).call());
  
  const tokenIndex0 = await nftoken.methods.tokenByIndex(0).call();
  ctx.is(tokenIndex0, id2);

  const tokenOwnerIndex0 = await nftoken.methods.tokenOfOwnerByIndex(bob, 0).call();
  ctx.is(tokenOwnerIndex0, id2);

  await ctx.reverts(() => nftoken.methods.tokenByIndex(1).call());
  await ctx.reverts(() => nftoken.methods.tokenOfOwnerByIndex(bob, 1).call());
});

spec.test('throws when trying to burn non existant NFT', async (ctx) => {
  const nftoken = ctx.get('nfToken');
  const owner = ctx.get('owner');
  const id1 = ctx.get('id1');

  await ctx.reverts(() => nftoken.methods.burn(id1).send({ from: owner }));
});

spec.test('returns the correct token by index', async (ctx) => {
  const nftoken = ctx.get('nfToken');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const sara = ctx.get('sara');
  const id1 = ctx.get('id1');
  const id2 = ctx.get('id2');
  const id3 = ctx.get('id3');

  await nftoken.methods.mint(bob, id1).send({ from: owner, gas: 4000000 });
  await nftoken.methods.mint(bob, id2).send({ from: owner, gas: 4000000 });
  await nftoken.methods.mint(sara, id3).send({ from: owner, gas: 4000000 });

  const tokenIndex0 = await nftoken.methods.tokenByIndex(0).call();
  const tokenIndex1 = await nftoken.methods.tokenByIndex(1).call();
  const tokenIndex2 = await nftoken.methods.tokenByIndex(2).call();
  
  ctx.is(tokenIndex0, id1);
  ctx.is(tokenIndex1, id2);
  ctx.is(tokenIndex2, id3);
});

spec.test('throws when trying to get token by non-existing index', async (ctx) => {
  const nftoken = ctx.get('nfToken');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const id1 = ctx.get('id1');

  await nftoken.methods.mint(bob, id1).send({ from: owner, gas: 4000000 });
  await ctx.reverts(() => nftoken.methods.tokenByIndex(1).call());
});

spec.test('returns the correct token of owner by index', async (ctx) => {
  const nftoken = ctx.get('nfToken');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const sara = ctx.get('sara');
  const id1 = ctx.get('id1');
  const id2 = ctx.get('id2');
  const id3 = ctx.get('id3');

  await nftoken.methods.mint(bob, id1).send({ from: owner, gas: 4000000 });
  await nftoken.methods.mint(bob, id2).send({ from: owner, gas: 4000000 });
  await nftoken.methods.mint(sara, id3).send({ from: owner, gas: 4000000 });

  const tokenOwnerIndex1 = await nftoken.methods.tokenOfOwnerByIndex(bob, 1).call();
  ctx.is(tokenOwnerIndex1, id2);
});

spec.test('throws when trying to get token of owner by non-existing index', async (ctx) => {
  const nftoken = ctx.get('nfToken');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const id1 = ctx.get('id1');

  await nftoken.methods.mint(bob, id1).send({ from: owner, gas: 4000000 });
  await ctx.reverts(() => nftoken.methods.tokenOfOwnerByIndex(bob, 1).call());
});

spec.test('mint should correctly set ownerToIds and idToOwnerIndex and idToIndex', async (ctx) => {
  const nftoken = ctx.get('nfToken');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const id1 = ctx.get('id1');
  const id2 = ctx.get('id2');
  const id3 = ctx.get('id3');

  await nftoken.methods.mint(bob, id1).send({ from: owner, gas: 4000000 });
  await nftoken.methods.mint(bob, id3).send({ from: owner, gas: 4000000 });
  await nftoken.methods.mint(bob, id2).send({ from: owner, gas: 4000000 });

  const idToOwnerIndexId1 = await nftoken.methods.idToOwnerIndexWrapper(id1).call();
  const idToOwnerIndexId3 = await nftoken.methods.idToOwnerIndexWrapper(id3).call();
  const idToOwnerIndexId2 = await nftoken.methods.idToOwnerIndexWrapper(id2).call();
  ctx.is(idToOwnerIndexId1, '0');
  ctx.is(idToOwnerIndexId3, '1');
  ctx.is(idToOwnerIndexId2, '2');

  const ownerToIdsLenPrior = await nftoken.methods.ownerToIdsLen(bob).call();
  const ownerToIdsFirst = await nftoken.methods.ownerToIdbyIndex(bob, 0).call();
  const ownerToIdsSecond = await nftoken.methods.ownerToIdbyIndex(bob, 1).call();
  const ownerToIdsThird = await nftoken.methods.ownerToIdbyIndex(bob, 2).call();
  ctx.is(ownerToIdsLenPrior, '3');
  ctx.is(ownerToIdsFirst, id1);
  ctx.is(ownerToIdsSecond, id3);
  ctx.is(ownerToIdsThird, id2);

  const idToIndexFirst = await nftoken.methods.idToIndexWrapper(id1).call();
  const idToIndexSecond = await nftoken.methods.idToIndexWrapper(id3).call();
  const idToIndexThird = await nftoken.methods.idToIndexWrapper(id2).call();

  ctx.is(idToIndexFirst, '0');
  ctx.is(idToIndexSecond, '1');
  ctx.is(idToIndexThird, '2');
});

spec.test('burn should correctly set ownerToIds and idToOwnerIndex and idToIndex', async (ctx) => {
    const nftoken = ctx.get('nfToken');
    const owner = ctx.get('owner');
    const bob = ctx.get('bob');
    const id1 = ctx.get('id1');
    const id2 = ctx.get('id2');
    const id3 = ctx.get('id3');

    await nftoken.methods.mint(bob, id1).send({ from: owner, gas: 4000000 });
    await nftoken.methods.mint(bob, id3).send({ from: owner, gas: 4000000 });
    await nftoken.methods.mint(bob, id2).send({ from: owner, gas: 4000000 });

    //burn id1
    await nftoken.methods.burn(id1).send({ from: owner });

    let idToOwnerIndexId3 = await nftoken.methods.idToOwnerIndexWrapper(id3).call();
    let idToOwnerIndexId2 = await nftoken.methods.idToOwnerIndexWrapper(id2).call();
    ctx.is(idToOwnerIndexId3, '1');
    ctx.is(idToOwnerIndexId2, '0');

    let ownerToIdsLenPrior = await nftoken.methods.ownerToIdsLen(bob).call();
    let ownerToIdsFirst = await nftoken.methods.ownerToIdbyIndex(bob, 0).call();
    let ownerToIdsSecond = await nftoken.methods.ownerToIdbyIndex(bob, 1).call();
    ctx.is(ownerToIdsLenPrior, '2');
    ctx.is(ownerToIdsFirst, id2);
    ctx.is(ownerToIdsSecond, id3);

    let idToIndexFirst = await nftoken.methods.idToIndexWrapper(id2).call();
    let idToIndexSecond = await nftoken.methods.idToIndexWrapper(id3).call();
    ctx.is(idToIndexFirst, '0');
    ctx.is(idToIndexSecond, '1');

    let tokenIndexFirst = await nftoken.methods.tokenByIndex(0).call();
    let tokenIndexSecond = await nftoken.methods.tokenByIndex(1).call();
    ctx.is(tokenIndexFirst, id2);
    ctx.is(tokenIndexSecond, id3);

    //burn id2
    await nftoken.methods.burn(id2).send({ from: owner });

    idToOwnerIndexId3 = await nftoken.methods.idToOwnerIndexWrapper(id3).call();
    ctx.is(idToOwnerIndexId3, '0');

    ownerToIdsLenPrior = await nftoken.methods.ownerToIdsLen(bob).call();
    ownerToIdsFirst = await nftoken.methods.ownerToIdbyIndex(bob, 0).call();
    ctx.is(ownerToIdsLenPrior, '1');
    ctx.is(ownerToIdsFirst, id3);

    idToIndexFirst = await nftoken.methods.idToIndexWrapper(id3).call();
    ctx.is(idToIndexFirst, '0');

    tokenIndexFirst = await nftoken.methods.tokenByIndex(0).call();
    ctx.is(tokenIndexFirst, id3);

    //burn id3
    await nftoken.methods.burn(id3).send({ from: owner });

    idToOwnerIndexId3 = await nftoken.methods.idToOwnerIndexWrapper(id3).call();
    ctx.is(idToOwnerIndexId3, '0');

    ownerToIdsLenPrior = await nftoken.methods.ownerToIdsLen(bob).call();
    ctx.is(ownerToIdsLenPrior.toString(), '0');

    await ctx.throws(() => nftoken.methods.ownerToIdbyIndex(bob, 0).call());

    idToIndexFirst = await nftoken.methods.idToIndexWrapper(id3).call();
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

    await nftoken.methods.mint(bob, id1).send({ from: owner, gas: 4000000 });
    await nftoken.methods.mint(bob, id3).send({ from: owner, gas: 4000000 });
    await nftoken.methods.mint(bob, id2).send({ from: owner, gas: 4000000 });
    await nftoken.methods.transferFrom(bob, sara, id1).send({ from: bob, gas: 4000000 });;

    const idToOwnerIndexId1 = await nftoken.methods.idToOwnerIndexWrapper(id1).call();
    const idToOwnerIndexId3 = await nftoken.methods.idToOwnerIndexWrapper(id3).call();
    const idToOwnerIndexId2 = await nftoken.methods.idToOwnerIndexWrapper(id2).call();
    ctx.is(idToOwnerIndexId1, '0');
    ctx.is(idToOwnerIndexId3, '1');
    ctx.is(idToOwnerIndexId2, '0');

    let ownerToIdsLenPrior = await nftoken.methods.ownerToIdsLen(bob).call();
    let ownerToIdsFirst = await nftoken.methods.ownerToIdbyIndex(bob, 0).call();
    let ownerToIdsSecond = await nftoken.methods.ownerToIdbyIndex(bob, 1).call();
    ctx.is(ownerToIdsLenPrior, '2');
    ctx.is(ownerToIdsFirst, id2);
    ctx.is(ownerToIdsSecond, id3);

    await ctx.throws(() => nftoken.methods.ownerToIdbyIndex(bob, 2).call());
   
    ownerToIdsLenPrior = await nftoken.methods.ownerToIdsLen(sara).call();
    ownerToIdsFirst = await nftoken.methods.ownerToIdbyIndex(sara, 0).call();
    ctx.is(ownerToIdsLenPrior, '1');
    ctx.is(ownerToIdsFirst, id1);
});

