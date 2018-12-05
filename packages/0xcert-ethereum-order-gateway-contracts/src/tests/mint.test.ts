import { Spec } from '@specron/spec';
import * as common from './helpers/common';

/**
 * Test definition.
 * 
 * ERC20: ZXC, BNB, OMG, BAT, GNT
 * ERC721: Cat, Dog, Fox, Bee, Ant, Ape, Pig
 */


/**
 * Spec context interfaces.
 */

interface Data {
  orderGateway?: any;
  tokenProxy?: any;
  nftProxy?: any;
  mintProxy?: any;
  cat?: any;
  dog?: any;
  fox?: any;
  bee?: any;
  owner?: string;
  bob?: string;
  jane?: string;
  sara?: string;
  zxc?: any;
  gnt?: any;
  bnb?: any;
  omg?: any;
  id1?: string;
  id2?: string;
  id3?: string;
  imprint1?: string;
  imprint2?: string;
  imprint3?: string;
}


/**
 * Spec stack instances.
 */

const spec = new Spec<Data>();
const perform = new Spec<Data>();
const cancel = new Spec<Data>();

export default spec;

spec.beforeEach(async (ctx) => {
  const accounts = await ctx.web3.eth.getAccounts();
  ctx.set('owner', accounts[0]);
  ctx.set('bob', accounts[1]);
  ctx.set('jane', accounts[2]);
  ctx.set('sara', accounts[3]);
});


spec.beforeEach(async (ctx) => {
  ctx.set('id1', '1');
  ctx.set('id2', '2');
  ctx.set('id3', '3');
  ctx.set('imprint1', '0x1e205550c221490347e5e2393a02e94d284bbe9903f023ba098355b8d75974c8');
  ctx.set('imprint2', '0x5e20552dc271490347e5e2391b02e94d684bbe9903f023fa098355bed7597434');
  ctx.set('imprint3', '0x53f0df2dc671410347e5eef91b02344d687bbe9903f456fa0983eebed7517521');
});


/**
 * Cat
 */
spec.beforeEach(async (ctx) => {
  const owner = ctx.get('owner');
  const cat = await ctx.deploy({ 
    src: '@0xcert/ethereum-xcert-contracts/build/xcert-mock.json',
    contract: 'XcertMock',
    args: ['cat', 'CAT', 'http://0xcert.org/', '0xa65de9e6'],
  });
  await cat.instance.methods.assignAbilities(owner, [5]).send();
  ctx.set('cat', cat);
});

/**
 * Dog
 * Jane owns: #1, #2, #3
 */
spec.beforeEach(async (ctx) => {
  const jane = ctx.get('jane');
  const owner = ctx.get('owner');
  const dog = await ctx.deploy({ 
    src: '@0xcert/ethereum-xcert-contracts/build/xcert-mock.json',
    contract: 'XcertMock',
    args: ['dog', 'DOG', 'http://0xcert.org/', '0xa65de9e6'],
  });
  await dog.instance.methods.assignAbilities(owner, [1]).send();
  await dog.instance.methods
    .mint(jane, 1, '0x0')
    .send({
      from: owner,
    });
  await dog.instance.methods
    .mint(jane, 2, '0x0')
    .send({
      from: owner,
    });
  await dog.instance.methods
    .mint(jane, 3, '0x0')
    .send({
      from: owner,
    });
  ctx.set('dog', dog);
});

/**
 * Fox
 * Jane owns: #1
 */
spec.beforeEach(async (ctx) => {
  const jane = ctx.get('jane');
  const owner = ctx.get('owner');
  const fox = await ctx.deploy({ 
    src: '@0xcert/ethereum-xcert-contracts/build/xcert-mock.json',
    contract: 'XcertMock',
    args: ['fox', 'FOX', 'http://0xcert.org/', '0xa65de9e6'],
  });
  await fox.instance.methods.assignAbilities(owner, [1]).send();
  await fox.instance.methods
  .mint(jane, 1, '0x0')
  .send({
    from: owner,
  });
  ctx.set('fox', fox);
});

/**
 * ZXC
 * Jane owns: all
 */
spec.beforeEach(async (ctx) => {
  const jane = ctx.get('jane');
  const zxc = await ctx.deploy({
    src: '@0xcert/ethereum-erc20-contracts/build/token-mock.json',
    contract: 'TokenMock',
    args: ['ERC20', 'ERC', 18, '300000000000000000000000000'],
    from: jane
  });
  ctx.set('zxc', zxc);
});

/**
 * BNB
 * Jane owns: all
 */
spec.beforeEach(async (ctx) => {
  const jane = ctx.get('jane');
  const bnb = await ctx.deploy({
    src: '@0xcert/ethereum-erc20-contracts/build/token-mock.json',
    contract: 'TokenMock',
    args: ['ERC20', 'ERC', 18, '300000000000000000000000000'],
    from: jane
  });
  ctx.set('bnb', bnb);
});

spec.beforeEach(async (ctx) => {
  const tokenProxy = await ctx.deploy({
    src: '@0xcert/ethereum-proxy-contracts/build/token-transfer-proxy.json',
    contract: 'TokenTransferProxy'
  });
  ctx.set('tokenProxy', tokenProxy);
});

spec.beforeEach(async (ctx) => {
  const nftProxy = await ctx.deploy({
    src: '@0xcert/ethereum-proxy-contracts/build/nftoken-transfer-proxy.json',
    contract: 'NFTokenTransferProxy',
  });
  ctx.set('nftProxy', nftProxy);
});

spec.beforeEach(async (ctx) => {
  const mintProxy = await ctx.deploy({
    src: '@0xcert/ethereum-proxy-contracts/build/xcert-mint-proxy.json',
    contract: 'XcertMintProxy',
  });
  ctx.set('mintProxy', mintProxy);
});

spec.beforeEach(async (ctx) => {
  const tokenProxy = ctx.get('tokenProxy');
  const nftProxy = ctx.get('nftProxy');
  const mintProxy = ctx.get('mintProxy');
  const owner = ctx.get('owner');
  const orderGateway = await ctx.deploy({
    src: './build/order-gateway.json',
    contract: 'OrderGateway',
  });
  await orderGateway.instance.methods.assignAbilities(owner, [1]).send();
  await orderGateway.instance.methods.setProxy(0, tokenProxy.receipt._address).send({ from: owner });
  await orderGateway.instance.methods.setProxy(1, nftProxy.receipt._address).send({ from: owner });
  await orderGateway.instance.methods.setProxy(2, mintProxy.receipt._address).send({ from: owner });
  ctx.set('orderGateway', orderGateway);
});

spec.beforeEach(async (ctx) => {
  const tokenProxy = ctx.get('tokenProxy');
  const nftProxy = ctx.get('nftProxy');
  const orderGateway = ctx.get('orderGateway');
  const owner = ctx.get('owner');
  const mintProxy = ctx.get('mintProxy');
  await tokenProxy.instance.methods.assignAbilities(orderGateway.receipt._address, [1]).send({ from: owner });
  await nftProxy.instance.methods.assignAbilities(orderGateway.receipt._address, [1]).send({ from: owner });
  await mintProxy.instance.methods.assignAbilities(orderGateway.receipt._address, [1]).send({ from: owner });
});
/**
 * Perform mint.
 */

spec.spec('perform an atomic mint', perform);

perform.test('Cat #1', async (ctx) => {
  const orderGateway = ctx.get('orderGateway');
  const mintProxy = ctx.get('mintProxy');
  const jane = ctx.get('jane');
  const owner = ctx.get('owner');
  const cat = ctx.get('cat');
  const id = ctx.get('id1');
  const imprint = ctx.get('imprint1');

  const actions = [
    {
      kind: 0,
      proxy: 2,
      token: cat.receipt._address,
      param1: imprint,
      to: jane,
      value: id,
    }
  ];
  const orderData = {
    from: owner,
    to: jane,
    actions,
    seed: common.getCurrentTime(),
    expirationTimestamp: common.getCurrentTime() + 3600,
  }
  const mintTuple = ctx.tuple(orderData);

  const claim = await orderGateway.instance.methods.getOrderDataClaim(mintTuple).call();

  const signature = await ctx.web3.eth.sign(claim, owner);
  const signatureData = {
    r: signature.substr(0, 66),
    s: `0x${signature.substr(66, 64)}`,
    v: parseInt(`0x${signature.substr(130, 2)}`) + 27,
    kind: 0,
  };
  const signatureDataTuple = ctx.tuple(signatureData);

  await cat.instance.methods.assignAbilities(mintProxy.receipt._address, [1]).send({ from: owner });
  const logs = await orderGateway.instance.methods.perform(mintTuple, signatureDataTuple).send({ from: jane });
  ctx.not(logs.events.Perform, undefined);

  const cat1Owner = await cat.instance.methods.ownerOf(1).call();
  ctx.is(cat1Owner, jane);
});

perform.test('5000 ZXC => Cat #1', async (ctx) => {
  const orderGateway = ctx.get('orderGateway');
  const zxc = ctx.get('zxc');
  const mintProxy = ctx.get('mintProxy');
  const tokenProxy = ctx.get('tokenProxy');
  const jane = ctx.get('jane');
  const owner = ctx.get('owner');
  const cat = ctx.get('cat');
  const id = ctx.get('id1');
  const imprint = ctx.get('imprint1');

  const actions = [
    {
      kind: 0,
      proxy: 2,
      token: cat.receipt._address,
      param1: imprint,
      to: jane,
      value: id,
    },
    {
      kind: 1,
      proxy: 0,
      token: zxc.receipt._address,
      param1: jane,
      to: owner,
      value: 5000,
    },
  ];
  const orderData = {
    from: owner,
    to: jane,
    actions,
    seed: common.getCurrentTime(),
    expirationTimestamp: common.getCurrentTime() + 3600,
  }
  const mintTuple = ctx.tuple(orderData);

  const claim = await orderGateway.instance.methods.getOrderDataClaim(mintTuple).call();

  const signature = await ctx.web3.eth.sign(claim, owner);
  const signatureData = {
    r: signature.substr(0, 66),
    s: `0x${signature.substr(66, 64)}`,
    v: parseInt(`0x${signature.substr(130, 2)}`) + 27,
    kind: 0,
  };
  const signatureDataTuple = ctx.tuple(signatureData);

  await cat.instance.methods.assignAbilities(mintProxy.receipt._address, [1]).send({ from: owner });
  await zxc.instance.methods.approve(tokenProxy.receipt._address, 5000).send({ from: jane });
  const logs = await orderGateway.instance.methods.perform(mintTuple, signatureDataTuple).send({ from: jane });
  ctx.not(logs.events.Perform, undefined);

  const cat1Owner = await cat.instance.methods.ownerOf(1).call();
  ctx.is(cat1Owner, jane);

  const ownerZxcBalance = await zxc.instance.methods.balanceOf(owner).call();
  ctx.is(ownerZxcBalance, "5000");
});

perform.test('5000 ZXC, 100 BNB => Cat #1', async (ctx) => {
  const orderGateway = ctx.get('orderGateway');
  const zxc = ctx.get('zxc');
  const bnb = ctx.get('bnb');
  const mintProxy = ctx.get('mintProxy');
  const tokenProxy = ctx.get('tokenProxy');
  const jane = ctx.get('jane');
  const sara = ctx.get('sara');
  const owner = ctx.get('owner');
  const cat = ctx.get('cat');
  const id = ctx.get('id1');
  const imprint = ctx.get('imprint1');

  const actions = [
    {
      kind: 0,
      proxy: 2,
      token: cat.receipt._address,
      param1: imprint,
      to: jane,
      value: id,
    },
    {
      kind: 1,
      proxy: 0,
      token: bnb.receipt._address,
      param1: jane,
      to: sara,
      value: 100,
    },
    {
      kind: 1,
      proxy: 0,
      token: zxc.receipt._address,
      param1: jane,
      to: owner,
      amount: 5000,
    },
  ];
  const orderData = {
    from: owner,
    to: jane,
    actions,
    seed: common.getCurrentTime(),
    expirationTimestamp: common.getCurrentTime() + 3600,
  }
  const mintTuple = ctx.tuple(orderData);

  const claim = await orderGateway.instance.methods.getOrderDataClaim(mintTuple).call();

  const signature = await ctx.web3.eth.sign(claim, owner);
  const signatureData = {
    r: signature.substr(0, 66),
    s: `0x${signature.substr(66, 64)}`,
    v: parseInt(`0x${signature.substr(130, 2)}`) + 27,
    kind: 0,
  };
  const signatureDataTuple = ctx.tuple(signatureData);

  await cat.instance.methods.assignAbilities(mintProxy.receipt._address, [1]).send({ from: owner });
  await zxc.instance.methods.approve(tokenProxy.receipt._address, 5000).send({ from: jane });
  await bnb.instance.methods.approve(tokenProxy.receipt._address, 100).send({ from: jane });
  const logs = await orderGateway.instance.methods.perform(mintTuple, signatureDataTuple).send({ from: jane });
  ctx.not(logs.events.Perform, undefined);

  const cat1Owner = await cat.instance.methods.ownerOf(1).call();
  ctx.is(cat1Owner, jane);

  const ownerZxcBalance = await zxc.instance.methods.balanceOf(owner).call();
  ctx.is(ownerZxcBalance, "5000");

  const saraBnbBalance = await bnb.instance.methods.balanceOf(sara).call();
  ctx.is(saraBnbBalance, "100");
});

perform.test('Dog #1, Dog #2, Dog #3 => Cat #1', async (ctx) => {
  const orderGateway = ctx.get('orderGateway');
  const mintProxy = ctx.get('mintProxy');
  const nftProxy = ctx.get('nftProxy');
  const jane = ctx.get('jane');
  const owner = ctx.get('owner');
  const cat = ctx.get('cat');
  const dog = ctx.get('dog');
  const id = ctx.get('id1');
  const imprint = ctx.get('imprint1');

  const actions = [
    {
      kind: 0,
      proxy: 2,
      token: cat.receipt._address,
      param1: imprint,
      to: jane,
      value: id,
    },
    { 
      kind: 1,
      proxy: 1,
      token: dog.receipt._address,
      param1: jane,
      to: owner,
      value: 1,
    },
    { 
      kind: 1,
      proxy: 1,
      token: dog.receipt._address,
      param1: jane,
      to: owner,
      value: 2,
    },
    { 
      kind: 1,
      proxy: 1,
      token: dog.receipt._address,
      param1: jane,
      to: owner,
      value: 3,
    },
  ];
  const orderData = {
    from: owner,
    to: jane,
    actions,
    seed: common.getCurrentTime(),
    expirationTimestamp: common.getCurrentTime() + 3600,
  }
  const mintTuple = ctx.tuple(orderData);

  const claim = await orderGateway.instance.methods.getOrderDataClaim(mintTuple).call();

  const signature = await ctx.web3.eth.sign(claim, owner);
  const signatureData = {
    r: signature.substr(0, 66),
    s: `0x${signature.substr(66, 64)}`,
    v: parseInt(`0x${signature.substr(130, 2)}`) + 27,
    kind: 0,
  };
  const signatureDataTuple = ctx.tuple(signatureData);

  await cat.instance.methods.assignAbilities(mintProxy.receipt._address, [1]).send({ from: owner });
  await dog.instance.methods.approve(nftProxy.receipt._address, 1).send({ from: jane });
  await dog.instance.methods.approve(nftProxy.receipt._address, 2).send({ from: jane });
  await dog.instance.methods.approve(nftProxy.receipt._address, 3).send({ from: jane });
  const logs = await orderGateway.instance.methods.perform(mintTuple, signatureDataTuple).send({ from: jane });
  ctx.not(logs.events.Perform, undefined);

  const cat1Owner = await cat.instance.methods.ownerOf(1).call();
  ctx.is(cat1Owner, jane);

  const dog1Owner = await dog.instance.methods.ownerOf(1).call();
  ctx.is(dog1Owner, owner);

  const dog2Owner = await dog.instance.methods.ownerOf(2).call();
  ctx.is(dog2Owner, owner);
  
  const dog3Owner = await dog.instance.methods.ownerOf(3).call();
  ctx.is(dog3Owner, owner);
});

perform.test('Dog #1, Dog #2, Dog #3 => Cat #1 Cat #2 Cat #3', async (ctx) => {
  const orderGateway = ctx.get('orderGateway');
  const mintProxy = ctx.get('mintProxy');
  const nftProxy = ctx.get('nftProxy');
  const jane = ctx.get('jane');
  const sara = ctx.get('sara');
  const owner = ctx.get('owner');
  const cat = ctx.get('cat');
  const dog = ctx.get('dog');
  const id = ctx.get('id1');
  const id2 = ctx.get('id2');
  const id3 = ctx.get('id3');
  const imprint = ctx.get('imprint1');
  const imprint2 = ctx.get('imprint2');
  const imprint3 = ctx.get('imprint3');

  const actions = [
    {
      kind: 0,
      proxy: 2,
      token: cat.receipt._address,
      param1: imprint,
      to: jane,
      value: id,
    },
    {
      kind: 0,
      proxy: 2,
      token: cat.receipt._address,
      param1: imprint2,
      to: jane,
      value: id2,
    },
    {
      kind: 0,
      proxy: 2,
      token: cat.receipt._address,
      param1: imprint3,
      to: sara,
      value: id3,
    },
    { 
      kind: 1,
      proxy: 1,
      token: dog.receipt._address,
      param1: jane,
      to: owner,
      value: 1,
    },
    { 
      kind: 1,
      proxy: 1,
      token: dog.receipt._address,
      param1: jane,
      to: owner,
      value: 2,
    },
    { 
      kind: 1,
      proxy: 1,
      token: dog.receipt._address,
      param1: jane,
      to: owner,
      value: 3,
    },
  ];
  const orderData = {
    from: owner,
    to: jane,
    actions,
    seed: common.getCurrentTime(),
    expirationTimestamp: common.getCurrentTime() + 3600,
  }
  const mintTuple = ctx.tuple(orderData);

  const claim = await orderGateway.instance.methods.getOrderDataClaim(mintTuple).call();

  const signature = await ctx.web3.eth.sign(claim, owner);
  const signatureData = {
    r: signature.substr(0, 66),
    s: `0x${signature.substr(66, 64)}`,
    v: parseInt(`0x${signature.substr(130, 2)}`) + 27,
    kind: 0,
  };
  const signatureDataTuple = ctx.tuple(signatureData);

  await cat.instance.methods.assignAbilities(mintProxy.receipt._address, [1]).send({ from: owner });
  await dog.instance.methods.approve(nftProxy.receipt._address, 1).send({ from: jane });
  await dog.instance.methods.approve(nftProxy.receipt._address, 2).send({ from: jane });
  await dog.instance.methods.approve(nftProxy.receipt._address, 3).send({ from: jane });
  const logs = await orderGateway.instance.methods.perform(mintTuple, signatureDataTuple).send({ from: jane });
  ctx.not(logs.events.Perform, undefined);

  const cat1Owner = await cat.instance.methods.ownerOf(1).call();
  ctx.is(cat1Owner, jane);

  const cat2Owner = await cat.instance.methods.ownerOf(2).call();
  ctx.is(cat2Owner, jane);

  const cat3Owner = await cat.instance.methods.ownerOf(3).call();
  ctx.is(cat3Owner, sara);

  const dog1Owner = await dog.instance.methods.ownerOf(1).call();
  ctx.is(dog1Owner, owner);

  const dog2Owner = await dog.instance.methods.ownerOf(2).call();
  ctx.is(dog2Owner, owner);
  
  const dog3Owner = await dog.instance.methods.ownerOf(3).call();
  ctx.is(dog3Owner, owner);
});

perform.test('Dog #1, Dog #2, Dog #3, 10 ZXC => Cat #1', async (ctx) => {
  const orderGateway = ctx.get('orderGateway');
  const mintProxy = ctx.get('mintProxy');
  const nftProxy = ctx.get('nftProxy');
  const tokenProxy = ctx.get('tokenProxy');
  const zxc = ctx.get('zxc');
  const jane = ctx.get('jane');
  const owner = ctx.get('owner');
  const cat = ctx.get('cat');
  const dog = ctx.get('dog');
  const id = ctx.get('id1');
  const imprint = ctx.get('imprint1');

  const actions = [
    {
      kind: 0,
      proxy: 2,
      token: cat.receipt._address,
      param1: imprint,
      to: jane,
      value: id,
    },
    { 
      kind: 1,
      proxy: 1,
      token: dog.receipt._address,
      param1: jane,
      to: owner,
      value: 1,
    },
    { 
      kind: 1,
      proxy: 1,
      token: dog.receipt._address,
      param1: jane,
      to: owner,
      value: 2,
    },
    { 
      kind: 1,
      proxy: 1,
      token: dog.receipt._address,
      param1: jane,
      to: owner,
      value: 3,
    },
    { 
      kind: 1,
      proxy: 0,
      token: zxc.receipt._address,
      param1: jane,
      to: owner,
      value: 10,
    },
  ];
  const orderData = {
    from: owner,
    to: jane,
    actions,
    seed: common.getCurrentTime(),
    expirationTimestamp: common.getCurrentTime() + 3600,
  }
  const mintTuple = ctx.tuple(orderData);

  const claim = await orderGateway.instance.methods.getOrderDataClaim(mintTuple).call();

  const signature = await ctx.web3.eth.sign(claim, owner);
  const signatureData = {
    r: signature.substr(0, 66),
    s: `0x${signature.substr(66, 64)}`,
    v: parseInt(`0x${signature.substr(130, 2)}`) + 27,
    kind: 0,
  };
  const signatureDataTuple = ctx.tuple(signatureData);

  await cat.instance.methods.assignAbilities(mintProxy.receipt._address, [1]).send({ from: owner });
  await dog.instance.methods.approve(nftProxy.receipt._address, 1).send({ from: jane });
  await dog.instance.methods.approve(nftProxy.receipt._address, 2).send({ from: jane });
  await dog.instance.methods.approve(nftProxy.receipt._address, 3).send({ from: jane });
  await zxc.instance.methods.approve(tokenProxy.receipt._address, 5000).send({ from: jane });
  
  const logs = await orderGateway.instance.methods.perform(mintTuple, signatureDataTuple).send({ from: jane });
  ctx.not(logs.events.Perform, undefined);

  const cat1Owner = await cat.instance.methods.ownerOf(1).call();
  ctx.is(cat1Owner, jane);

  const dog1Owner = await dog.instance.methods.ownerOf(1).call();
  ctx.is(dog1Owner, owner);

  const dog2Owner = await dog.instance.methods.ownerOf(2).call();
  ctx.is(dog2Owner, owner);
  
  const dog3Owner = await dog.instance.methods.ownerOf(3).call();
  ctx.is(dog3Owner, owner);

  const ownerZxcBalance = await zxc.instance.methods.balanceOf(owner).call();
  ctx.is(ownerZxcBalance, "10");
});

perform.test('Dog #1, Fox #1, 10 ZXC => Cat #1', async (ctx) => {
  const orderGateway = ctx.get('orderGateway');
  const mintProxy = ctx.get('mintProxy');
  const nftProxy = ctx.get('nftProxy');
  const tokenProxy = ctx.get('tokenProxy');
  const zxc = ctx.get('zxc');
  const jane = ctx.get('jane');
  const owner = ctx.get('owner');
  const cat = ctx.get('cat');
  const dog = ctx.get('dog');
  const fox = ctx.get('fox');
  const id = ctx.get('id1');
  const imprint = ctx.get('imprint1');

  const actions = [
    {
      kind: 0,
      proxy: 2,
      token: cat.receipt._address,
      param1: imprint,
      to: jane,
      value: id,
    },
    { 
      kind: 1,
      proxy: 1,
      token: dog.receipt._address,
      param1: jane,
      to: owner,
      value: 1,
    },
    { 
      kind: 1,
      proxy: 1,
      token: fox.receipt._address,
      param1: jane,
      to: owner,
      value: 1,
    },
    { 
      kind: 1,
      proxy: 0,
      token: zxc.receipt._address,
      param1: jane,
      to: owner,
      value: 10,
    },
  ];
  const orderData = {
    from: owner,
    to: jane,
    actions,
    seed: common.getCurrentTime(),
    expirationTimestamp: common.getCurrentTime() + 3600,
  }
  const mintTuple = ctx.tuple(orderData);

  const claim = await orderGateway.instance.methods.getOrderDataClaim(mintTuple).call();

  const signature = await ctx.web3.eth.sign(claim, owner);
  const signatureData = {
    r: signature.substr(0, 66),
    s: `0x${signature.substr(66, 64)}`,
    v: parseInt(`0x${signature.substr(130, 2)}`) + 27,
    kind: 0,
  };
  const signatureDataTuple = ctx.tuple(signatureData);

  await cat.instance.methods.assignAbilities(mintProxy.receipt._address, [1]).send({ from: owner });
  await dog.instance.methods.approve(nftProxy.receipt._address, 1).send({ from: jane });
  await fox.instance.methods.approve(nftProxy.receipt._address, 1).send({ from: jane });
  await zxc.instance.methods.approve(tokenProxy.receipt._address, 5000).send({ from: jane });
  
  const logs = await orderGateway.instance.methods.perform(mintTuple, signatureDataTuple).send({ from: jane });
  ctx.not(logs.events.Perform, undefined);

  const cat1Owner = await cat.instance.methods.ownerOf(1).call();
  ctx.is(cat1Owner, jane);

  const dog1Owner = await dog.instance.methods.ownerOf(1).call();
  ctx.is(dog1Owner, owner);

  const fox1Owner = await fox.instance.methods.ownerOf(1).call();
  ctx.is(fox1Owner, owner);

  const ownerZxcBalance = await zxc.instance.methods.balanceOf(owner).call();
  ctx.is(ownerZxcBalance, "10");
});

perform.test('fails if msg.sender is not the receiver', async (ctx) => {
  const orderGateway = ctx.get('orderGateway');
  const zxc = ctx.get('zxc');
  const mintProxy = ctx.get('mintProxy');
  const tokenProxy = ctx.get('tokenProxy');
  const jane = ctx.get('jane');
  const sara = ctx.get('sara');
  const owner = ctx.get('owner');
  const cat = ctx.get('cat');
  const id = ctx.get('id1');
  const imprint = ctx.get('imprint1');

  const actions = [
    {
      kind: 0,
      proxy: 2,
      token: cat.receipt._address,
      param1: imprint,
      to: jane,
      value: id,
    },
    { 
      kind: 1,
      proxy: 0,
      token: zxc.receipt._address,
      param1: jane,
      to: owner,
      value: 5000,
    },
  ];
  const orderData = {
    from: owner,
    to: jane,
    actions,
    seed: common.getCurrentTime(),
    expirationTimestamp: common.getCurrentTime() + 3600,
  }
  const mintTuple = ctx.tuple(orderData);

  const claim = await orderGateway.instance.methods.getOrderDataClaim(mintTuple).call();

  const signature = await ctx.web3.eth.sign(claim, owner);
  const signatureData = {
    r: signature.substr(0, 66),
    s: `0x${signature.substr(66, 64)}`,
    v: parseInt(`0x${signature.substr(130, 2)}`) + 27,
    kind: 0,
  };
  const signatureDataTuple = ctx.tuple(signatureData);

  await cat.instance.methods.assignAbilities(mintProxy.receipt._address, [1]).send({ from: owner });
  await zxc.instance.methods.approve(tokenProxy.receipt._address, 5000).send({ from: jane });
  await ctx.reverts(() => orderGateway.instance.methods.perform(mintTuple, signatureDataTuple).send({ from: sara }), '015003');
});

perform.test('fails when trying to perform already performed mint', async (ctx) => {
  const orderGateway = ctx.get('orderGateway');
  const zxc = ctx.get('zxc');
  const mintProxy = ctx.get('mintProxy');
  const tokenProxy = ctx.get('tokenProxy');
  const jane = ctx.get('jane');
  const owner = ctx.get('owner');
  const cat = ctx.get('cat');
  const id = ctx.get('id1');
  const imprint = ctx.get('imprint1');

  const actions = [
    {
      kind: 0,
      proxy: 2,
      token: cat.receipt._address,
      param1: imprint,
      to: jane,
      value: id,
    },
    { 
      kind: 1,
      proxy: 0,
      token: zxc.receipt._address,
      param1: jane,
      to: owner,
      value: 5000,
    },
  ];
  const orderData = {
    from: owner,
    to: jane,
    actions,
    seed: common.getCurrentTime(),
    expirationTimestamp: common.getCurrentTime() + 3600,
  }
  const mintTuple = ctx.tuple(orderData);

  const claim = await orderGateway.instance.methods.getOrderDataClaim(mintTuple).call();

  const signature = await ctx.web3.eth.sign(claim, owner);
  const signatureData = {
    r: signature.substr(0, 66),
    s: `0x${signature.substr(66, 64)}`,
    v: parseInt(`0x${signature.substr(130, 2)}`) + 27,
    kind: 0,
  };
  const signatureDataTuple = ctx.tuple(signatureData);

  await cat.instance.methods.assignAbilities(mintProxy.receipt._address, [1]).send({ from: owner });
  await zxc.instance.methods.approve(tokenProxy.receipt._address, 5000).send({ from: jane });
  await orderGateway.instance.methods.perform(mintTuple, signatureDataTuple).send({ from: jane });
  await ctx.reverts(() => orderGateway.instance.methods.perform(mintTuple, signatureDataTuple).send({ from: jane }), '015008');
});

perform.test('fails when approved token value is not sufficient', async (ctx) => {
  const orderGateway = ctx.get('orderGateway');
  const zxc = ctx.get('zxc');
  const mintProxy = ctx.get('mintProxy');
  const tokenProxy = ctx.get('tokenProxy');
  const jane = ctx.get('jane');
  const owner = ctx.get('owner');
  const cat = ctx.get('cat');
  const id = ctx.get('id1');
  const imprint = ctx.get('imprint1');

  const actions = [
    {
      kind: 0,
      proxy: 2,
      token: cat.receipt._address,
      param1: imprint,
      to: jane,
      value: id,
    },
    { 
      kind: 1,
      proxy: 0,
      token: zxc.receipt._address,
      param1: jane,
      to: owner,
      value: 5000,
    },
  ];
  const orderData = {
    from: owner,
    to: jane,
    actions,
    seed: common.getCurrentTime(),
    expirationTimestamp: common.getCurrentTime() + 3600,
  }
  const mintTuple = ctx.tuple(orderData);

  const claim = await orderGateway.instance.methods.getOrderDataClaim(mintTuple).call();

  const signature = await ctx.web3.eth.sign(claim, owner);
  const signatureData = {
    r: signature.substr(0, 66),
    s: `0x${signature.substr(66, 64)}`,
    v: parseInt(`0x${signature.substr(130, 2)}`) + 27,
    kind: 0,
  };
  const signatureDataTuple = ctx.tuple(signatureData);

  await cat.instance.methods.assignAbilities(mintProxy.receipt._address, [1]).send({ from: owner });
  await zxc.instance.methods.approve(tokenProxy.receipt._address, 4999).send({ from: jane });
  await ctx.reverts(() => orderGateway.instance.methods.perform(mintTuple, signatureDataTuple).send({ from: jane }), '001003');
});

perform.test('fails when proxy does not have the mint rights', async (ctx) => {
  const orderGateway = ctx.get('orderGateway');
  const zxc = ctx.get('zxc');
  const tokenProxy = ctx.get('tokenProxy');
  const jane = ctx.get('jane');
  const owner = ctx.get('owner');
  const cat = ctx.get('cat');
  const id = ctx.get('id1');
  const imprint = ctx.get('imprint1');

  const actions = [
    {
      kind: 0,
      proxy: 2,
      token: cat.receipt._address,
      param1: imprint,
      to: jane,
      value: id,
    },
    { 
      kind: 1,
      proxy: 0,
      token: zxc.receipt._address,
      param1: jane,
      to: owner,
      value: 5000,
    },
  ];
  const orderData = {
    from: owner,
    to: jane,
    actions,
    seed: common.getCurrentTime(),
    expirationTimestamp: common.getCurrentTime() + 3600,
  }
  const mintTuple = ctx.tuple(orderData);

  const claim = await orderGateway.instance.methods.getOrderDataClaim(mintTuple).call();

  const signature = await ctx.web3.eth.sign(claim, owner);
  const signatureData = {
    r: signature.substr(0, 66),
    s: `0x${signature.substr(66, 64)}`,
    v: parseInt(`0x${signature.substr(130, 2)}`) + 27,
    kind: 0,
  };
  const signatureDataTuple = ctx.tuple(signatureData);

  await zxc.instance.methods.approve(tokenProxy.receipt._address, 5000).send({ from: jane });
  await ctx.reverts(() => orderGateway.instance.methods.perform(mintTuple, signatureDataTuple).send({ from: jane }), '017001');
});

perform.test('fails if current time is after expirationTimestamp', async (ctx) => {
  const orderGateway = ctx.get('orderGateway');
  const zxc = ctx.get('zxc');
  const mintProxy = ctx.get('mintProxy');
  const tokenProxy = ctx.get('tokenProxy');
  const jane = ctx.get('jane');
  const owner = ctx.get('owner');
  const cat = ctx.get('cat');
  const id = ctx.get('id1');
  const imprint = ctx.get('imprint1');

  const actions = [
    {
      kind: 0,
      proxy: 2,
      token: cat.receipt._address,
      param1: imprint,
      to: jane,
      value: id,
    },
    { 
      kind: 1,
      proxy: 0,
      token: zxc.receipt._address,
      param1: jane,
      to: owner,
      value: 5000,
    },
  ];
  const orderData = {
    from: owner,
    to: jane,
    actions,
    seed: common.getCurrentTime(),
    expirationTimestamp: common.getCurrentTime() - 1000,
  }
  const mintTuple = ctx.tuple(orderData);

  const claim = await orderGateway.instance.methods.getOrderDataClaim(mintTuple).call();

  const signature = await ctx.web3.eth.sign(claim, owner);
  const signatureData = {
    r: signature.substr(0, 66),
    s: `0x${signature.substr(66, 64)}`,
    v: parseInt(`0x${signature.substr(130, 2)}`) + 27,
    kind: 0,
  };
  const signatureDataTuple = ctx.tuple(signatureData);

  await cat.instance.methods.assignAbilities(mintProxy.receipt._address, [1]).send({ from: owner });
  await zxc.instance.methods.approve(tokenProxy.receipt._address, 5000).send({ from: jane });
  await ctx.reverts(() => orderGateway.instance.methods.perform(mintTuple, signatureDataTuple).send({ from: jane }), '015005');
});


/**
 * Cancel mint.
 */

spec.spec('cancel an atomic mint', cancel);

cancel.test('succeeds', async (ctx) => {
  const orderGateway = ctx.get('orderGateway');
  const zxc = ctx.get('zxc');
  const mintProxy = ctx.get('mintProxy');
  const tokenProxy = ctx.get('tokenProxy');
  const jane = ctx.get('jane');
  const owner = ctx.get('owner');
  const cat = ctx.get('cat');
  const id = ctx.get('id1');
  const imprint = ctx.get('imprint1');

  const actions = [
    {
      kind: 0,
      proxy: 2,
      token: cat.receipt._address,
      param1: imprint,
      to: jane,
      value: id,
    },
    { 
      kind: 1,
      proxy: 0,
      token: zxc.receipt._address,
      param1: jane,
      to: owner,
      value: 5000,
    },
  ];
  const orderData = {
    from: owner,
    to: jane,
    actions,
    seed: common.getCurrentTime(),
    expirationTimestamp: common.getCurrentTime() + 3600,
  }
  const mintTuple = ctx.tuple(orderData);

  const claim = await orderGateway.instance.methods.getOrderDataClaim(mintTuple).call();

  const signature = await ctx.web3.eth.sign(claim, owner);
  const signatureData = {
    r: signature.substr(0, 66),
    s: `0x${signature.substr(66, 64)}`,
    v: parseInt(`0x${signature.substr(130, 2)}`) + 27,
    kind: 0,
  };
  const signatureDataTuple = ctx.tuple(signatureData);

  await cat.instance.methods.assignAbilities(mintProxy.receipt._address, [1]).send({ from: owner });
  await zxc.instance.methods.approve(tokenProxy.receipt._address, 5000).send({ from: jane });
  const logs = await orderGateway.instance.methods.cancel(mintTuple).send({ from: owner });
  ctx.not(logs.events.Cancel, undefined);
  await ctx.reverts(() => orderGateway.instance.methods.perform(mintTuple, signatureDataTuple).send({ from: jane }), '015007');
});

cancel.test('fails when a third party tries to cancel it', async (ctx) => {
  const orderGateway = ctx.get('orderGateway');
  const zxc = ctx.get('zxc');
  const jane = ctx.get('jane');
  const owner = ctx.get('owner');
  const cat = ctx.get('cat');
  const id = ctx.get('id1');
  const imprint = ctx.get('imprint1');

  const actions = [
    {
      kind: 0,
      proxy: 2,
      token: cat.receipt._address,
      param1: imprint,
      to: jane,
      value: id,
    },
    { 
      kind: 1,
      proxy: 0,
      token: zxc.receipt._address,
      param1: jane,
      to: owner,
      value: 5000,
    },
  ];
  const orderData = {
    from: owner,
    to: jane,
    actions,
    seed: common.getCurrentTime(),
    expirationTimestamp: common.getCurrentTime() + 3600,
  }
  const mintTuple = ctx.tuple(orderData);

  await ctx.reverts(() => orderGateway.instance.methods.cancel(mintTuple).send({ from: jane }), '015009');
});

cancel.test('fails when trying to cancel an already performed mint', async (ctx) => {
  const orderGateway = ctx.get('orderGateway');
  const zxc = ctx.get('zxc');
  const mintProxy = ctx.get('mintProxy');
  const tokenProxy = ctx.get('tokenProxy');
  const jane = ctx.get('jane');
  const owner = ctx.get('owner');
  const cat = ctx.get('cat');
  const id = ctx.get('id1');
  const imprint = ctx.get('imprint1');

  const actions = [
    {
      kind: 0,
      proxy: 2,
      token: cat.receipt._address,
      param1: imprint,
      to: jane,
      value: id,
    },
    { 
      kind: 1,
      proxy: 0,
      token: zxc.receipt._address,
      param1: jane,
      to: owner,
      value: 5000,
    },
  ];
  const orderData = {
    from: owner,
    to: jane,
    actions,
    seed: common.getCurrentTime(),
    expirationTimestamp: common.getCurrentTime() + 3600,
  }
  const mintTuple = ctx.tuple(orderData);

  const claim = await orderGateway.instance.methods.getOrderDataClaim(mintTuple).call();

  const signature = await ctx.web3.eth.sign(claim, owner);
  const signatureData = {
    r: signature.substr(0, 66),
    s: `0x${signature.substr(66, 64)}`,
    v: parseInt(`0x${signature.substr(130, 2)}`) + 27,
    kind: 0,
  };
  const signatureDataTuple = ctx.tuple(signatureData);

  await cat.instance.methods.assignAbilities(mintProxy.receipt._address, [1]).send({ from: owner });
  await zxc.instance.methods.approve(tokenProxy.receipt._address, 5000).send({ from: jane });
  await orderGateway.instance.methods.perform(mintTuple, signatureDataTuple).send({ from: jane });
  await ctx.reverts(() => orderGateway.instance.methods.cancel(mintTuple).send({ from: owner }), '015008');
});