import { Spec } from '@specron/spec';
import { XcertDeployGateway } from '../../core/types';

interface Data {
  xcertDeployGateway?: any;
  jane?: string;
  sara?: string;
  owner?: string;
}

const spec = new Spec<Data>();

spec.before(async (ctx) => {
  const accounts = await ctx.web3.eth.getAccounts();
  ctx.set('owner', accounts[0]);
  ctx.set('jane', accounts[1]);
  ctx.set('sara', accounts[2]);
});

spec.beforeEach(async (ctx) => {
  const accounts = await ctx.web3.eth.getAccounts();
  const xcertDeployGateway = await ctx.deploy({
    src: './build/xcert-deploy-gateway.json',
    contract: 'XcertDeployGateway',
    args: [
      accounts[0],
      accounts[1],
      accounts[2],
      accounts[3],
      accounts[4],
      accounts[5],
      accounts[6],
    ],
  });
  ctx.set('xcertDeployGateway', xcertDeployGateway);
});

spec.test('Sets new deploy proxy', async (ctx) => {
  const owner = ctx.get('owner');
  const jane = ctx.get('jane');
  const xcertDeployGateway = ctx.get('xcertDeployGateway');

  await xcertDeployGateway.instance.methods.grantAbilities(owner, XcertDeployGateway.SET_PROXY).send({ from: owner });
  const logs = await xcertDeployGateway.instance.methods.setDeployProxy(jane).send({ from: owner });
  ctx.not(logs.events.ProxyChange, undefined);
  const deployProxy = await xcertDeployGateway.instance.methods.xcertDeployProxy().call();
  ctx.is(deployProxy, jane);
});

spec.test('Fails setting new deploy proxy without permission', async (ctx) => {
  const owner = ctx.get('owner');
  const jane = ctx.get('jane');
  const xcertDeployGateway = ctx.get('xcertDeployGateway');

  await ctx.reverts(() => xcertDeployGateway.instance.methods.setDeployProxy(jane).send({ from: owner }), '017001');
});

export default spec;
