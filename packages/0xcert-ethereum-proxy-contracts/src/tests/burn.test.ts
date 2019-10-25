import { bigNumberify } from '@0xcert/ethereum-utils';
import { XcertAbilities } from '@0xcert/ethereum-xcert-contracts/src/core/types';
import { Spec } from '@specron/spec';
import { XcertCreateProxyAbilities } from '../core/types';

/**
 * Spec context interfaces.
 */

interface Data {
  xcertBurnProxy?: any;
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
  const xcertBurnProxy = await ctx.deploy({
    src: './build/xcert-burn-proxy.json',
    contract: 'XcertBurnProxy',
  });
  ctx.set('xcertBurnProxy', xcertBurnProxy);
});

spec.test('adds authorized address', async (ctx) => {
  const xcertBurnProxy = ctx.get('xcertBurnProxy');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const logs = await xcertBurnProxy.instance.methods.grantAbilities(bob, XcertCreateProxyAbilities.EXECUTE).send({ from: owner });
  ctx.not(logs.events.SetAbilities, undefined);

  const bobHasAbilityToExecute = await xcertBurnProxy.instance.methods.isAble(bob, XcertCreateProxyAbilities.EXECUTE).call();
  ctx.is(bobHasAbilityToExecute, true);
});

spec.test('removes authorized address', async (ctx) => {
  const xcertBurnProxy = ctx.get('xcertBurnProxy');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  await xcertBurnProxy.instance.methods.grantAbilities(bob, XcertCreateProxyAbilities.EXECUTE).send({ from: owner });
  const logs = await xcertBurnProxy.instance.methods.revokeAbilities(bob, XcertCreateProxyAbilities.EXECUTE).send({ from: owner });
  ctx.not(logs.events.SetAbilities, undefined);

  const bobHasAbilityToExecute = await xcertBurnProxy.instance.methods.isAble(bob, XcertCreateProxyAbilities.EXECUTE).call();
  ctx.is(bobHasAbilityToExecute, false);
});

spec.test('destroys an Xcert', async (ctx) => {
  const xcertBurnProxy = ctx.get('xcertBurnProxy');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const jane = ctx.get('jane');
  const imprint = '0x16ba121a04d5ad3b885f09af5c6c08b68766ce43d990f8420dc97f6ff485cb37';

  await xcertBurnProxy.instance.methods.grantAbilities(bob, XcertCreateProxyAbilities.EXECUTE).send({ from: owner });

  const cat = await ctx.deploy({
    src: '@0xcert/ethereum-xcert-contracts/build/xcert-mock.json',
    contract: 'XcertMock',
    args: ['cat', 'CAT', 'https://0xcert.org/', '.json', '0xa65de9e6', ['0x9d118770']],
  });

  await cat.instance.methods.create(jane, 1, imprint).send({ from: owner });
  await cat.instance.methods.setApprovalForAll(xcertBurnProxy.receipt._address, true).send({ from: jane });
  await xcertBurnProxy.instance.methods.destroy(cat.receipt._address, 1).send({ from: bob });
  await ctx.reverts(() => cat.instance.methods.ownerOf(1).call());
});

spec.test('fails if destroy is triggered by an unauthorized address', async (ctx) => {
  const xcertBurnProxy = ctx.get('xcertBurnProxy');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const jane = ctx.get('jane');
  const imprint = '0x16ba121a04d5ad3b885f09af5c6c08b68766ce43d990f8420dc97f6ff485cb37';

  await xcertBurnProxy.instance.methods.grantAbilities(bob, XcertCreateProxyAbilities.EXECUTE).send({ from: owner });

  const cat = await ctx.deploy({
    src: '@0xcert/ethereum-xcert-contracts/build/xcert-mock.json',
    contract: 'XcertMock',
    args: ['cat', 'CAT', 'https://0xcert.org/', '.json', '0xa65de9e6', ['0x9d118770']],
  });

  await cat.instance.methods.create(jane, 1, imprint).send({ from: owner });
  await ctx.reverts(() =>  xcertBurnProxy.instance.methods.destroy(cat.receipt._address, 1).send({ from: bob }));
});

export default spec;
