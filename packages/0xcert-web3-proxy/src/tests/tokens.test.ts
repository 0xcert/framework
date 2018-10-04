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
  const logs = await tokenProxy.instance.methods.addAuthorizedAddress(bob).send({ from: owner });
  ctx.not(logs.events.LogAuthorizedAddressAdded, undefined);

  const authorizedAddresses = await tokenProxy.instance.methods.getAuthorizedAddresses().call();
  ctx.is(authorizedAddresses[0], bob);
});

spec.test('fails when trying to add an already authorized address', async (ctx) => {
  const tokenProxy = ctx.get('tokenProxy');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  await tokenProxy.instance.methods.addAuthorizedAddress(bob).send({from: owner});
  await ctx.reverts(() => tokenProxy.instance.methods.addAuthorizedAddress(bob).send({ from: owner }), '012001');
});

spec.test('removes authorized address', async (ctx) => {
  const tokenProxy = ctx.get('tokenProxy');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  await tokenProxy.instance.methods.addAuthorizedAddress(bob).send({from: owner});
  const logs = await tokenProxy.instance.methods.removeAuthorizedAddress(bob).send({ from: owner });
  ctx.not(logs.events.LogAuthorizedAddressRemoved, undefined);

  const authorizedAddresses = await tokenProxy.instance.methods.getAuthorizedAddresses().call();
  ctx.is(authorizedAddresses.length, 0);
});

spec.test('fails when trying to remove an already unauthorized address', async (ctx) => {
  const tokenProxy = ctx.get('tokenProxy');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  await ctx.reverts(() => tokenProxy.instance.methods.removeAuthorizedAddress(bob).send({ from: owner }), '012002');
});

spec.test('transfers tokens', async (ctx) => {
  const tokenProxy = ctx.get('tokenProxy');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const jane = ctx.get('jane');

  await tokenProxy.instance.methods.addAuthorizedAddress(bob).send({ from: owner });

  const token = await ctx.deploy({ 
    src: '@0xcert/web3-erc20/build/token-mock.json',
    contract: 'TokenMock'
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
    src: '@0xcert/web3-erc20/build/token-mock.json',
    contract: 'TokenMock'
  });

  await token.instance.methods.approve(tokenProxy.receipt._address, 1000).send({ from: owner });
  await ctx.reverts(() => tokenProxy.instance.methods.execute(token.receipt._address, owner, jane, 1000).send({ from: bob }), '012002');
});

export default spec;