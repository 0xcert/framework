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
  const logs = await tokenProxy.methods.addAuthorizedAddress(bob).send({from: owner});
  ctx.not(logs.events.LogAuthorizedAddressAdded, undefined);

  const authorizedAddresses = await tokenProxy.methods.getAuthorizedAddresses().call();
  ctx.is(authorizedAddresses[0], bob);
});

spec.test('fails when trying to add an already authorized address', async (ctx) => {
  const tokenProxy = ctx.get('tokenProxy');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  await tokenProxy.methods.addAuthorizedAddress(bob).send({from: owner});
  await ctx.reverts(() => tokenProxy.methods.addAuthorizedAddress(bob).send({from: owner}));
});

spec.test('removes authorized address', async (ctx) => {
  const tokenProxy = ctx.get('tokenProxy');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  await tokenProxy.methods.addAuthorizedAddress(bob).send({from: owner});
  const logs = await tokenProxy.methods.removeAuthorizedAddress(bob).send({from: owner});
  ctx.not(logs.events.LogAuthorizedAddressRemoved, undefined);

  const authorizedAddresses = await tokenProxy.methods.getAuthorizedAddresses().call();
  ctx.is(authorizedAddresses.length, 0);
});

spec.test('fails when trying to remove an already unauthorized address', async (ctx) => {
  const tokenProxy = ctx.get('tokenProxy');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  await ctx.reverts(() => tokenProxy.methods.removeAuthorizedAddress(bob).send({from: owner}));
});

spec.test('transfers tokens', async (ctx) => {
  const tokenProxy = ctx.get('tokenProxy');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const jane = ctx.get('jane');

  await tokenProxy.methods.addAuthorizedAddress(bob).send({from: owner});

  const token = await ctx.deploy({ 
    src: './node_modules/@0xcert/ethereum-erc20/build/contracts/TokenMock.json'
  });

  await token.methods.approve(tokenProxy._address, 1000).send({from: owner});
  await tokenProxy.methods.transferFrom(token._address, owner, jane, 1000).send({from: bob,  gas: 4000000});

  const balance = await token.methods.balanceOf(jane).call();
  ctx.is(balance, "1000");
});

spec.test('fails if transfer is triggered by an unauthorized address', async (ctx) => {
  const tokenProxy = ctx.get('tokenProxy');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const jane = ctx.get('jane');

  const token = await ctx.deploy({ 
    src: './node_modules/@0xcert/ethereum-erc20/build/contracts/TokenMock.json'
  });

  await token.methods.approve(tokenProxy._address, 1000).send({from: owner});
  await ctx.reverts(() => tokenProxy.methods.transferFrom(token._address, owner, jane, 1000).send({from: bob,  gas: 4000000}));
});

export default spec;