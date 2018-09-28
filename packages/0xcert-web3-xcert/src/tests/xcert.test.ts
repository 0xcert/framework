import { Spec } from '@specron/spec';

/**
 * Spec context interfaces.
 */

interface Data {
  xcert?: any;
  owner?: string;
  bob?: string;
  jane?: string;
  sara?: string;
  zeroAddress?: string;
  id1?: string;
  id2?: string;
  id3?: string;
  url1?: string;
  url2?: string;
  url3?: string;
  proof1?: string;
  proof2?: string;
  proof3?: string;
}

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
  ctx.set('url1', 'http://0xcert.org/1');
  ctx.set('url2', 'http://0xcert.org/2');
  ctx.set('url3', 'http://0xcert.org/3');
  ctx.set('proof1', '973124FFC4A03E66D6A4458E587D5D6146F71FC57F359C8D516E0B12A50AB0D9');
  ctx.set('proof2', '6F25B3F4BC7EADAFB8F57D69F8A59DB3B23F198151DBF3C66AC3082381518329');
  ctx.set('proof3', 'C77A290BE17F8A4EF301C4CA46497C5BEB4A0556EC2D5A04DCE4CE6EBD439AD1');
});

spec.beforeEach(async (ctx) => {
  const xcert = await ctx.deploy({ 
    src: './build/xcert-mock.json',
    contract: 'XcertMock',
    args: ['Foo','F','0x9c22ff5f21f0b81b113e63f7db6da94fedef11b2119b4088b89664fb9a3cb658']
  });
  ctx.set('xcert', xcert);
});

spec.test('returns correct convention', async (ctx) => {
  const xcert = ctx.get('xcert');
  const convention = await xcert.methods.conventionId().call();
  ctx.is(convention, '0x9c22ff5f21f0b81b113e63f7db6da94fedef11b2119b4088b89664fb9a3cb658');
});

spec.test('correctly checks all the supported interfaces', async (ctx) => {
  const xcert = ctx.get('xcert');
  const nftokenInterface = await xcert.methods.supportsInterface('0x80ac58cd').call();
  const nftokenMetadataInterface = await xcert.methods.supportsInterface('0x5b5e139f').call();
  const nftokenMetadataEnumerableInterface = await xcert.methods.supportsInterface('0x780e9d63').call();
  const nonExistingInterface = await xcert.methods.supportsInterface('0xa40e9c95').call();
  ctx.is(nftokenInterface, true)
  ctx.is(nftokenMetadataInterface, true);
  ctx.is(nftokenMetadataEnumerableInterface, true);
  ctx.is(nonExistingInterface, false);
});

spec.test('returns correct balance after mint', async (ctx) => {
  const xcert = ctx.get('xcert');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const id = ctx.get('id1');
  const url = ctx.get('url1');
  const proof = ctx.get('proof1');

  await xcert.methods.mint(bob, id, url, proof).send({ from: owner });

  const xcertId1Owner = await xcert.methods.ownerOf(id).call();
  ctx.is(xcertId1Owner, bob);

  const bobXcertCount = await xcert.methods.balanceOf(bob).call();
  ctx.is(bobXcertCount, '1');

  const xcertCount = await xcert.methods.totalSupply().call();
  ctx.is(xcertCount, '1');
});

spec.test('throws when trying to mint two xcerts with the same id', async (ctx) => {
  const xcert = ctx.get('xcert');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const id = ctx.get('id1');
  const url = ctx.get('url1');
  const proof = ctx.get('proof1');

  await xcert.methods.mint(bob, id, url, proof).send({ from: owner });
  await ctx.reverts(() => xcert.methods.mint(bob, id, url, proof).send({ from: owner }), '006006');
});

spec.test('throws when trying to mint an xcert with empty proof', async (ctx) => {
  const xcert = ctx.get('xcert');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const id = ctx.get('id1');
  const url = ctx.get('url1');

  await ctx.reverts(() => xcert.methods.mint(bob, id, url, '').send({ from: owner }), '007002');
});

spec.test('throws when a third party tries to mint an xcert', async (ctx) => {
  const xcert = ctx.get('xcert');
  const bob = ctx.get('bob');
  const id = ctx.get('id1');
  const url = ctx.get('url1');
  const proof = ctx.get('proof1');
  const sara = ctx.get('sara');

  await ctx.reverts(() => xcert.methods.mint(bob, id, url, proof).send({ from: sara }), '007001');
});

spec.test('throws when trying to mint an xcert to zero address', async (ctx) => {
  const xcert = ctx.get('xcert');
  const owner = ctx.get('owner');
  const zeroAddress = ctx.get('zeroAddress');
  const id = ctx.get('id1');
  const url = ctx.get('url1');
  const proof = ctx.get('proof1');

  await ctx.reverts(() => xcert.methods.mint(zeroAddress, id, url, proof).send({ from: owner }), '006001');
});

spec.test('corectly authorizes an address', async (ctx) => {
  const xcert = ctx.get('xcert');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');

  const logs = await xcert.methods.setAuthorizedAddress(bob, true).send({ from: owner });
  ctx.not(logs.events.AuthorizedAddress, undefined);

  const bobAuthorized = await xcert.methods.isAuthorizedAddress(bob).call();
  ctx.is(bobAuthorized, true);
});

spec.test('throws when a third party tries to authorize an address', async (ctx) => {
  const xcert = ctx.get('xcert');
  const bob = ctx.get('bob');
  const sara = ctx.get('sara');

  await ctx.reverts(() => xcert.methods.setAuthorizedAddress(bob, true).send({ from: sara }));
});

spec.test('correctly mints an xcert from an authorized address', async (ctx) => {
  const xcert = ctx.get('xcert');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const sara = ctx.get('sara');
  const id = ctx.get('id1');
  const url = ctx.get('url1');
  const proof = ctx.get('proof1');

  await xcert.methods.setAuthorizedAddress(bob, true).send({ from: owner });
  await xcert.methods.mint(sara, id, url, proof).send({ from: bob });
  const saraXcertCount = await xcert.methods.balanceOf(sara).call();
  ctx.is(saraXcertCount, '1');
});

spec.test('throws trying to mint from address which authorization got revoked', async (ctx) => {
  const xcert = ctx.get('xcert');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const sara = ctx.get('sara');
  const id = ctx.get('id1');
  const url = ctx.get('url1');
  const proof = ctx.get('proof1');

  await xcert.methods.setAuthorizedAddress(bob, true).send({ from: owner });
  await xcert.methods.setAuthorizedAddress(bob, false).send({ from: owner });
  await ctx.reverts(() => xcert.methods.mint(sara, id, url, proof).send({ from: bob }), '007001');
});

spec.test('throws when trying to find owner of a non-existing xcert', async (ctx) => {
  const xcert = ctx.get('xcert');
  const id = ctx.get('id1');

  await ctx.reverts(() => xcert.methods.ownerOf(id).call(), '006002');
});

spec.test('finds the correct amount of xcerts owned by account', async (ctx) => {
  const xcert = ctx.get('xcert');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const id = ctx.get('id1');
  const url = ctx.get('url1');
  const proof = ctx.get('proof1');
  const id2 = ctx.get('id2');
  const url2 = ctx.get('url2');
  const proof2 = ctx.get('proof2');

  await xcert.methods.mint(bob, id, url, proof).send({ from: owner });
  await xcert.methods.mint(bob, id2, url2, proof2).send({ from: owner });

  const count = await xcert.methods.balanceOf(bob).call();
  ctx.is(count, '2');
});

spec.test('throws when trying to get count of xcerts owned by zero address', async (ctx) => {
  const xcert = ctx.get('xcert');
  const zeroAddress = ctx.get('zeroAddress');
  await ctx.reverts(() => xcert.methods.balanceOf(zeroAddress).call(), '006001');
});

spec.test('throws when trying to find owner of non-existant xcert', async (ctx) => {
  const xcert = ctx.get('xcert');
  const id = ctx.get('id1');
  await ctx.reverts(() => xcert.methods.ownerOf(id).call(), '006002');
});

spec.test('correctly approves account', async (ctx) => {
  const xcert = ctx.get('xcert');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const sara = ctx.get('sara');
  const id1 = ctx.get('id1');
  const url1 = ctx.get('url1');
  const proof1 = ctx.get('proof1');

  await xcert.methods.mint(bob, id1, url1, proof1).send({ from: owner });
  const logs = await xcert.methods.approve(sara, id1).send({ from: bob });
  ctx.not(logs.events.Approval, undefined);
  
  const address = await xcert.methods.getApproved(id1).call();;
  ctx.is(address, sara);
});

spec.test('correctly cancels approval', async (ctx) => {
  const xcert = ctx.get('xcert');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const sara = ctx.get('sara');
  const id1 = ctx.get('id1');
  const url1 = ctx.get('url1');
  const proof1 = ctx.get('proof1');
  const zeroAddress = ctx.get('zeroAddress');

  await xcert.methods.mint(bob, id1, url1, proof1).send({ from: owner });
  await xcert.methods.approve(sara, id1).send({ from: bob });
  await xcert.methods.approve(zeroAddress, id1).send({ from: bob });
  
  const address = await xcert.methods.getApproved(id1).call();
  ctx.is(address, zeroAddress);
});

spec.test('throws when trying to get approval of non-existing xcert', async (ctx) => {
  const xcert = ctx.get('xcert');
  const id1 = ctx.get('id1');
  
  await ctx.reverts(() => xcert.methods.getApproved(id1).call(), '006002');
});

spec.test('throws when trying to approve a xcert from a third party', async (ctx) => {
  const xcert = ctx.get('xcert');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const sara = ctx.get('sara');
  const id1 = ctx.get('id1');
  const url1 = ctx.get('url1');
  const proof1 = ctx.get('proof1');

  await xcert.methods.mint(bob, id1, url1, proof1).send({ from: owner });
  await ctx.reverts(() => xcert.methods.approve(sara, id1).send({ from: sara }), '006003');
});

spec.test('correctly sets an operator', async (ctx) => {
  const xcert = ctx.get('xcert');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const sara = ctx.get('sara');
  const id1 = ctx.get('id1');
  const url1 = ctx.get('url1');
  const proof1 = ctx.get('proof1');

  await xcert.methods.mint(bob, id1, url1, proof1).send({ from: owner });
  const logs = await xcert.methods.setApprovalForAll(sara, true).send({ from: bob });
  ctx.not(logs.events.ApprovalForAll, undefined);
  const isApprovedForAll = await xcert.methods.isApprovedForAll(bob, sara).call();
  ctx.is(isApprovedForAll, true);
});

spec.test('correctly sets then cancels an operator', async (ctx) => {
  const xcert = ctx.get('xcert');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const sara = ctx.get('sara');
  const id1 = ctx.get('id1');
  const url1 = ctx.get('url1');
  const proof1 = ctx.get('proof1');

  await xcert.methods.mint(bob, id1, url1, proof1).send({ from: owner });
  await xcert.methods.setApprovalForAll(sara, true).send({ from: bob });
  await xcert.methods.setApprovalForAll(sara, false).send({ from: bob });
  const isApprovedForAll = await xcert.methods.isApprovedForAll(bob, sara).call();
  ctx.is(isApprovedForAll, false);
});

spec.test('corectly transfers xcert from owner', async (ctx) => {
  const xcert = ctx.get('xcert');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const sara = ctx.get('sara');
  const id1 = ctx.get('id1');
  const url1 = ctx.get('url1');
  const proof1 = ctx.get('proof1');

  await xcert.methods.mint(bob, id1, url1, proof1).send({ from: owner });
  const logs = await xcert.methods.transferFrom(bob, sara, id1).send({ from: bob });
  ctx.not(logs.events.Transfer, undefined);

  const bobBalance = await xcert.methods.balanceOf(bob).call();
  const saraBalance = await xcert.methods.balanceOf(sara).call();
  const ownerOfId1 =  await xcert.methods.ownerOf(id1).call();

  ctx.is(bobBalance, '0');
  ctx.is(saraBalance, '1');
  ctx.is(ownerOfId1, sara);
});

spec.test('corectly transfers xcert from approved address', async (ctx) => {
  const xcert = ctx.get('xcert');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const sara = ctx.get('sara');
  const jane = ctx.get('jane');
  const id1 = ctx.get('id1');
  const url1 = ctx.get('url1');
  const proof1 = ctx.get('proof1');

  await xcert.methods.mint(bob, id1, url1, proof1).send({ from: owner });
  await xcert.methods.approve(sara, id1).send({ from: bob });
  await xcert.methods.transferFrom(bob, jane, id1).send({ from: sara });

  const bobBalance = await xcert.methods.balanceOf(bob).call();
  const janeBalance = await xcert.methods.balanceOf(jane).call();
  const ownerOfId1 =  await xcert.methods.ownerOf(id1).call();

  ctx.is(bobBalance, '0');
  ctx.is(janeBalance, '1');
  ctx.is(ownerOfId1, jane);
});

spec.test('corectly transfers xcert as operator', async (ctx) => {
  const xcert = ctx.get('xcert');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const sara = ctx.get('sara');
  const jane = ctx.get('jane');
  const id1 = ctx.get('id1');
  const url1 = ctx.get('url1');
  const proof1 = ctx.get('proof1');

  await xcert.methods.mint(bob, id1, url1, proof1).send({ from: owner });
  await xcert.methods.setApprovalForAll(sara, true).send({ from: bob });
  await xcert.methods.transferFrom(bob, jane, id1).send({ from: sara });

  const bobBalance = await xcert.methods.balanceOf(bob).call();
  const janeBalance = await xcert.methods.balanceOf(jane).call();
  const ownerOfId1 =  await xcert.methods.ownerOf(id1).call();

  ctx.is(bobBalance, '0');
  ctx.is(janeBalance, '1');
  ctx.is(ownerOfId1, jane);
});

spec.test('throws when trying to transfer xcert as an address that is not owner, approved or operator', async (ctx) => {
  const xcert = ctx.get('xcert');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const sara = ctx.get('sara');
  const jane = ctx.get('jane');
  const id1 = ctx.get('id1');
  const url1 = ctx.get('url1');
  const proof1 = ctx.get('proof1');

  await xcert.methods.mint(bob, id1, url1, proof1).send({ from: owner });
  await ctx.reverts(() => xcert.methods.transferFrom(bob, jane, id1).send({ from: sara }), '006004');
});

spec.test('throws when trying to transfer xcert to a zero address', async (ctx) => {
  const xcert = ctx.get('xcert');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const zeroAddress = ctx.get('zeroAddress');
  const id1 = ctx.get('id1');
  const url1 = ctx.get('url1');
  const proof1 = ctx.get('proof1');

  await xcert.methods.mint(bob, id1, url1, proof1).send({ from: owner });
  await ctx.reverts(() => xcert.methods.transferFrom(bob, zeroAddress, id1).send({ from: bob }), '006001');
});

spec.test('throws when trying to transfer a invalid xcert', async (ctx) => {
  const xcert = ctx.get('xcert');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const sara = ctx.get('sara');
  const id1 = ctx.get('id1');
  const url1 = ctx.get('url1');
  const proof1 = ctx.get('proof1');
  const id2 = ctx.get('id2');

  await xcert.methods.mint(bob, id1, url1, proof1).send({ from: owner });
  await ctx.reverts(() => xcert.methods.transferFrom(bob, sara, id2).send({ from: bob }), '006002');
});

spec.test('corectly safe transfers xcert from owner', async (ctx) => {
  const xcert = ctx.get('xcert');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const sara = ctx.get('sara');
  const id1 = ctx.get('id1');
  const url1 = ctx.get('url1');
  const proof1 = ctx.get('proof1');

  await xcert.methods.mint(bob, id1, url1, proof1).send({ from: owner });
  const logs = await xcert.methods.safeTransferFrom(bob, sara, id1).send({ from: bob });
  ctx.not(logs.events.Transfer, undefined);

  const bobBalance = await xcert.methods.balanceOf(bob).call();
  const saraBalance = await xcert.methods.balanceOf(sara).call();
  const ownerOfId1 =  await xcert.methods.ownerOf(id1).call();

  ctx.is(bobBalance, '0');
  ctx.is(saraBalance, '1');
  ctx.is(ownerOfId1, sara);
});

spec.test('throws when trying to safe transfers xcert from owner to a smart contract', async (ctx) => {
  const xcert = ctx.get('xcert');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const id1 = ctx.get('id1');
  const url1 = ctx.get('url1');
  const proof1 = ctx.get('proof1');

  await xcert.methods.mint(bob, id1, url1, proof1).send({ from: owner });
  await ctx.reverts(() => xcert.methods.safeTransferFrom(bob, xcert._address, id1).send({ from: bob }));
});

spec.test('corectly safe transfers xcert from owner to smart contract that can recieve NTFs', async (ctx) => {
  const xcert = ctx.get('xcert');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const id1 = ctx.get('id1');
  const url1 = ctx.get('url1');
  const proof1 = ctx.get('proof1');

  const tokenReceiver = await ctx.deploy({ 
    src: '@0xcert/web3-erc721/build/nf-token-receiver-test-mock.json',
    contract: 'NFTokenReceiverTestMock',
  });

  await xcert.methods.mint(bob, id1, url1, proof1).send({ from: owner });
  await xcert.methods.safeTransferFrom(bob, tokenReceiver._address, id1).send({ from: bob });

  const bobBalance = await xcert.methods.balanceOf(bob).call();
  const saraBalance = await xcert.methods.balanceOf(tokenReceiver._address).call();
  const ownerOfId1 =  await xcert.methods.ownerOf(id1).call();

  ctx.is(bobBalance, '0');
  ctx.is(saraBalance, '1');
  ctx.is(ownerOfId1, tokenReceiver._address);
});

spec.test('corectly safe transfers xcert from owner to smart contract that can recieve NFTs with data', async (ctx) => {
  const xcert = ctx.get('xcert');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const id1 = ctx.get('id1');
  const url1 = ctx.get('url1');
  const proof1 = ctx.get('proof1');

  const tokenReceiver = await ctx.deploy({ 
    src: '@0xcert/web3-erc721/build/nf-token-receiver-test-mock.json',
    contract: 'NFTokenReceiverTestMock',
  });

  await xcert.methods.mint(bob, id1, url1, proof1).send({ from: owner });
  await xcert.methods.safeTransferFrom(bob, tokenReceiver._address, id1, '0x01').send({ from: bob });

  const bobBalance = await xcert.methods.balanceOf(bob).call();
  const saraBalance = await xcert.methods.balanceOf(tokenReceiver._address).call();
  const ownerOfId1 =  await xcert.methods.ownerOf(id1).call();

  ctx.is(bobBalance, '0');
  ctx.is(saraBalance, '1');
  ctx.is(ownerOfId1, tokenReceiver._address);
});

spec.test('returns the correct issuer name', async (ctx) => {
  const xcert = ctx.get('xcert');
  const name = await xcert.methods.name().call();

  ctx.is(name, "Foo");
});

spec.test('returns the correct issuer symbol', async (ctx) => {
  const xcert = ctx.get('xcert');
  const symbol = await xcert.methods.symbol().call();

  ctx.is(symbol, "F");
});

spec.test('return the correct URI', async (ctx) => {
  const xcert = ctx.get('xcert');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const id1 = ctx.get('id1');
  const url1 = ctx.get('url1');
  const proof1 = ctx.get('proof1');

  await xcert.methods.mint(bob, id1, url1, proof1).send({ from: owner });
  const uri = await xcert.methods.tokenURI(id1).call();
  ctx.is(uri, url1);
});

spec.test('throws when trying to get URI of invalid NFT ID', async (ctx) => {
  const xcert = ctx.get('xcert');
  const id1 = ctx.get('id1');

  await ctx.reverts(() => xcert.methods.tokenURI(id1).call(), '006002');
});

spec.test('returns the correct token by index', async (ctx) => {
  const xcert = ctx.get('xcert');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const sara = ctx.get('sara');
  const id1 = ctx.get('id1');
  const id2 = ctx.get('id2');
  const id3 = ctx.get('id3');
  const url1 = ctx.get('url1');
  const url2 = ctx.get('url2');
  const url3 = ctx.get('url3');
  const proof1 = ctx.get('proof1');
  const proof2 = ctx.get('proof2');
  const proof3 = ctx.get('proof3');

  await xcert.methods.mint(bob, id1, url1, proof1).send({ from: owner });
  await xcert.methods.mint(bob, id2, url2, proof2).send({ from: owner });
  await xcert.methods.mint(sara, id3, url3, proof3).send({ from: owner });

  const tokenIndex0 = await xcert.methods.tokenByIndex(0).call();
  const tokenIndex1 = await xcert.methods.tokenByIndex(1).call();
  const tokenIndex2 = await xcert.methods.tokenByIndex(2).call();
  
  ctx.is(tokenIndex0, id1);
  ctx.is(tokenIndex1, id2);
  ctx.is(tokenIndex2, id3);
});

spec.test('throws when trying to get xcert by non-existing index', async (ctx) => {
  const xcert = ctx.get('xcert');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const id1 = ctx.get('id1');
  const url1 = ctx.get('url1');
  const proof1 = ctx.get('proof1');

  await xcert.methods.mint(bob, id1, url1, proof1).send({ from: owner });
  await ctx.reverts(() => xcert.methods.tokenByIndex(1).call(), '006007');
});

spec.test('returns the correct token of owner by index', async (ctx) => {
  const xcert = ctx.get('xcert');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const sara = ctx.get('sara');
  const id1 = ctx.get('id1');
  const id2 = ctx.get('id2');
  const id3 = ctx.get('id3');
  const url1 = ctx.get('url1');
  const url2 = ctx.get('url2');
  const url3 = ctx.get('url3');
  const proof1 = ctx.get('proof1');
  const proof2 = ctx.get('proof2');
  const proof3 = ctx.get('proof3');

  await xcert.methods.mint(bob, id1, url1, proof1).send({ from: owner });
  await xcert.methods.mint(bob, id2, url2, proof2).send({ from: owner });
  await xcert.methods.mint(sara, id3, url3, proof3).send({ from: owner });

  const tokenOwnerIndex1 = await xcert.methods.tokenOfOwnerByIndex(bob, 1).call();
  ctx.is(tokenOwnerIndex1, id2);
});

spec.test('throws when trying to get xcert of owner by non-existing index', async (ctx) => {
  const xcert = ctx.get('xcert');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const id1 = ctx.get('id1');
  const url1 = ctx.get('url1');
  const proof1 = ctx.get('proof1');

  await xcert.methods.mint(bob, id1, url1, proof1).send({ from: owner });
  await ctx.reverts(() => xcert.methods.tokenOfOwnerByIndex(bob, 1).call(), '006007');
});

spec.test('returns the correct proof', async (ctx) => {
  const xcert = ctx.get('xcert');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const id = ctx.get('id1');
  const url = ctx.get('url1');
  const proof = ctx.get('proof1');

  await xcert.methods.mint(bob, id, url, proof).send({ from: owner });
  const xcertId1Proof = await xcert.methods.tokenProof(id).call();
  ctx.is(xcertId1Proof, proof);
});