import { bigNumberify } from '@0xcert/ethereum-utils';
import { XcertAbilities } from '@0xcert/ethereum-xcert-contracts/src/core/types';
import { Spec } from '@specron/spec';
import { XcertCreateProxyAbilities } from '../core/types';

/**
 * Spec context interfaces.
 */

interface Data {
  xcertUpdateProxy?: any;
  owner?: string;
  bob?: string;
  jane?: string;
  cat?: string;
}

const spec = new Spec<Data>();

spec.before(async (ctx) => {
  const accounts = await ctx.web3.eth.getAccounts();
  ctx.set('owner', accounts[0]);
  ctx.set('bob', accounts[1]);
  ctx.set('jane', accounts[2]);
});

spec.beforeEach(async (ctx) => {
  const xcertUpdateProxy = await ctx.deploy({
    src: './build/xcert-update-proxy.json',
    contract: 'XcertUpdateProxy',
  });
  ctx.set('xcertUpdateProxy', xcertUpdateProxy);
});

spec.test('adds authorized address', async (ctx) => {
  const xcertUpdateProxy = ctx.get('xcertUpdateProxy');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const logs = await xcertUpdateProxy.instance.methods.grantAbilities(bob, XcertCreateProxyAbilities.EXECUTE).send({ from: owner });
  ctx.not(logs.events.SetAbilities, undefined);

  const bobHasAbilityToExecute = await xcertUpdateProxy.instance.methods.isAble(bob, XcertCreateProxyAbilities.EXECUTE).call();
  ctx.is(bobHasAbilityToExecute, true);
});

spec.test('removes authorized address', async (ctx) => {
  const xcertUpdateProxy = ctx.get('xcertUpdateProxy');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  await xcertUpdateProxy.instance.methods.grantAbilities(bob, XcertCreateProxyAbilities.EXECUTE).send({ from: owner });
  const logs = await xcertUpdateProxy.instance.methods.revokeAbilities(bob, XcertCreateProxyAbilities.EXECUTE).send({ from: owner });
  ctx.not(logs.events.SetAbilities, undefined);

  const bobHasAbilityToExecute = await xcertUpdateProxy.instance.methods.isAble(bob, XcertCreateProxyAbilities.EXECUTE).call();
  ctx.is(bobHasAbilityToExecute, false);
});

spec.test('updates an Xcert', async (ctx) => {
  const xcertUpdateProxy = ctx.get('xcertUpdateProxy');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const jane = ctx.get('jane');
  const imprint = '0x16ba121a04d5ad3b885f09af5c6c08b68766ce43d990f8420dc97f6ff485cb37';
  const newImprint = '0x6108466288093cf38a5b155b015dc556cb23dd48e3bf4739aef4932541db8eea';

  await xcertUpdateProxy.instance.methods.grantAbilities(bob, XcertCreateProxyAbilities.EXECUTE).send({ from: owner });

  const cat = await ctx.deploy({
    src: '@0xcert/ethereum-xcert-contracts/build/xcert-mock.json',
    contract: 'XcertMock',
    args: ['cat', 'CAT', 'https://0xcert.org/', '.json', '0xa65de9e6', ['0x0d04c3b8']],
  });

  await cat.instance.methods.grantAbilities(xcertUpdateProxy.receipt._address, XcertAbilities.UPDATE_ASSET_IMPRINT).send({ from: owner });
  await cat.instance.methods.create(jane, 1, imprint).send({ from: owner });
  let token1Imprint = await cat.instance.methods.tokenImprint(1).call();
  ctx.is(token1Imprint, imprint);
  await xcertUpdateProxy.instance.methods.update(cat.receipt._address, 1, newImprint).send({ from: bob });

  token1Imprint = await cat.instance.methods.tokenImprint(1).call();
  ctx.is(token1Imprint, newImprint);
});

spec.test('fails if update is triggered by an unauthorized address', async (ctx) => {
  const xcertUpdateProxy = ctx.get('xcertUpdateProxy');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const jane = ctx.get('jane');
  const imprint = '0x16ba121a04d5ad3b885f09af5c6c08b68766ce43d990f8420dc97f6ff485cb37';
  const newImprint = '0x6108466288093cf38a5b155b015dc556cb23dd48e3bf4739aef4932541db8eea';

  const cat = await ctx.deploy({
    src: '@0xcert/ethereum-xcert-contracts/build/xcert-mock.json',
    contract: 'XcertMock',
    args: ['cat', 'CAT', 'https://0xcert.org/', '.json', '0xa65de9e6', ['0x0d04c3b8']],
  });

  await cat.instance.methods.grantAbilities(xcertUpdateProxy.receipt._address, XcertAbilities.UPDATE_ASSET_IMPRINT).send({ from: owner });
  await cat.instance.methods.create(jane, 1, imprint);
  await ctx.reverts(() => xcertUpdateProxy.instance.methods.update(cat.receipt._address, 1, newImprint).send({ from: bob }), '017001');
});

export default spec;
