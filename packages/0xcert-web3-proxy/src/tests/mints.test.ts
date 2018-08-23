import { Spec } from '@specron/spec';
import * as web3Util from 'web3-utils';

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

spec.beforeEach(async (ctx) => {
  const accounts = await ctx.web3.eth.getAccounts();
  ctx.set('owner', accounts[0]);
  ctx.set('bob', accounts[1]);
  ctx.set('jane', accounts[2]);
});

spec.beforeEach(async (ctx) => {
  const xcertProxy = await ctx.deploy({
    src: './build/xcert-mint-proxy.json',
    contract: 'XcertMintProxy'
  });
  ctx.set('xcertProxy', xcertProxy);
});

spec.test('adds authorized address', async (ctx) => {
  const xcertProxy = ctx.get('xcertProxy');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const logs = await xcertProxy.methods.addAuthorizedAddress(bob).send({from: owner});
  ctx.not(logs.events.LogAuthorizedAddressAdded, undefined);

  const authorizedAddresses = await xcertProxy.methods.getAuthorizedAddresses().call();
  ctx.is(authorizedAddresses[0], bob);
});

spec.test('fails when trying to add an already authorized address', async (ctx) => {
  const xcertProxy = ctx.get('xcertProxy');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  await xcertProxy.methods.addAuthorizedAddress(bob).send({from: owner});
  await ctx.reverts(() => xcertProxy.methods.addAuthorizedAddress(bob).send({from: owner}));
});

spec.test('removes authorized address', async (ctx) => {
  const xcertProxy = ctx.get('xcertProxy');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  await xcertProxy.methods.addAuthorizedAddress(bob).send({from: owner});
  const logs = await xcertProxy.methods.removeAuthorizedAddress(bob).send({from: owner});
  ctx.not(logs.events.LogAuthorizedAddressRemoved, undefined);

  const authorizedAddresses = await xcertProxy.methods.getAuthorizedAddresses().call();
  ctx.is(authorizedAddresses.length, 0);
});

spec.test('fails when trying to remove an already unauthorized address', async (ctx) => {
  const xcertProxy = ctx.get('xcertProxy');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  await ctx.reverts(() => xcertProxy.methods.removeAuthorizedAddress(bob).send({from: owner}));
});

spec.test('mints an Xcert', async (ctx) => {
  const xcertProxy = ctx.get('xcertProxy');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const jane = ctx.get('jane');
  const config = [web3Util.padLeft(web3Util.numberToHex(1821195657), 64)];

  await xcertProxy.methods.addAuthorizedAddress(bob).send({from: owner});

  const cat = await ctx.deploy({ 
    src: '@0xcert/ethereum-xcert/build/contracts/XcertMock.json',
    args: ['cat', 'CAT','0xa65de9e6'],
  });

  await cat.methods.setAuthorizedAddress(xcertProxy._address, true).send({from: owner});
  await xcertProxy.methods.mint(cat._address, jane, 1, 'http://0xcert.org', 'proof', config, []).send({from: bob,  gas: 4000000});

  const newOwner = await cat.methods.ownerOf(1).call();
  ctx.is(newOwner, jane);
});

spec.test('fails if mint is triggered by an unauthorized address', async (ctx) => {
  const xcertProxy = ctx.get('xcertProxy');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const jane = ctx.get('jane');
  const config = [web3Util.padLeft(web3Util.numberToHex(1821195657), 64)];

  const cat = await ctx.deploy({ 
    src: '@0xcert/ethereum-xcert/build/contracts/XcertMock.json',
    args: ['cat', 'CAT','0xa65de9e6'],
  });

  await cat.methods.setAuthorizedAddress(xcertProxy._address, true).send({from: owner});
  await ctx.reverts(() => xcertProxy.methods.mint(cat._address, jane, 1, 'http://0xcert.org', 'proof', config, []).send({from: bob,  gas: 4000000}));
});

export default spec;