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
  url1?: string;
  url2?: string;
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
  ctx.set('url1', 'http://0xcert.org/1');
  ctx.set('url2', 'http://0xcert.org/2');
});

spec.beforeEach(async (ctx) => {
  const nfToken = await ctx.deploy({ 
    src: './build/nf-token-metadata-test-mock.json',
    contract: 'NFTokenMetadataTestMock',
    args: ['Foo','F']
  });
  ctx.set('nfToken', nfToken);
});

spec.test('correctly checks all the supported interfaces', async (ctx) => {
  const nftoken = ctx.get('nfToken');
  const nftokenInterface = await nftoken.instance.methods.supportsInterface('0x80ac58cd').call();
  const nftokenMetadataInterface = await nftoken.instance.methods.supportsInterface('0x5b5e139f').call();
  const nftokenNonExistingInterface = await nftoken.instance.methods.supportsInterface('0x780e9d63').call();
  ctx.is(nftokenInterface, true);
  ctx.is(nftokenMetadataInterface, true);
  ctx.is(nftokenNonExistingInterface, false);
});

spec.test('correctly mints a NFT', async (ctx) => {
  const nftoken = ctx.get('nfToken');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const id1 = ctx.get('id1');
  const url1 = ctx.get('url1');

  const logs = await nftoken.instance.methods.mint(bob, id1, url1).send({ from: owner });
  ctx.not(logs.events.Transfer, undefined);
  const count = await nftoken.instance.methods.balanceOf(bob).call();
  ctx.is(count.toString(), '1');

});

spec.test('returns correct balanceOf', async (ctx) => {
  const nftoken = ctx.get('nfToken');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const id1 = ctx.get('id1');
  const url1 = ctx.get('url1');
  const id2 = ctx.get('id2');
  const url2 = ctx.get('url2');

  let count = await nftoken.instance.methods.balanceOf(bob).call();
  ctx.is(count.toString(), '0');

  await nftoken.instance.methods.mint(bob, id1, url1).send({ from: owner });
  count = await nftoken.instance.methods.balanceOf(bob).call();
  ctx.is(count.toString(), '1');

  await nftoken.instance.methods.mint(bob, id2, url2).send({ from: owner });
  count = await nftoken.instance.methods.balanceOf(bob).call();
  ctx.is(count.toString(), '2');
});

spec.test('throws when trying to get count of NFTs owned by 0x0 address', async (ctx) => {
  const nftoken = ctx.get('nfToken');
  const zeroAddress = ctx.get('zeroAddress');

  await ctx.reverts(() => nftoken.instance.methods.balanceOf(zeroAddress).call(), '004001');
});

spec.test('throws when trying to mint 2 NFTs with the same ids', async (ctx) => {
  const nftoken = ctx.get('nfToken');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const id1 = ctx.get('id1');
  const url1 = ctx.get('url1');
  await nftoken.instance.methods.mint(bob, id1, url1).send({ from: owner });
  await ctx.reverts(() => nftoken.instance.methods.mint(bob, id1, url1).send({ from: owner }), '004006');
});

spec.test('throws when trying to mint NFT to 0x0 address', async (ctx) => {
  const nftoken = ctx.get('nfToken');
  const owner = ctx.get('owner');
  const zeroAddress = ctx.get('zeroAddress');
  const id1 = ctx.get('id1');
  const url1 = ctx.get('url1');
  await ctx.reverts(() => nftoken.instance.methods.mint(zeroAddress, id1, url1).send({ from: owner }), '004001');
});

spec.test('finds the correct owner of NFToken id', async (ctx) => {
  const nftoken = ctx.get('nfToken');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const id1 = ctx.get('id1');
  const url1 = ctx.get('url1');

  await nftoken.instance.methods.mint(bob, id1, url1).send({ from: owner });
  const id1Owner = await nftoken.instance.methods.ownerOf(id1).call();
  ctx.is(id1Owner, bob);
});

spec.test('throws when trying to find owner od non-existing NFT id', async (ctx) => {
  const nftoken = ctx.get('nfToken');
  const id1 = ctx.get('id1');

  await ctx.reverts(() => nftoken.instance.methods.ownerOf(id1).call(), '004002');
});

spec.test('correctly approves account', async (ctx) => {
  const nftoken = ctx.get('nfToken');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const sara = ctx.get('sara');
  const id1 = ctx.get('id1');
  const url1 = ctx.get('url1');

  await nftoken.instance.methods.mint(bob, id1, url1).send({ from: owner });
  const logs = await nftoken.instance.methods.approve(sara, id1).send({ from: bob });
  ctx.not(logs.events.Approval, undefined);
  
  const address = await nftoken.instance.methods.getApproved(id1).call();;
  ctx.is(address, sara);
});

spec.test('correctly cancels approval', async (ctx) => {
  const nftoken = ctx.get('nfToken');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const sara = ctx.get('sara');
  const id1 = ctx.get('id1');
  const url1 = ctx.get('url1');
  const zeroAddress = ctx.get('zeroAddress');

  await nftoken.instance.methods.mint(bob, id1, url1).send({ from: owner });
  await nftoken.instance.methods.approve(sara, id1).send({ from: bob });
  await nftoken.instance.methods.approve(zeroAddress, id1).send({ from: bob });
  
  const address = await nftoken.instance.methods.getApproved(id1).call();
  ctx.is(address, zeroAddress);
});

spec.test('throws when trying to get approval of non-existing NFT id', async (ctx) => {
  const nftoken = ctx.get('nfToken');
  const id1 = ctx.get('id1');
  
  await ctx.reverts(() => nftoken.instance.methods.getApproved(id1).call(), '004002');
});

spec.test('throws when trying to approve NFT ID from a third party', async (ctx) => {
  const nftoken = ctx.get('nfToken');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const sara = ctx.get('sara');
  const id1 = ctx.get('id1');
  const url1 = ctx.get('url1');

  await nftoken.instance.methods.mint(bob, id1, url1).send({ from: owner });
  await ctx.reverts(() => nftoken.instance.methods.approve(sara, id1).send({ from: sara }), '004003');
});

spec.test('correctly sets an operator', async (ctx) => {
  const nftoken = ctx.get('nfToken');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const sara = ctx.get('sara');
  const id1 = ctx.get('id1');
  const url1 = ctx.get('url1');

  await nftoken.instance.methods.mint(bob, id1, url1).send({ from: owner });
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
  const url1 = ctx.get('url1');

  await nftoken.instance.methods.mint(bob, id1, url1).send({ from: owner });
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
  const url1 = ctx.get('url1');

  await nftoken.instance.methods.mint(bob, id1, url1).send({ from: owner });
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
  const url1 = ctx.get('url1');

  await nftoken.instance.methods.mint(bob, id1, url1).send({ from: owner });
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
  const url1 = ctx.get('url1');

  await nftoken.instance.methods.mint(bob, id1, url1).send({ from: owner });
  await nftoken.instance.methods.setApprovalForAll(sara, true).send({ from: bob });
  await nftoken.instance.methods.transferFrom(bob, jane, id1).send({ from: sara });

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
  const url1 = ctx.get('url1');

  await nftoken.instance.methods.mint(bob, id1, url1).send({ from: owner });
  await ctx.reverts(() => nftoken.instance.methods.transferFrom(bob, jane, id1).send({ from: sara }), '004004');
});

spec.test('throws when trying to transfer NFT to a zero address', async (ctx) => {
  const nftoken = ctx.get('nfToken');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const zeroAddress = ctx.get('zeroAddress');
  const id1 = ctx.get('id1');
  const url1 = ctx.get('url1');

  await nftoken.instance.methods.mint(bob, id1, url1).send({ from: owner });
  await ctx.reverts(() => nftoken.instance.methods.transferFrom(bob, zeroAddress, id1).send({ from: bob }), '004001');
});

spec.test('throws when trying to transfer a invalid NFT', async (ctx) => {
  const nftoken = ctx.get('nfToken');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const sara = ctx.get('sara');
  const id1 = ctx.get('id1');
  const url1 = ctx.get('url1');
  const id2 = ctx.get('id2');

  await nftoken.instance.methods.mint(bob, id1, url1).send({ from: owner });
  await ctx.reverts(() => nftoken.instance.methods.transferFrom(bob, sara, id2).send({ from: bob }), '004002');
});

spec.test('corectly safe transfers NFT from owner', async (ctx) => {
  const nftoken = ctx.get('nfToken');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const sara = ctx.get('sara');
  const id1 = ctx.get('id1');
  const url1 = ctx.get('url1');

  await nftoken.instance.methods.mint(bob, id1, url1).send({ from: owner });
  const logs = await nftoken.instance.methods.safeTransferFrom(bob, sara, id1).send({ from: bob });
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
  const url1 = ctx.get('url1');

  await nftoken.instance.methods.mint(bob, id1, url1).send({ from: owner });
  await ctx.reverts(() => nftoken.instance.methods.safeTransferFrom(bob, nftoken.receipt._address, id1).send({ from: bob }));
});

spec.test('corectly safe transfers NFT from owner to smart contract that can recieve NFTs', async (ctx) => {
  const nftoken = ctx.get('nfToken');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const id1 = ctx.get('id1');
  const url1 = ctx.get('url1');

  const tokenReceiver = await ctx.deploy({ 
    src: './build/nf-token-receiver-test-mock.json',
    contract: 'NFTokenReceiverTestMock',
  });

  await nftoken.instance.methods.mint(bob, id1, url1).send({ from: owner });
  await nftoken.instance.methods.safeTransferFrom(bob, tokenReceiver.receipt._address, id1).send({ from: bob });

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
  const url1 = ctx.get('url1');

  const tokenReceiver = await ctx.deploy({ 
    src: './build/nf-token-receiver-test-mock.json',
    contract: 'NFTokenReceiverTestMock',
  });

  await nftoken.instance.methods.mint(bob, id1, url1).send({ from: owner });
  await nftoken.instance.methods.safeTransferFrom(bob, tokenReceiver.receipt._address, id1, '0x01').send({ from: bob });

  const bobBalance = await nftoken.instance.methods.balanceOf(bob).call();
  const saraBalance = await nftoken.instance.methods.balanceOf(tokenReceiver.receipt._address).call();
  const ownerOfId1 =  await nftoken.instance.methods.ownerOf(id1).call();

  ctx.is(bobBalance, '0');
  ctx.is(saraBalance, '1');
  ctx.is(ownerOfId1, tokenReceiver.receipt._address);
});

spec.test('returns the correct issuer name', async (ctx) => {
  const nftoken = ctx.get('nfToken');
  const name = await nftoken.instance.methods.name().call();

  ctx.is(name, "Foo");
});

spec.test('returns the correct issuer symbol', async (ctx) => {
  const nftoken = ctx.get('nfToken');
  const symbol = await nftoken.instance.methods.symbol().call();

  ctx.is(symbol, "F");
});

spec.test('return the correct URI', async (ctx) => {
  const nftoken = ctx.get('nfToken');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const id1 = ctx.get('id1');
  const url1 = ctx.get('url1');

  await nftoken.instance.methods.mint(bob, id1, url1).send({ from: owner });
  const uri = await nftoken.instance.methods.tokenURI(id1).call();
  ctx.is(uri, url1);
});

spec.test('throws when trying to get URI of invalid NFT ID', async (ctx) => {
  const nftoken = ctx.get('nfToken');
  const id1 = ctx.get('id1');

  await ctx.reverts(() => nftoken.instance.methods.tokenURI(id1).call(), '004002');
});

spec.test('corectly burns a NFT', async (ctx) => {
  const nftoken = ctx.get('nfToken');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const id1 = ctx.get('id1');
  const url1 = ctx.get('url1');

  await nftoken.instance.methods.mint(bob, id1, url1).send({ from: owner });
  const logs = await nftoken.instance.methods.burn(id1).send({ from: owner });
  ctx.not(logs.events.Transfer, undefined);

  const balance = await nftoken.instance.methods.balanceOf(bob).call();
  ctx.is(balance, '0');
  await ctx.reverts(() => nftoken.instance.methods.ownerOf(id1).call(), '004002');

  const uri = await nftoken.instance.methods.checkUri(id1).call();
  ctx.is(uri, '');
});

spec.test('throws when trying to burn non existant NFT', async (ctx) => {
  const nftoken = ctx.get('nfToken');
  const owner = ctx.get('owner');
  const id1 = ctx.get('id1');

  await ctx.reverts(() => nftoken.instance.methods.burn(id1).send({ from: owner }), '004002');
});