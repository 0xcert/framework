import { Spec } from '@specron/spec';
import { XcertDeployGateway } from '../../core/types';

interface Data {
  tokenDeployGateway?: any;
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
  const tokenDeployGateway = await ctx.deploy({
    src: './build/token-deploy-gateway.json',
    contract: 'TokenDeployGateway',
    args: [
      accounts[0],
      accounts[1],
    ],
  });
  ctx.set('tokenDeployGateway', tokenDeployGateway);
});

spec.test('Sets new deploy proxy', async (ctx) => {
  const owner = ctx.get('owner');
  const jane = ctx.get('jane');
  const tokenDeployGateway = ctx.get('tokenDeployGateway');

  await tokenDeployGateway.instance.methods.grantAbilities(owner, XcertDeployGateway.SET_PROXY).send({ from: owner });
  const logs = await tokenDeployGateway.instance.methods.setDeployProxy(jane).send({ from: owner });
  ctx.not(logs.events.ProxyChange, undefined);
  const deployProxy = await tokenDeployGateway.instance.methods.tokenDeployProxy().call();
  ctx.is(deployProxy, jane);
});

spec.test('Fails setting new deploy proxy without permission', async (ctx) => {
  const owner = ctx.get('owner');
  const jane = ctx.get('jane');
  const tokenDeployGateway = ctx.get('tokenDeployGateway');

  await ctx.reverts(() => tokenDeployGateway.instance.methods.setDeployProxy(jane).send({ from: owner }), '017001');
});

export default spec;
