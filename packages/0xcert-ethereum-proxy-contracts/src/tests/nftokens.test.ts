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
const ABILITY_TO_EXECUTE = 2;


spec.beforeEach(async (ctx) => {
  const accounts = await ctx.web3.eth.getAccounts();
  ctx.set('owner', accounts[0]);
  ctx.set('bob', accounts[1]);
  ctx.set('jane', accounts[2]);
  ctx.set('sara', accounts[3]);
});

spec.beforeEach(async (ctx) => {
  const nftProxy = await ctx.deploy({
    src: './build/nftoken-transfer-proxy.json',
    contract: 'NFTokenTransferProxy',
  });
  ctx.set('nftProxy', nftProxy);
});

spec.test('adds authorized address', async (ctx) => {
  const nftProxy = ctx.get('nftProxy');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const logs = await nftProxy.instance.methods.grantAbilities(bob, ABILITY_TO_EXECUTE).send({ from: owner });
  ctx.not(logs.events.GrantAbilities, undefined);

  const bobHasAbilityToExecute = await nftProxy.instance.methods.isAble(bob, ABILITY_TO_EXECUTE).call();
  ctx.is(bobHasAbilityToExecute, true);
});

spec.test('removes authorized address', async (ctx) => {
  const nftProxy = ctx.get('nftProxy');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  await nftProxy.instance.methods.grantAbilities(bob, ABILITY_TO_EXECUTE).send({ from: owner });
  const logs = await nftProxy.instance.methods.revokeAbilities(bob, ABILITY_TO_EXECUTE).send({ from: owner });
  ctx.not(logs.events.RevokeAbilities, undefined);

  const bobHasAbilityToExecute = await nftProxy.instance.methods.isAble(bob, ABILITY_TO_EXECUTE).call();
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

spec.test('fails if transfer is triggered by an unauthorized address', async (ctx) => {
  const nftProxy = ctx.get('nftProxy');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const jane = ctx.get('jane');
  const sara = ctx.get('sara');

  const cat = await ctx.deploy({ 
    src: '@0xcert/ethereum-erc721-contracts/build/nf-token-metadata-enumerable-mock.json',
    contract: 'NFTokenMetadataEnumerableMock',
    args: ['cat', 'CAT','http://0xcert.org/'],
  });

  await cat.instance.methods
    .create(jane, 1)
    .send({
       from: owner ,
      gas: 4000000,
    });

  await cat.instance.methods.approve(nftProxy.receipt._address, 1).send({from: jane});
  await ctx.reverts(() => nftProxy.instance.methods.execute(cat.receipt._address, jane, sara, 1).send({ from: bob }), '017001');
});

export default spec;