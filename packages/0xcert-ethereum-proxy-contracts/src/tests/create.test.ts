import { bigNumberify } from '@0xcert/ethereum-utils';
import { XcertAbilities } from '@0xcert/ethereum-xcert-contracts/src/core/types';
import { Spec } from '@specron/spec';
import { XcertCreateProxyAbilities } from '../core/types';

/**
 * Spec context interfaces.
 */

interface Data {
  xcertProxy?: any;
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
  const xcertProxy = await ctx.deploy({
    src: './build/xcert-create-proxy.json',
    contract: 'XcertCreateProxy',
  });
  ctx.set('xcertProxy', xcertProxy);
});

spec.test('adds authorized address', async (ctx) => {
  const xcertProxy = ctx.get('xcertProxy');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const logs = await xcertProxy.instance.methods.grantAbilities(bob, XcertCreateProxyAbilities.EXECUTE).send({ from: owner });
  ctx.not(logs.events.GrantAbilities, undefined);

  const bobHasAbilityToExecute = await xcertProxy.instance.methods.isAble(bob, XcertCreateProxyAbilities.EXECUTE).call();
  ctx.is(bobHasAbilityToExecute, true);
});

spec.test('removes authorized address', async (ctx) => {
  const xcertProxy = ctx.get('xcertProxy');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  await xcertProxy.instance.methods.grantAbilities(bob, XcertCreateProxyAbilities.EXECUTE).send({ from: owner });
  const logs = await xcertProxy.instance.methods.revokeAbilities(bob, XcertCreateProxyAbilities.EXECUTE).send({ from: owner });
  ctx.not(logs.events.RevokeAbilities, undefined);

  const bobHasAbilityToExecute = await xcertProxy.instance.methods.isAble(bob, XcertCreateProxyAbilities.EXECUTE).call();
  ctx.is(bobHasAbilityToExecute, false);
});

spec.test('creates an Xcert', async (ctx) => {
  const xcertProxy = ctx.get('xcertProxy');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const jane = ctx.get('jane');

  await xcertProxy.instance.methods.grantAbilities(bob, XcertCreateProxyAbilities.EXECUTE).send({ from: owner });

  const cat = await ctx.deploy({
    src: '@0xcert/ethereum-xcert-contracts/build/xcert-mock.json',
    contract: 'XcertMock',
    args: ['cat', 'CAT', 'http://0xcert.org/', '0xa65de9e6', []],
  });

  await cat.instance.methods.grantAbilities(xcertProxy.receipt._address, XcertAbilities.CREATE_ASSET).send({ from: owner });
  await xcertProxy.instance.methods.create(cat.receipt._address, jane, 1, '0x0').send({ from: bob });

  const newOwner = await cat.instance.methods.ownerOf(1).call();
  ctx.is(newOwner, jane);
});

spec.test('creates an Xcert high ID', async (ctx) => {
  const xcertProxy = ctx.get('xcertProxy');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const jane = ctx.get('jane');

  await xcertProxy.instance.methods.grantAbilities(bob, XcertCreateProxyAbilities.EXECUTE).send({ from: owner });

  const cat = await ctx.deploy({
    src: '@0xcert/ethereum-xcert-contracts/build/xcert-mock.json',
    contract: 'XcertMock',
    args: ['cat', 'CAT', 'http://0xcert.org/', '0xa65de9e6', []],
  });

  await cat.instance.methods.grantAbilities(xcertProxy.receipt._address, XcertAbilities.CREATE_ASSET).send({ from: owner });
  await xcertProxy.instance.methods.create(cat.receipt._address, jane, bigNumberify('0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFE'), '0x0').send({ from: bob });

  const newOwner = await cat.instance.methods.ownerOf(bigNumberify('0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFE')).call();
  ctx.is(newOwner, jane);
});

spec.test('fails if create is triggered by an unauthorized address', async (ctx) => {
  const xcertProxy = ctx.get('xcertProxy');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const jane = ctx.get('jane');

  const cat = await ctx.deploy({
    src: '@0xcert/ethereum-xcert-contracts/build/xcert-mock.json',
    contract: 'XcertMock',
    args: ['cat', 'CAT', 'http://0xcert.org/', '0xa65de9e6', []],
  });

  await cat.instance.methods.grantAbilities(xcertProxy.receipt._address, XcertAbilities.CREATE_ASSET).send({ from: owner });
  await ctx.reverts(() => xcertProxy.instance.methods.create(cat.receipt._address, jane, 1, '0x0').send({ from: bob }), '017001');
});

export default spec;
