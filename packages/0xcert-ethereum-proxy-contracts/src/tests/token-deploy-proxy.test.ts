import { bigNumberify } from '@0xcert/ethereum-utils';
import { XcertAbilities } from '@0xcert/ethereum-xcert-contracts/src/core/types';
import { Spec } from '@specron/spec';
import { XcertCreateProxyAbilities } from '../core/types';

/**
 * Spec context interfaces.
 */

interface Data {
  tokenDeployProxy?: any;
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
  const tokenDeployProxy = await ctx.deploy({
    src: './build/token-deploy-proxy.json',
    contract: 'TokenDeployProxy',
  });
  ctx.set('tokenDeployProxy', tokenDeployProxy);
});

spec.test('adds authorized address', async (ctx) => {
  const tokenDeployProxy = ctx.get('tokenDeployProxy');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const logs = await tokenDeployProxy.instance.methods.grantAbilities(bob, XcertCreateProxyAbilities.EXECUTE).send({ from: owner });
  ctx.not(logs.events.SetAbilities, undefined);

  const bobHasAbilityToExecute = await tokenDeployProxy.instance.methods.isAble(bob, XcertCreateProxyAbilities.EXECUTE).call();
  ctx.is(bobHasAbilityToExecute, true);
});

spec.test('removes authorized address', async (ctx) => {
  const tokenDeployProxy = ctx.get('tokenDeployProxy');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  await tokenDeployProxy.instance.methods.grantAbilities(bob, XcertCreateProxyAbilities.EXECUTE).send({ from: owner });
  const logs = await tokenDeployProxy.instance.methods.revokeAbilities(bob, XcertCreateProxyAbilities.EXECUTE).send({ from: owner });
  ctx.not(logs.events.SetAbilities, undefined);

  const bobHasAbilityToExecute = await tokenDeployProxy.instance.methods.isAble(bob, XcertCreateProxyAbilities.EXECUTE).call();
  ctx.is(bobHasAbilityToExecute, false);
});

spec.test('deploys a Token', async (ctx) => {
  const tokenDeployProxy = ctx.get('tokenDeployProxy');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const accounts = await ctx.web3.eth.getAccounts();

  await tokenDeployProxy.instance.methods.grantAbilities(bob, XcertCreateProxyAbilities.EXECUTE).send({ from: owner });

  await ctx.notThrows(() => tokenDeployProxy.instance.methods.deploy(
    'Foo',
    'F',
    '50000000000000000000000',
    '18',
    accounts[3],
  ).send({ from: bob }));
});

export default spec;
