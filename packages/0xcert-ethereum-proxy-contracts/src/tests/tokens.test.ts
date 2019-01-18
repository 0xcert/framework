import { Spec } from '@specron/spec';

/**
 * Spec context interfaces.
 */

interface Data {
  tokenProxy?: any;
  owner?: string;
  bob?: string;
  jane?: string;
}

const spec = new Spec<Data>();

spec.beforeEach(async (ctx) => {
  const accounts = await ctx.web3.eth.getAccounts();
  ctx.set('owner', accounts[0]);
  ctx.set('bob', accounts[1]);
  ctx.set('jane', accounts[2]);
});

spec.beforeEach(async (ctx) => {
  const tokenProxy = await ctx.deploy({
    src: './build/token-transfer-proxy.json',
    contract: 'TokenTransferProxy'
  });
  ctx.set('tokenProxy', tokenProxy);
});

spec.test('adds authorized address', async (ctx) => {
  const tokenProxy = ctx.get('tokenProxy');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const logs = await tokenProxy.instance.methods.assignAbilities(bob, 2).send({ from: owner });
  ctx.not(logs.events.AssignAbilities, undefined);

  const bobHasAbility1 = await tokenProxy.instance.methods.isAble(bob, 2).call();
  ctx.is(bobHasAbility1, true);
});

spec.test('removes authorized address', async (ctx) => {
  const tokenProxy = ctx.get('tokenProxy');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  await tokenProxy.instance.methods.assignAbilities(bob, 2).send({from: owner});
  const logs = await tokenProxy.instance.methods.revokeAbilities(bob, 2).send({ from: owner });
  ctx.not(logs.events.RevokeAbilities, undefined);

  const bobHasAbility1 = await tokenProxy.instance.methods.isAble(bob, 2).call();
  ctx.is(bobHasAbility1, false);
});

spec.test('transfers tokens', async (ctx) => {
  const tokenProxy = ctx.get('tokenProxy');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const jane = ctx.get('jane');

  await tokenProxy.instance.methods.assignAbilities(bob, 2).send({ from: owner });

  const token = await ctx.deploy({ 
    src: '@0xcert/ethereum-erc20-contracts/build/token-mock.json',
    contract: 'TokenMock',
    args: ['ERC20', 'ERC', 18, '300000000000000000000000000'],
  });

  await token.instance.methods.approve(tokenProxy.receipt._address, 1000).send({ from: owner });
  await tokenProxy.instance.methods.execute(token.receipt._address, owner, jane, 1000).send({ from: bob });

  const balance = await token.instance.methods.balanceOf(jane).call();
  ctx.is(balance, "1000");
});

spec.test('fails if transfer is triggered by an unauthorized address', async (ctx) => {
  const tokenProxy = ctx.get('tokenProxy');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const jane = ctx.get('jane');

  const token = await ctx.deploy({ 
    src: '@0xcert/ethereum-erc20-contracts/build/token-mock.json',
    contract: 'TokenMock',
    args: ['ERC20', 'ERC', 18, '300000000000000000000000000'],
  });

  await token.instance.methods.approve(tokenProxy.receipt._address, 1000).send({ from: owner });
  await ctx.reverts(() => tokenProxy.instance.methods.execute(token.receipt._address, owner, jane, 1000).send({ from: bob }), '017001');
});

export default spec;