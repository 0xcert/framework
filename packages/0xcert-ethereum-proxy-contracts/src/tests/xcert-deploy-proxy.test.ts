import { Spec } from '@specron/spec';

/**
 * Spec context interfaces.
 */

interface Data {
  xcertDeployProxy?: any;
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
  const xcertDeployProxy = await ctx.deploy({
    src: './build/xcert-deploy-proxy.json',
    contract: 'XcertDeployProxy',
  });
  ctx.set('xcertDeployProxy', xcertDeployProxy);
});

spec.test('deploys an Xcert', async (ctx) => {
  const xcertDeployProxy = ctx.get('xcertDeployProxy');
  const bob = ctx.get('bob');
  const accounts = await ctx.web3.eth.getAccounts();

  await ctx.notThrows(() => xcertDeployProxy.instance.methods.deploy(
    'Foo',
    'F',
    'uri prefix',
    'uri postfix',
    '0x9c22ff5f21f0b81b113e63f7db6da94fedef11b2119b4088b89664fb9a3cb658',
    ['0x9d118770', '0x0d04c3b8', '0xbedb86fb', '0x20c5429b'],
    [accounts[2], accounts[3], accounts[4], accounts[5], accounts[6], accounts[7]],
  ).send({ from: bob }));
});

export default spec;
