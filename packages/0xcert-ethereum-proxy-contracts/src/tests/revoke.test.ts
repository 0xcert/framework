import { XcertAbilities } from '@0xcert/ethereum-xcert-contracts/src/core/types';
import { Spec } from '@specron/spec';
import { XcertRevokeProxyAbilities } from '../core/types';

/**
 * Spec context interfaces.
 */

interface Data {
  xcertRevokeProxy?: any;
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
  const xcertRevokeProxy = await ctx.deploy({
    src: './build/xcert-revoke-proxy.json',
    contract: 'XcertRevokeProxy',
  });
  ctx.set('xcertRevokeProxy', xcertRevokeProxy);
});

spec.test('adds authorized address', async (ctx) => {
  const xcertRevokeProxy = ctx.get('xcertRevokeProxy');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const logs = await xcertRevokeProxy.instance.methods.grantAbilities(bob, XcertRevokeProxyAbilities.EXECUTE).send({ from: owner });
  ctx.not(logs.events.SetAbilities, undefined);

  const bobHasAbilityToExecute = await xcertRevokeProxy.instance.methods.isAble(bob, XcertRevokeProxyAbilities.EXECUTE).call();
  ctx.is(bobHasAbilityToExecute, true);
});

spec.test('removes authorized address', async (ctx) => {
  const xcertRevokeProxy = ctx.get('xcertRevokeProxy');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  await xcertRevokeProxy.instance.methods.grantAbilities(bob, XcertRevokeProxyAbilities.EXECUTE).send({ from: owner });
  const logs = await xcertRevokeProxy.instance.methods.revokeAbilities(bob, XcertRevokeProxyAbilities.EXECUTE).send({ from: owner });
  ctx.not(logs.events.SetAbilities, undefined);

  const bobHasAbilityToExecute = await xcertRevokeProxy.instance.methods.isAble(bob, XcertRevokeProxyAbilities.EXECUTE).call();
  ctx.is(bobHasAbilityToExecute, false);
});

spec.test('revokes an Xcert', async (ctx) => {
  const xcertRevokeProxy = ctx.get('xcertRevokeProxy');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const jane = ctx.get('jane');
  const imprint = '0x16ba121a04d5ad3b885f09af5c6c08b68766ce43d990f8420dc97f6ff485cb37';

  await xcertRevokeProxy.instance.methods.grantAbilities(bob, XcertRevokeProxyAbilities.EXECUTE).send({ from: owner });

  const cat = await ctx.deploy({
    src: '@0xcert/ethereum-xcert-contracts/build/xcert-mock.json',
    contract: 'XcertMock',
    args: ['cat', 'CAT', 'https://0xcert.org/', '.json', '0xa65de9e6', ['0x20c5429b']],
  });

  await cat.instance.methods.grantAbilities(xcertRevokeProxy.receipt._address, XcertAbilities.REVOKE_ASSET).send({ from: owner });
  await cat.instance.methods.create(jane, 1, imprint).send({ from: owner });
  const cat1owner = await cat.instance.methods.ownerOf(1).call();
  ctx.is(cat1owner, jane);
  await xcertRevokeProxy.instance.methods.revoke(cat.receipt._address, 1).send({ from: bob });

  await ctx.reverts(() => cat.instance.methods.ownerOf(1).call());
});

spec.test('fails if update is triggered by an unauthorized address', async (ctx) => {
  const xcertRevokeProxy = ctx.get('xcertRevokeProxy');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const jane = ctx.get('jane');
  const imprint = '0x16ba121a04d5ad3b885f09af5c6c08b68766ce43d990f8420dc97f6ff485cb37';

  const cat = await ctx.deploy({
    src: '@0xcert/ethereum-xcert-contracts/build/xcert-mock.json',
    contract: 'XcertMock',
    args: ['cat', 'CAT', 'https://0xcert.org/', '.json', '0xa65de9e6', ['0x20c5429b']],
  });

  await cat.instance.methods.grantAbilities(xcertRevokeProxy.receipt._address, XcertAbilities.REVOKE_ASSET).send({ from: owner });
  await cat.instance.methods.create(jane, 1, imprint);
  await ctx.reverts(() => xcertRevokeProxy.instance.methods.revoke(cat.receipt._address, 1).send({ from: bob }), '017001');
});

export default spec;
