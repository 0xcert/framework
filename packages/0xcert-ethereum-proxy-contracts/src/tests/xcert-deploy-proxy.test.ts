import { bigNumberify } from '@0xcert/ethereum-utils';
import { XcertAbilities } from '@0xcert/ethereum-xcert-contracts/src/core/types';
import { Spec } from '@specron/spec';
import { XcertCreateProxyAbilities } from '../core/types';

/**
 * Spec context interfaces.
 */

interface Data {
  xcertDeployProxy?: any;
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
  const xcertDeployProxy = await ctx.deploy({
    src: './build/xcert-deploy-proxy.json',
    contract: 'XcertDeployProxy',
  });
  ctx.set('xcertDeployProxy', xcertDeployProxy);
});

spec.test('adds authorized address', async (ctx) => {
  const xcertDeployProxy = ctx.get('xcertDeployProxy');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const logs = await xcertDeployProxy.instance.methods.grantAbilities(bob, XcertCreateProxyAbilities.EXECUTE).send({ from: owner });
  ctx.not(logs.events.SetAbilities, undefined);

  const bobHasAbilityToExecute = await xcertDeployProxy.instance.methods.isAble(bob, XcertCreateProxyAbilities.EXECUTE).call();
  ctx.is(bobHasAbilityToExecute, true);
});

spec.test('removes authorized address', async (ctx) => {
  const xcertDeployProxy = ctx.get('xcertDeployProxy');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  await xcertDeployProxy.instance.methods.grantAbilities(bob, XcertCreateProxyAbilities.EXECUTE).send({ from: owner });
  const logs = await xcertDeployProxy.instance.methods.revokeAbilities(bob, XcertCreateProxyAbilities.EXECUTE).send({ from: owner });
  ctx.not(logs.events.SetAbilities, undefined);

  const bobHasAbilityToExecute = await xcertDeployProxy.instance.methods.isAble(bob, XcertCreateProxyAbilities.EXECUTE).call();
  ctx.is(bobHasAbilityToExecute, false);
});

spec.test('deploys an Xcert', async (ctx) => {
  const xcertDeployProxy = ctx.get('xcertDeployProxy');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const accounts = await ctx.web3.eth.getAccounts();

  await xcertDeployProxy.instance.methods.grantAbilities(bob, XcertCreateProxyAbilities.EXECUTE).send({ from: owner });

  await ctx.notThrows(() => xcertDeployProxy.instance.methods.deploy(
    'Foo',
    'F',
    'uri prefix',
    'uri postfix',
    '0x9c22ff5f21f0b81b113e63f7db6da94fedef11b2119b4088b89664fb9a3cb658',
    ['0x9d118770', '0xbda0e852', '0xbedb86fb', '0x20c5429b'],
    [accounts[2], accounts[3], accounts[4], accounts[5], accounts[6], accounts[7]],
  ).send({ from: bob }));
});

export default spec;
