import { Spec } from '@specron/spec';

/**
 * Spec context interfaces.
 */

interface Data {
  nftProxy?: any;
  owner?: string;
  bob?: string;
  jane?: string;
  sara?: string;
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
  const nftProxy = await ctx.deploy({
    src: './build/nftokens-transfer-proxy.json',
    contract: 'NFTokenTransferProxy',
  });
  ctx.set('nftProxy', nftProxy);
});

spec.test('adds authorized address', async (ctx) => {
  const nftProxy = ctx.get('nftProxy');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const logs = await nftProxy.methods.addAuthorizedAddress(bob).send({from: owner});
  ctx.not(logs.events.LogAuthorizedAddressAdded, undefined);

  const authorizedAddresses = await nftProxy.methods.getAuthorizedAddresses().call();
  ctx.is(authorizedAddresses[0], bob);
});

spec.test('fails when trying to add an already authorized address', async (ctx) => {
  const nftProxy = ctx.get('nftProxy');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  await nftProxy.methods.addAuthorizedAddress(bob).send({from: owner});
  await ctx.reverts(() => nftProxy.methods.addAuthorizedAddress(bob).send({from: owner}));
});

spec.test('removes authorized address', async (ctx) => {
  const nftProxy = ctx.get('nftProxy');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  await nftProxy.methods.addAuthorizedAddress(bob).send({from: owner});
  const logs = await nftProxy.methods.removeAuthorizedAddress(bob).send({from: owner});
  ctx.not(logs.events.LogAuthorizedAddressRemoved, undefined);

  const authorizedAddresses = await nftProxy.methods.getAuthorizedAddresses().call();
  ctx.is(authorizedAddresses.length, 0);
});

spec.test('fails when trying to remove an already unauthorized address', async (ctx) => {
  const nftProxy = ctx.get('nftProxy');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  await ctx.reverts(() => nftProxy.methods.removeAuthorizedAddress(bob).send({from: owner}));
});

spec.test('transfers an NFT', async (ctx) => {
  const nftProxy = ctx.get('nftProxy');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const jane = ctx.get('jane');
  const sara = ctx.get('sara');

  await nftProxy.methods.addAuthorizedAddress(bob).send({from: owner});

  const cat = await ctx.deploy({ 
    src: '@0xcert/ethereum-erc721/build/contracts/NFTokenMetadataEnumerableMock.json',
    args: ['cat', 'CAT'],
  });

  await cat.methods
    .mint(jane, 1, 'http://0xcert.org')
    .send({
      from: owner,
      gas: 4000000,
    });

  await cat.methods.approve(nftProxy._address, 1).send({from: jane});
  await nftProxy.methods.transferFrom(cat._address, jane, sara, 1).send({from: bob,  gas: 4000000});

  const newOwner = await cat.methods.ownerOf(1).call();
  ctx.is(newOwner, sara);
});

spec.test('fails if transfer is triggered by an unauthorized address', async (ctx) => {
  const nftProxy = ctx.get('nftProxy');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const jane = ctx.get('jane');
  const sara = ctx.get('sara');

  const cat = await ctx.deploy({ 
    src: '@0xcert/ethereum-erc721/build/contracts/NFTokenMetadataEnumerableMock.json',
    args: ['cat', 'CAT'],
  });

  await cat.methods
    .mint(jane, 1, 'http://0xcert.org')
    .send({
      from: owner,
      gas: 4000000,
    });

  await cat.methods.approve(nftProxy._address, 1).send({from: jane});
  await ctx.reverts(() => nftProxy.methods.transferFrom(cat._address, jane, sara, 1).send({from: bob,  gas: 4000000}));
});

export default spec;