import { Spec } from '@specron/spec';

/**
 * Spec context interfaces.
 */

interface Data {
  tokenDeployProxy?: any;
  owner?: string;
  bob?: string;
  jane?: string;
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

spec.test('deploys a Token', async (ctx) => {
  const tokenDeployProxy = ctx.get('tokenDeployProxy');
  const bob = ctx.get('bob');
  const accounts = await ctx.web3.eth.getAccounts();

  await ctx.notThrows(() => tokenDeployProxy.instance.methods.deploy(
    'Foo',
    'F',
    '50000000000000000000000',
    '18',
    accounts[3],
  ).send({ from: bob }));
});

export default spec;
