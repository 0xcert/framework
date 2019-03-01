import { bigNumberify } from '@0xcert/ethereum-utils';
import { Spec } from '@specron/spec';
import { NFTokenSafeTransferProxyAbilities } from '../core/types';

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

spec.before(async (ctx) => {
  const accounts = await ctx.web3.eth.getAccounts();
  ctx.set('owner', accounts[0]);
  ctx.set('bob', accounts[1]);
  ctx.set('jane', accounts[2]);
  ctx.set('sara', accounts[3]);
});

spec.beforeEach(async (ctx) => {
  const nftProxy = await ctx.deploy({
    src: './build/nftoken-safe-transfer-proxy.json',
    contract: 'NFTokenSafeTransferProxy',
  });
  ctx.set('nftProxy', nftProxy);
});

spec.test('adds authorized address', async (ctx) => {
  const nftProxy = ctx.get('nftProxy');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const logs = await nftProxy.instance.methods.grantAbilities(bob, NFTokenSafeTransferProxyAbilities.EXECUTE).send({ from: owner });
  ctx.not(logs.events.GrantAbilities, undefined);

  const bobHasAbilityToExecute = await nftProxy.instance.methods.isAble(bob, NFTokenSafeTransferProxyAbilities.EXECUTE).call();
  ctx.is(bobHasAbilityToExecute, true);
});

spec.test('removes authorized address', async (ctx) => {
  const nftProxy = ctx.get('nftProxy');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  await nftProxy.instance.methods.grantAbilities(bob, NFTokenSafeTransferProxyAbilities.EXECUTE).send({ from: owner });
  const logs = await nftProxy.instance.methods.revokeAbilities(bob, NFTokenSafeTransferProxyAbilities.EXECUTE).send({ from: owner });
  ctx.not(logs.events.RevokeAbilities, undefined);

  const bobHasAbilityToExecute = await nftProxy.instance.methods.isAble(bob, NFTokenSafeTransferProxyAbilities.EXECUTE).call();
  ctx.is(bobHasAbilityToExecute, false);
});

spec.test('transfers an NFT', async (ctx) => {
  const nftProxy = ctx.get('nftProxy');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const jane = ctx.get('jane');
  const sara = ctx.get('sara');

  await nftProxy.instance.methods.grantAbilities(bob, 2).send({ from: owner });

  const cat = await ctx.deploy({
    src: '@0xcert/ethereum-erc721-contracts/build/nf-token-metadata-enumerable-mock.json',
    contract: 'NFTokenMetadataEnumerableMock',
    args: ['cat', 'CAT', 'http://0xcert.org/'],
  });

  await cat.instance.methods
    .create(jane, 1)
    .send({
      from: owner ,
      gas: 4000000,
    });

  await cat.instance.methods.approve(nftProxy.receipt._address, 1).send({ from: jane });
  await nftProxy.instance.methods.execute(cat.receipt._address, jane, sara, 1).send({ from: bob });

  const newOwner = await cat.instance.methods.ownerOf(1).call();
  ctx.is(newOwner, sara);
});

spec.test('transfers an NFT with high ID', async (ctx) => {
  const nftProxy = ctx.get('nftProxy');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const jane = ctx.get('jane');
  const sara = ctx.get('sara');

  await nftProxy.instance.methods.grantAbilities(bob, 2).send({ from: owner });

  const cat = await ctx.deploy({
    src: '@0xcert/ethereum-erc721-contracts/build/nf-token-metadata-enumerable-mock.json',
    contract: 'NFTokenMetadataEnumerableMock',
    args: ['cat', 'CAT', 'http://0xcert.org/'],
  });

  await cat.instance.methods
    .create(jane, bigNumberify('0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFE'))
    .send({
      from: owner ,
      gas: 4000000,
    });

  await cat.instance.methods.approve(nftProxy.receipt._address, bigNumberify('0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFE')).send({ from: jane });
  await nftProxy.instance.methods.execute(cat.receipt._address, jane, sara, bigNumberify('0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFE')).send({ from: bob });

  const newOwner = await cat.instance.methods.ownerOf(bigNumberify('0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFE')).call();
  ctx.is(newOwner, sara);
});

spec.test('fails if transfer is triggered by an unauthorized address', async (ctx) => {
  const nftProxy = ctx.get('nftProxy');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const jane = ctx.get('jane');
  const sara = ctx.get('sara');

  const cat = await ctx.deploy({
    src: '@0xcert/ethereum-erc721-contracts/build/nf-token-metadata-enumerable-mock.json',
    contract: 'NFTokenMetadataEnumerableMock',
    args: ['cat', 'CAT', 'http://0xcert.org/'],
  });

  await cat.instance.methods
    .create(jane, 1)
    .send({
      from: owner,
      gas: 4000000,
    });

  await cat.instance.methods.approve(nftProxy.receipt._address, 1).send({from: jane});
  await ctx.reverts(() => nftProxy.instance.methods.execute(cat.receipt._address, jane, sara, 1).send({ from: bob }), '017001');
});

spec.test('fails when transfering to a contract without receiver', async (ctx) => {
  const nftProxy = ctx.get('nftProxy');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const jane = ctx.get('jane');

  await nftProxy.instance.methods.grantAbilities(bob, NFTokenSafeTransferProxyAbilities.EXECUTE).send({ from: owner });

  const cat = await ctx.deploy({
    src: '@0xcert/ethereum-erc721-contracts/build/nf-token-metadata-enumerable-mock.json',
    contract: 'NFTokenMetadataEnumerableMock',
    args: ['cat', 'CAT', 'http://0xcert.org/'],
  });

  await cat.instance.methods
    .create(jane, 1)
    .send({
      from: owner,
      gas: 4000000,
    });

  await cat.instance.methods.approve(nftProxy.receipt._address, 1).send({from: jane});
  await ctx.reverts(() => nftProxy.instance.methods.execute(cat.receipt._address, jane, nftProxy.receipt._address, 1).send({ from: bob }));
});

export default spec;
