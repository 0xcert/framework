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
}

interface CancelData extends Data {
  signatureTuple?: any;
  dataTuple?: any;
}

/**
 * Spec stack instances.
 */

const spec = new Spec<Data>();
const erc721s = new Spec<Data>();
const erc20s = new Spec<Data>();
const erc721sErc20s = new Spec<Data>();
const perform = new Spec<Data>();
const cancel = new Spec<CancelData>();
const fail = new Spec<Data>();

export default spec;

spec.beforeEach(async (ctx) => {
  const accounts = await ctx.web3.eth.getAccounts();
  ctx.set('owner', accounts[0]);
  ctx.set('bob', accounts[1]);
  ctx.set('jane', accounts[2]);
  ctx.set('sara', accounts[3]);
});

/**
 * Cat
 * Jane owns: #1, #4
 * Bob owns: #2, #3
 */
spec.beforeEach(async (ctx) => {
  const cat = await ctx.deploy({ 
    src: '@0xcert/ethereum-erc721-contracts/build/nf-token-metadata-enumerable-mock.json',
    contract: 'NFTokenMetadataEnumerableMock',
    args: ['cat', 'CAT','http://0xcert.org/'],
  });
  await cat.instance.methods
    .mint(ctx.get('jane'), 1)
    .send({
      from: ctx.get('owner'),
      gas: 4000000,
    });
  await cat.instance.methods
    .mint(ctx.get('jane'), 4)
    .send({
      from: ctx.get('owner'),
      gas: 4000000,
    });
  await cat.instance.methods
    .mint(ctx.get('bob'), 2)
    .send({
      from: ctx.get('owner'),
      gas: 4000000,
    });
  await cat.instance.methods
    .mint(ctx.get('bob'), 3)
    .send({
      from: ctx.get('owner'),
      gas: 4000000,
    });
  ctx.set('cat', cat);
});

/**
 * Dog
 * Jane owns: #1
 */
spec.beforeEach(async (ctx) => {
  const dog = await ctx.deploy({ 
    src: '@0xcert/ethereum-erc721-contracts/build/nf-token-metadata-enumerable-mock.json',
    contract: 'NFTokenMetadataEnumerableMock',
    args: ['dog', 'DOG', 'http://0xcert.org/'],
  });
  await dog.instance.methods
    .mint(ctx.get('jane'), 1)
    .send({
      from: ctx.get('owner'),
      gas: 4000000,
    });
  ctx.set('dog', dog);
});

/**
 * Bee
 * Bob owns: #3
 */
spec.beforeEach(async (ctx) => {
  const bee = await ctx.deploy({ 
    src: '@0xcert/ethereum-erc721-contracts/build/nf-token-metadata-enumerable-mock.json',
    contract: 'NFTokenMetadataEnumerableMock',
    args: ['bee', 'BEE', 'http://0xcert.org/'],
  });
  await bee.instance.methods
    .mint(ctx.get('bob'), 3)
    .send({
      from: ctx.get('owner'),
      gas: 4000000,
    });
  ctx.set('bee', bee);
});

/**
 * Fox
 * Bob owns: #1
 */
spec.beforeEach(async (ctx) => {
  const fox = await ctx.deploy({ 
    src: '@0xcert/ethereum-erc721-contracts/build/nf-token-metadata-enumerable-mock.json',
    contract: 'NFTokenMetadataEnumerableMock',
    args: ['fox', 'FOX', 'http://0xcert.org/'],
  });
  await fox.instance.methods
    .mint(ctx.get('bob'), 1)
    .send({
      from: ctx.get('owner'),
      gas: 4000000,
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

/**
 * GNT
 * Bob owns: all
 */
spec.beforeEach(async (ctx) => {
  const bob = ctx.get('bob');
  const gnt = await ctx.deploy({
    src: '@0xcert/ethereum-erc20-contracts/build/token-mock.json',
    contract: 'TokenMock',
    args: ['ERC20', 'ERC', 18, '300000000000000000000000000'],
    from: bob
  });
  ctx.set('gnt', gnt);
});

/**
 * OMG
 * Bob owns: all
 */
spec.beforeEach(async (ctx) => {
  const bob = ctx.get('bob');
  const omg = await ctx.deploy({
    src: '@0xcert/ethereum-erc20-contracts/build/token-mock.json',
    contract: 'TokenMock',
    args: ['ERC20', 'ERC', 18, '300000000000000000000000000'],
    from: bob
  });
  ctx.set('omg', omg);
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
  const tokenProxy = ctx.get('tokenProxy');
  const nftProxy = ctx.get('nftProxy');
  const owner = ctx.get('owner');
  const orderGateway = await ctx.deploy({
    src: './build/order-gateway.json',
    contract: 'OrderGateway',
  });
  await orderGateway.instance.methods.assignAbilities(owner, [1]).send();
  await orderGateway.instance.methods.setProxy(0, tokenProxy.receipt._address).send({ from: owner });
  await orderGateway.instance.methods.setProxy(1, nftProxy.receipt._address).send({ from: owner });
  ctx.set('orderGateway', orderGateway);
});

spec.beforeEach(async (ctx) => {
  const tokenProxy = ctx.get('tokenProxy');
  const nftProxy = ctx.get('nftProxy');
  const orderGateway = ctx.get('orderGateway');
  const owner = ctx.get('owner');
  await tokenProxy.instance.methods.assignAbilities(orderGateway.receipt._address, [1]).send({ from: owner });
  await nftProxy.instance.methods.assignAbilities(orderGateway.receipt._address, [1]).send({ from: owner });
});

/**
 * Perform swap.
 */

spec.spec('perform an atomic swap', perform);

/**
 * ERC721s.
 */

perform.spec('between ERC721s', erc721s);

erc721s.test('Cat #1 <=> Cat #2', async (ctx) => {
  const orderGateway = ctx.get('orderGateway');
  const nftProxy = ctx.get('nftProxy');
  const jane = ctx.get('jane');
  const bob = ctx.get('bob');
  const cat = ctx.get('cat');

  const actions = [
    {
      kind: 1,
      proxy: 1,
      token: cat.receipt._address,
      param1: ctx.web3.utils.padLeft(jane, 64),
      to: bob,
      value: 1,
    },
    { 
      kind: 1,
      proxy: 1,
      token: cat.receipt._address,
      param1: ctx.web3.utils.padLeft(bob, 64),
      to: jane,
      value: 2,
    },
  ];

  const orderData = {
    maker: jane,
    taker: bob,
    actions,
    seed: common.getCurrentTime(), 
    expiration: common.getCurrentTime() + 600,
  };
  const orderDataTuple = ctx.tuple(orderData);
  const claim = await orderGateway.instance.methods.getOrderDataClaim(orderDataTuple).call();

  const signature = await ctx.web3.eth.sign(claim, jane);
  const signatureData = {
    r: signature.substr(0, 66),
    s: `0x${signature.substr(66, 64)}`,
    v: parseInt(`0x${signature.substr(130, 2)}`) + 27,
    kind: 0,
  };
  const signatureDataTuple = ctx.tuple(signatureData);

  await cat.instance.methods.approve(nftProxy.receipt._address, 1).send({ from: jane });
  await cat.instance.methods.approve(nftProxy.receipt._address, 2).send({ from: bob });
  const logs = await orderGateway.instance.methods.perform(orderDataTuple, signatureDataTuple).send({ from: bob });
  ctx.not(logs.events.Perform, undefined);

  const cat1Owner = await cat.instance.methods.ownerOf(1).call();
  const cat2Owner = await cat.instance.methods.ownerOf(2).call();
  ctx.is(cat1Owner, bob);
  ctx.is(cat2Owner, jane);
});

erc721s.test('Cat #1, Cat #4 <=> Cat #2', async (ctx) => {
  const orderGateway = ctx.get('orderGateway');
  const nftProxy = ctx.get('nftProxy');
  const jane = ctx.get('jane');
  const bob = ctx.get('bob');
  const cat = ctx.get('cat');

  const actions = [
    {
      kind: 1,
      proxy: 1,
      token: cat.receipt._address,
      from: ctx.web3.utils.padLeft(jane, 64),
      to: bob,
      value: 1,
    },
    {
      kind: 1,
      proxy: 1,
      token: cat.receipt._address,
      from: ctx.web3.utils.padLeft(jane, 64),
      to: bob,
      value: 4,
    }, 
    {
      kind: 1,
      proxy: 1,
      token: cat.receipt._address,
      from: ctx.web3.utils.padLeft(bob, 64),
      to: jane,
      value: 2,
    },
  ];
  const orderData = {
    maker: jane,
    taker: bob,
    actions,
    seed: common.getCurrentTime(), 
    expiration: common.getCurrentTime() + 600,
  };
  const orderDataTuple = ctx.tuple(orderData);
  const claim = await orderGateway.instance.methods.getOrderDataClaim(orderDataTuple).call();

  const signature = await ctx.web3.eth.sign(claim, jane);
  const signatureData = {
    r: signature.substr(0, 66),
    s: `0x${signature.substr(66, 64)}`,
    v: parseInt(`0x${signature.substr(130, 2)}`) + 27,
    kind: 0,
  };
  const signatureDataTuple = ctx.tuple(signatureData);

  await cat.instance.methods.approve(nftProxy.receipt._address, 1).send({ from: jane });
  await cat.instance.methods.approve(nftProxy.receipt._address, 4).send({ from: jane });
  await cat.instance.methods.approve(nftProxy.receipt._address, 2).send({ from: bob });
  const logs = await orderGateway.instance.methods.perform(orderDataTuple, signatureDataTuple).send({ from: bob });
  ctx.not(logs.events.Perform, undefined);

  const cat1Owner = await cat.instance.methods.ownerOf(1).call();
  const cat2Owner = await cat.instance.methods.ownerOf(2).call();
  const cat4Owner = await cat.instance.methods.ownerOf(4).call();
  ctx.is(cat1Owner, bob);
  ctx.is(cat2Owner, jane);
  ctx.is(cat4Owner, bob);
});

erc721s.test('Cat #1, Dog #1 <=> Fox #1, Bee #3', async (ctx) => {
  const orderGateway = ctx.get('orderGateway');
  const nftProxy = ctx.get('nftProxy');
  const jane = ctx.get('jane');
  const bob = ctx.get('bob');
  const cat = ctx.get('cat');
  const dog = ctx.get('dog');
  const fox = ctx.get('fox');
  const bee = ctx.get('bee');

  const actions = [
    {
      kind: 1,
      proxy: 1,
      token: cat.receipt._address,
      from: ctx.web3.utils.padLeft(jane, 64),
      to: bob,
      value: 1,
    },
    {
      kind: 1,
      proxy: 1,
      token: dog.receipt._address,
      from: ctx.web3.utils.padLeft(jane, 64),
      to: bob,
      value: 1,
    },
    {
      kind: 1,
      proxy: 1,
      token: fox.receipt._address,
      from: ctx.web3.utils.padLeft(bob, 64),
      to: jane,
      value: 1,
    },
    {
      kind: 1,
      proxy: 1,
      token: bee.receipt._address,
      from: ctx.web3.utils.padLeft(bob, 64),
      to: jane,
      value: 3,
    },
  ];
  const orderData = {
    maker: jane,
    taker: bob,
    actions,
    seed: common.getCurrentTime(), 
    expiration: common.getCurrentTime() + 600,
  };
  const orderDataTuple = ctx.tuple(orderData);
  const claim = await orderGateway.instance.methods.getOrderDataClaim(orderDataTuple).call();

  const signature = await ctx.web3.eth.sign(claim, jane);
  const signatureData = {
    r: signature.substr(0, 66),
    s: `0x${signature.substr(66, 64)}`,
    v: parseInt(`0x${signature.substr(130, 2)}`) + 27,
    kind: 0,
  };
  const signatureDataTuple = ctx.tuple(signatureData);

  await cat.instance.methods.approve(nftProxy.receipt._address, 1).send({ from: jane });
  await dog.instance.methods.approve(nftProxy.receipt._address, 1).send({ from: jane });
  await fox.instance.methods.approve(nftProxy.receipt._address, 1).send({ from: bob });
  await bee.instance.methods.approve(nftProxy.receipt._address, 3).send({ from: bob });
  const logs = await orderGateway.instance.methods.perform(orderDataTuple, signatureDataTuple).send({ from: bob, gas: 6000000 });
  ctx.not(logs.events.Perform, undefined);

  const cat1Owner = await cat.instance.methods.ownerOf(1).call();
  const dog1Owner = await dog.instance.methods.ownerOf(1).call();
  const fox1Owner = await fox.instance.methods.ownerOf(1).call();
  const bee3Owner = await bee.instance.methods.ownerOf(3).call();
  ctx.is(cat1Owner, bob);
  ctx.is(dog1Owner, bob);
  ctx.is(fox1Owner, jane);
  ctx.is(bee3Owner, jane);
});

/**
 * ERC20s.
 */

perform.spec('between ERC20s', erc20s);

erc20s.test('3000 ZXC <=> 50000 GNT', async (ctx) => {
  const orderGateway = ctx.get('orderGateway');
  const tokenProxy = ctx.get('tokenProxy');
  const jane = ctx.get('jane');
  const bob = ctx.get('bob');
  const zxc = ctx.get('zxc');
  const gnt = ctx.get('gnt');
  const zxcAmount = 3000;
  const gntAmount = 50000;

  const actions = [
    {
      kind: 1,
      proxy: 0,
      token: zxc.receipt._address,
      from: ctx.web3.utils.padLeft(jane, 64),
      to: bob,
      value: zxcAmount,
    },
    {
      kind: 1,
      proxy: 0,
      token: gnt.receipt._address,
      from: ctx.web3.utils.padLeft(bob, 64),
      to: jane,
      value: gntAmount,
    },
  ];
  const orderData = {
    maker: jane,
    taker: bob,
    actions,
    seed: common.getCurrentTime(), 
    expiration: common.getCurrentTime() + 600,
  };
  const orderDataTuple = ctx.tuple(orderData);
  const claim = await orderGateway.instance.methods.getOrderDataClaim(orderDataTuple).call();

  const signature = await ctx.web3.eth.sign(claim, jane);
  const signatureData = {
    r: signature.substr(0, 66),
    s: `0x${signature.substr(66, 64)}`,
    v: parseInt(`0x${signature.substr(130, 2)}`) + 27,
    kind: 0,
  };
  const signatureDataTuple = ctx.tuple(signatureData);

  await zxc.instance.methods.approve(tokenProxy.receipt._address, zxcAmount).send({ from: jane });
  await gnt.instance.methods.approve(tokenProxy.receipt._address, gntAmount).send({ from: bob });
  const logs = await orderGateway.instance.methods.perform(orderDataTuple, signatureDataTuple).send({from: bob});
  ctx.not(logs.events.Perform, undefined);

  const bobBalance = await zxc.instance.methods.balanceOf(bob).call();
  const janeBalance = await gnt.instance.methods.balanceOf(jane).call();
  ctx.is(bobBalance, zxcAmount.toString());
  ctx.is(janeBalance, gntAmount.toString());
});

erc20s.test('500 ZXC, 1 BNB <=> 30 GNT, 5 OMG', async (ctx) => {
  const orderGateway = ctx.get('orderGateway');
  const tokenProxy = ctx.get('tokenProxy');
  const jane = ctx.get('jane');
  const bob = ctx.get('bob');
  const zxc = ctx.get('zxc');
  const gnt = ctx.get('gnt');
  const bnb = ctx.get('bnb');
  const omg = ctx.get('omg');
  const zxcAmount = 500;
  const gntAmount = 30;
  const bnbAmount = 1;
  const omgAmount = 5;

  const actions = [
    {
      kind: 1,
      proxy: 0,
      token: zxc.receipt._address,
      from: ctx.web3.utils.padLeft(jane, 64),
      to: bob,
      value: zxcAmount,
    },
    {
      kind: 1,
      proxy: 0,
      token: bnb.receipt._address,
      from: ctx.web3.utils.padLeft(jane, 64),
      to: bob,
      value: bnbAmount,
    },
    {
      kind: 1,
      proxy: 0,
      token: gnt.receipt._address,
      from: ctx.web3.utils.padLeft(bob, 64),
      to: jane,
      value: gntAmount,
    },
    {
      kind: 1,
      proxy: 0,
      token: omg.receipt._address,
      from: ctx.web3.utils.padLeft(bob, 64),
      to: jane,
      value: omgAmount,
    },
  ];
  const orderData = {
    maker: jane,
    taker: bob,
    actions,
    seed: common.getCurrentTime(), 
    expiration: common.getCurrentTime() + 600,
  };
  const orderDataTuple = ctx.tuple(orderData);
  const claim = await orderGateway.instance.methods.getOrderDataClaim(orderDataTuple).call();

  const signature = await ctx.web3.eth.sign(claim, jane);
  const signatureData = {
    r: signature.substr(0, 66),
    s: `0x${signature.substr(66, 64)}`,
    v: parseInt(`0x${signature.substr(130, 2)}`) + 27,
    kind: 0,
  };
  const signatureDataTuple = ctx.tuple(signatureData);

  await zxc.instance.methods.approve(tokenProxy.receipt._address, zxcAmount).send({ from: jane });
  await bnb.instance.methods.approve(tokenProxy.receipt._address, bnbAmount).send({ from: jane });
  await gnt.instance.methods.approve(tokenProxy.receipt._address, gntAmount).send({ from: bob });
  await omg.instance.methods.approve(tokenProxy.receipt._address, omgAmount).send({ from: bob });
  const logs = await orderGateway.instance.methods.perform(orderDataTuple, signatureDataTuple).send({from: bob});
  ctx.not(logs.events.Perform, undefined);

  const bobZxcBalance = await zxc.instance.methods.balanceOf(bob).call();
  const bobBnbBalance = await bnb.instance.methods.balanceOf(bob).call();
  const janeGntBalance = await gnt.instance.methods.balanceOf(jane).call();
  const janeOmgBalance = await omg.instance.methods.balanceOf(jane).call();
  ctx.is(bobZxcBalance, zxcAmount.toString());
  ctx.is(bobBnbBalance, bnbAmount.toString());
  ctx.is(janeGntBalance, gntAmount.toString());
  ctx.is(janeOmgBalance, omgAmount.toString());
});

/**
 * ERC721s and ERC20s.
 */


perform.spec('between ERC721s and ERC20s', erc721sErc20s);

erc721sErc20s.test('Cat #1  <=>  5000 OMG', async (ctx) => {
  const orderGateway = ctx.get('orderGateway');
  const nftProxy = ctx.get('nftProxy');
  const tokenProxy = ctx.get('tokenProxy');
  const jane = ctx.get('jane');
  const bob = ctx.get('bob');
  const cat = ctx.get('cat');
  const omg = ctx.get('omg');
  const omgAmount = 5000;

  const actions = [
    {
      kind: 1,
      proxy: 1,
      token: cat.receipt._address,
      from: ctx.web3.utils.padLeft(jane, 64),
      to: bob,
      value: 1,
    },
    {
      kind: 1,
      proxy: 0,
      token: omg.receipt._address,
      from: ctx.web3.utils.padLeft(bob, 64),
      to: jane,
      value: omgAmount,
    },
  ];
  const orderData = {
    maker: jane,
    taker: bob,
    actions,
    seed: common.getCurrentTime(), 
    expiration: common.getCurrentTime() + 600,
  };
  const orderDataTuple = ctx.tuple(orderData);
  const claim = await orderGateway.instance.methods.getOrderDataClaim(orderDataTuple).call();

  const signature = await ctx.web3.eth.sign(claim, jane);
  const signatureData = {
    r: signature.substr(0, 66),
    s: `0x${signature.substr(66, 64)}`,
    v: parseInt(`0x${signature.substr(130, 2)}`) + 27,
    kind: 0,
  };
  const signatureDataTuple = ctx.tuple(signatureData);

  await cat.instance.methods.approve(nftProxy.receipt._address, 1).send({ from: jane });
  await omg.instance.methods.approve(tokenProxy.receipt._address, omgAmount).send({ from: bob });
  const logs = await orderGateway.instance.methods.perform(orderDataTuple, signatureDataTuple).send({ from: bob });
  ctx.not(logs.events.Perform, undefined);

  const cat1Owner = await cat.instance.methods.ownerOf(1).call();
  const janeOmgAmount = await omg.instance.methods.balanceOf(jane).call();
  ctx.is(cat1Owner, bob);
  ctx.is(janeOmgAmount, omgAmount.toString());
});

erc721sErc20s.test('Cat #1, Dog #1, 3 ZXC <=> Cat #3, Fox #1, 30 OMG, 5000 GNT', async (ctx) => {
  const orderGateway = ctx.get('orderGateway');
  const nftProxy = ctx.get('nftProxy');
  const tokenProxy = ctx.get('tokenProxy');
  const jane = ctx.get('jane');
  const bob = ctx.get('bob');
  const cat = ctx.get('cat');
  const dog = ctx.get('dog');
  const fox = ctx.get('fox');
  const omg = ctx.get('omg');
  const zxc = ctx.get('zxc');
  const gnt = ctx.get('gnt');
  const omgAmount = 30;
  const zxcAmount = 3;
  const gntAmount = 5000;

  const actions = [
    {
      kind: 1,
      proxy: 1,
      token: cat.receipt._address,
      from: ctx.web3.utils.padLeft(jane, 64),
      to: bob,
      value: 1,
    },
    {
      kind: 1,
      proxy: 1,
      token: dog.receipt._address,
      from: ctx.web3.utils.padLeft(jane, 64),
      to: bob,
      value: 1,
    },
    {
      kind: 1,
      proxy: 0,
      token: zxc.receipt._address,
      from: ctx.web3.utils.padLeft(jane, 64),
      to: bob,
      value: zxcAmount,
    },
    {
      kind: 1,
      proxy: 1,
      token: cat.receipt._address,
      from: ctx.web3.utils.padLeft(bob, 64),
      to: jane,
      value: 3,
    },
    {
      kind: 1,
      proxy: 1,
      token: fox.receipt._address,
      from: ctx.web3.utils.padLeft(bob, 64),
      to: jane,
      value: 1,
    },
    {
      kind: 1,
      proxy: 0,
      token: omg.receipt._address,
      from: ctx.web3.utils.padLeft(bob, 64),
      to: jane,
      value: omgAmount,
    },
    {
      kind: 1,
      proxy: 0,
      token: gnt.receipt._address,
      from: ctx.web3.utils.padLeft(bob, 64),
      to: jane,
      value: gntAmount,
    },
  ];
  const orderData = {
    maker: jane,
    taker: bob,
    actions,
    seed: common.getCurrentTime(), 
    expiration: common.getCurrentTime() + 600,
  };
  const orderDataTuple = ctx.tuple(orderData);
  const claim = await orderGateway.instance.methods.getOrderDataClaim(orderDataTuple).call();

  const signature = await ctx.web3.eth.sign(claim, jane);
  const signatureData = {
    r: signature.substr(0, 66),
    s: `0x${signature.substr(66, 64)}`,
    v: parseInt(`0x${signature.substr(130, 2)}`) + 27,
    kind: 0,
  };
  const signatureDataTuple = ctx.tuple(signatureData);

  await cat.instance.methods.approve(nftProxy.receipt._address, 1).send({ from: jane });
  await dog.instance.methods.approve(nftProxy.receipt._address, 1).send({ from: jane });
  await zxc.instance.methods.approve(tokenProxy.receipt._address, zxcAmount).send({ from: jane });
  await cat.instance.methods.approve(nftProxy.receipt._address, 3).send({ from: bob });
  await fox.instance.methods.approve(nftProxy.receipt._address, 1).send({ from: bob });
  await omg.instance.methods.approve(tokenProxy.receipt._address, omgAmount).send({ from: bob });
  await gnt.instance.methods.approve(tokenProxy.receipt._address, gntAmount).send({ from: bob });
  const logs = await orderGateway.instance.methods.perform(orderDataTuple, signatureDataTuple).send({ from: bob });
  ctx.not(logs.events.Perform, undefined);

  const cat1Owner = await cat.instance.methods.ownerOf(1).call();
  const cat3Owner = await cat.instance.methods.ownerOf(3).call();
  const dog1Owner = await dog.instance.methods.ownerOf(1).call();
  const fox1Owner = await fox.instance.methods.ownerOf(1).call();
  const janeOmgAmount = await omg.instance.methods.balanceOf(jane).call();
  const janeGntAmount = await gnt.instance.methods.balanceOf(jane).call();
  const bobZxcAmount = await zxc.instance.methods.balanceOf(bob).call();+
  ctx.is(cat1Owner, bob);
  ctx.is(dog1Owner, bob);
  ctx.is(cat3Owner, jane);
  ctx.is(fox1Owner, jane);
  ctx.is(janeOmgAmount, omgAmount.toString());
  ctx.is(janeGntAmount, gntAmount.toString());
  ctx.is(bobZxcAmount, zxcAmount.toString());
});

erc721sErc20s.test('Cat #1, Dog #1 <=> Cat #3, Fox #1 => 40 ZXC', async (ctx) => {
  const orderGateway = ctx.get('orderGateway');
  const nftProxy = ctx.get('nftProxy');
  const tokenProxy = ctx.get('tokenProxy');
  const jane = ctx.get('jane');
  const sara = ctx.get('sara');
  const bob = ctx.get('bob');
  const cat = ctx.get('cat');
  const dog = ctx.get('dog');
  const fox = ctx.get('fox');
  const zxc = ctx.get('zxc');
  const zxcAmount = 40;

  const actions = [
    {
      kind: 1,
      proxy: 1,
      token: cat.receipt._address,
      from: ctx.web3.utils.padLeft(jane, 64),
      to: bob,
      value: 1,
    },
    {
      kind: 1,
      proxy: 1,
      token: dog.receipt._address,
      from: ctx.web3.utils.padLeft(jane, 64),
      to: bob,
      value: 1,
    },
    {
      kind: 1,
      proxy: 0,
      token: zxc.receipt._address,
      from: ctx.web3.utils.padLeft(jane, 64),
      to: sara,
      value: zxcAmount,
    },
    {
      kind: 1,
      proxy: 1,
      token: cat.receipt._address,
      from: ctx.web3.utils.padLeft(bob, 64),
      to: jane,
      value: 3,
    },
    {
      kind: 1,
      proxy: 1,
      token: fox.receipt._address,
      from: ctx.web3.utils.padLeft(bob, 64),
      to: jane,
      value: 1,
    },
  ];
  const orderData = {
    maker: jane,
    taker: bob,
    actions,
    seed: common.getCurrentTime(), 
    expiration: common.getCurrentTime() + 600,
  };
  const orderDataTuple = ctx.tuple(orderData);
  const claim = await orderGateway.instance.methods.getOrderDataClaim(orderDataTuple).call();

  const signature = await ctx.web3.eth.sign(claim, jane);
  const signatureData = {
    r: signature.substr(0, 66),
    s: `0x${signature.substr(66, 64)}`,
    v: parseInt(`0x${signature.substr(130, 2)}`) + 27,
    kind: 0,
  };
  const signatureDataTuple = ctx.tuple(signatureData);

  await cat.instance.methods.approve(nftProxy.receipt._address, 1).send({ from: jane });
  await dog.instance.methods.approve(nftProxy.receipt._address, 1).send({ from: jane });
  await zxc.instance.methods.approve(tokenProxy.receipt._address, zxcAmount).send({ from: jane });
  await cat.instance.methods.approve(nftProxy.receipt._address, 3).send({ from: bob });
  await fox.instance.methods.approve(nftProxy.receipt._address, 1).send({ from: bob });
  const logs = await orderGateway.instance.methods.perform(orderDataTuple, signatureDataTuple).send({ from: bob });
  ctx.not(logs.events.Perform, undefined);

  const cat1Owner = await cat.instance.methods.ownerOf(1).call();
  const cat3Owner = await cat.instance.methods.ownerOf(3).call();
  const dog1Owner = await dog.instance.methods.ownerOf(1).call();
  const fox1Owner = await fox.instance.methods.ownerOf(1).call();
  const saraZxcAmount = await zxc.instance.methods.balanceOf(sara).call();
  ctx.is(cat1Owner, bob);
  ctx.is(dog1Owner, bob);
  ctx.is(cat3Owner, jane);
  ctx.is(fox1Owner, jane);
  ctx.is(saraZxcAmount, zxcAmount.toString());
});

/**
 * Cancel swap.
 */

spec.spec('cancel an atomic swap', cancel);

cancel.beforeEach(async (ctx) => {
  const orderGateway = ctx.get('orderGateway');
  const nftProxy = ctx.get('nftProxy');
  const jane = ctx.get('jane');
  const bob = ctx.get('bob');
  const cat = ctx.get('cat');

  const actions = [
    {
      kind: 1,
      proxy: 1,
      token: cat.receipt._address,
      from: ctx.web3.utils.padLeft(jane, 64),
      to: bob,
      value: 1,
    },
    {
      kind: 1,
      proxy: 1,
      token: cat.receipt._address,
      from: ctx.web3.utils.padLeft(bob, 64),
      to: jane,
      value: 2,
    },
  ];
  const orderData = {
    maker: jane,
    taker: bob,
    actions,
    seed: common.getCurrentTime(), 
    expiration: common.getCurrentTime() + 600,
  };
  const orderDataTuple = ctx.tuple(orderData);
  const claim = await orderGateway.instance.methods.getOrderDataClaim(orderDataTuple).call();

  const signature = await ctx.web3.eth.sign(claim, jane);
  const signatureData = {
    r: signature.substr(0, 66),
    s: `0x${signature.substr(66, 64)}`,
    v: parseInt(`0x${signature.substr(130, 2)}`) + 27,
    kind: 0,
  };
  const signatureDataTuple = ctx.tuple(signatureData);

  await cat.instance.methods.approve(nftProxy.receipt._address, 1).send({ from: jane });
  await cat.instance.methods.approve(nftProxy.receipt._address, 2).send({ from: bob });

  ctx.set('signatureTuple', signatureDataTuple);
  ctx.set('dataTuple', orderDataTuple);
});

cancel.test('succeeds', async (ctx) => {
  const signatureTuple = ctx.get('signatureTuple');
  const dataTuple = ctx.get('dataTuple');
  const orderGateway = ctx.get('orderGateway');
  const jane = ctx.get('jane');
  const bob = ctx.get('bob');

  const logs = await orderGateway.instance.methods.cancel(dataTuple).send({ from: jane });
  ctx.not(logs.events.Cancel, undefined);
  await ctx.reverts(() => orderGateway.instance.methods.perform(dataTuple, signatureTuple).send({ from: bob }), '015007');
});

cancel.test('throws when trying to cancel an already performed atomic swap', async (ctx) => {
  const signatureTuple = ctx.get('signatureTuple');
  const dataTuple = ctx.get('dataTuple');
  const orderGateway = ctx.get('orderGateway');
  const jane = ctx.get('jane');
  const bob = ctx.get('bob');

  await orderGateway.instance.methods.perform(dataTuple, signatureTuple).send({ from: bob });
  await ctx.reverts(() => orderGateway.instance.methods.cancel(dataTuple).send({ from: jane }), '015008');
});

cancel.test('throws when a third party tries to cancel an atomic swap', async (ctx) => {
  const dataTuple = ctx.get('dataTuple');
  const orderGateway = ctx.get('orderGateway');
  const sara = ctx.get('sara');

  await ctx.reverts(() => orderGateway.instance.methods.cancel(dataTuple).send({ from: sara }), '015009');
});

/**
 * Swap fails.
 */

spec.spec('fail an atomic swap', fail);

fail.test('when proxy not allowed to transfer nft', async (ctx) => {
  const orderGateway = ctx.get('orderGateway');
  const nftProxy = ctx.get('nftProxy');
  const jane = ctx.get('jane');
  const bob = ctx.get('bob');
  const cat = ctx.get('cat');

  const actions = [
    {
      kind: 1,
      proxy: 1,
      token: cat.receipt._address,
      from: ctx.web3.utils.padLeft(jane, 64),
      to: bob,
      value: 1,
    },
    {
      kind: 1,
      proxy: 1,
      token: cat.receipt._address,
      from: ctx.web3.utils.padLeft(bob, 64),
      to: jane,
      value: 2,
    },
  ];
  const orderData = {
    maker: jane,
    taker: bob,
    actions,
    seed: common.getCurrentTime(), 
    expiration: common.getCurrentTime() + 600,
  };
  const orderDataTuple = ctx.tuple(orderData);
  const claim = await orderGateway.instance.methods.getOrderDataClaim(orderDataTuple).call();

  const signature = await ctx.web3.eth.sign(claim, jane);
  const signatureData = {
    r: signature.substr(0, 66),
    s: `0x${signature.substr(66, 64)}`,
    v: parseInt(`0x${signature.substr(130, 2)}`) + 27,
    kind: 0,
  };
  const signatureDataTuple = ctx.tuple(signatureData);

  await cat.instance.methods.approve(nftProxy.receipt._address, 1).send({ from: jane });
  await ctx.reverts(() => orderGateway.instance.methods.perform(orderDataTuple, signatureDataTuple).send({ from: bob }), '006004');
});

fail.test('when proxy has unsofficient allowence for a token', async (ctx) => {
  const orderGateway = ctx.get('orderGateway');
  const nftProxy = ctx.get('nftProxy');
  const tokenProxy = ctx.get('tokenProxy');
  const jane = ctx.get('jane');
  const bob = ctx.get('bob');
  const cat = ctx.get('cat');
  const omg = ctx.get('omg');
  const omgAmount = 5000;

  const actions = [
    {
      kind: 1,
      proxy: 1,
      token: cat.receipt._address,
      from: ctx.web3.utils.padLeft(jane, 64),
      to: bob,
      value: 1,
    },
    {
      kind: 1,
      proxy: 0,
      token: omg.receipt._address,
      from: ctx.web3.utils.padLeft(bob, 64),
      to: jane,
      value: omgAmount,
    },
  ];
  const orderData = {
    maker: jane,
    taker: bob,
    actions,
    seed: common.getCurrentTime(), 
    expiration: common.getCurrentTime() + 600,
  };
  const orderDataTuple = ctx.tuple(orderData);
  const claim = await orderGateway.instance.methods.getOrderDataClaim(orderDataTuple).call();

  const signature = await ctx.web3.eth.sign(claim, jane);
  const signatureData = {
    r: signature.substr(0, 66),
    s: `0x${signature.substr(66, 64)}`,
    v: parseInt(`0x${signature.substr(130, 2)}`) + 27,
    kind: 0,
  };
  const signatureDataTuple = ctx.tuple(signatureData);

  await cat.instance.methods.approve(nftProxy.receipt._address, 1).send({ from: jane });
  await omg.instance.methods.approve(tokenProxy.receipt._address, omgAmount - 1000).send({ from: bob });
  await ctx.reverts(() => orderGateway.instance.methods.perform(orderDataTuple, signatureDataTuple).send({ from: bob }), '001003');
});

fail.test('when _to address is not the one performing the transfer', async (ctx) => {
  const orderGateway = ctx.get('orderGateway');
  const nftProxy = ctx.get('nftProxy');
  const jane = ctx.get('jane');
  const sara = ctx.get('sara');
  const bob = ctx.get('bob');
  const cat = ctx.get('cat');

  const actions = [
    {
      kind: 1,
      proxy: 1,
      token: cat.receipt._address,
      from: ctx.web3.utils.padLeft(jane, 64),
      to: bob,
      value: 1,
    },
    {
      kind: 1,
      proxy: 1,
      token: cat.receipt._address,
      from: ctx.web3.utils.padLeft(bob, 64),
      to: jane,
      value: 2,
    },
  ];
  const orderData = {
    maker: jane,
    taker: bob,
    actions,
    seed: common.getCurrentTime(), 
    expiration: common.getCurrentTime() + 600,
  };
  const orderDataTuple = ctx.tuple(orderData);
  const claim = await orderGateway.instance.methods.getOrderDataClaim(orderDataTuple).call();

  const signature = await ctx.web3.eth.sign(claim, jane);
  const signatureData = {
    r: signature.substr(0, 66),
    s: `0x${signature.substr(66, 64)}`,
    v: parseInt(`0x${signature.substr(130, 2)}`) + 27,
    kind: 0,
  };
  const signatureDataTuple = ctx.tuple(signatureData);

  await cat.instance.methods.approve(nftProxy.receipt._address, 1).send({ from: jane });
  await cat.instance.methods.approve(nftProxy.receipt._address, 2).send({ from: bob });
  await ctx.reverts(() => orderGateway.instance.methods.perform(orderDataTuple, signatureDataTuple).send({ from: sara }), '015003');
});

fail.test('when current time is after expirationTimestamp', async (ctx) => {
  const orderGateway = ctx.get('orderGateway');
  const nftProxy = ctx.get('nftProxy');
  const jane = ctx.get('jane');
  const bob = ctx.get('bob');
  const cat = ctx.get('cat');

  const actions = [
    {
      kind: 1,
      proxy: 1,
      token: cat.receipt._address,
      from: ctx.web3.utils.padLeft(jane, 64),
      to: bob,
      value: 1,
    },
    {
      kind: 1,
      proxy: 1,
      token: cat.receipt._address,
      from: ctx.web3.utils.padLeft(bob, 64),
      to: jane,
      value: 2,
    },
  ];
  const orderData = {
    maker: jane,
    taker: bob,
    actions,
    seed: common.getCurrentTime(), 
    expiration: common.getCurrentTime() - 600,
  };
  const orderDataTuple = ctx.tuple(orderData);
  const claim = await orderGateway.instance.methods.getOrderDataClaim(orderDataTuple).call();

  const signature = await ctx.web3.eth.sign(claim, jane);
  const signatureData = {
    r: signature.substr(0, 66),
    s: `0x${signature.substr(66, 64)}`,
    v: parseInt(`0x${signature.substr(130, 2)}`) + 27,
    kind: 0,
  };
  const signatureDataTuple = ctx.tuple(signatureData);

  await cat.instance.methods.approve(nftProxy.receipt._address, 1).send({ from: jane });
  await cat.instance.methods.approve(nftProxy.receipt._address, 2).send({ from: bob });
  await ctx.reverts(() => orderGateway.instance.methods.perform(orderDataTuple, signatureDataTuple).send({ from: bob }), '015005');
});

fail.test('when signature is invalid', async (ctx) => {
  const orderGateway = ctx.get('orderGateway');
  const nftProxy = ctx.get('nftProxy');
  const jane = ctx.get('jane');
  const bob = ctx.get('bob');
  const cat = ctx.get('cat');

  const actions = [
    {
      kind: 1,
      proxy: 1,
      token: cat.receipt._address,
      from: ctx.web3.utils.padLeft(jane, 64),
      to: bob,
      value: 1,
    },
    {
      kind: 1,
      proxy: 1,
      token: cat.receipt._address,
      from: ctx.web3.utils.padLeft(bob, 64),
      to: jane,
      value: 2,
    },
  ];
  const orderData = {
    maker: jane,
    taker: bob,
    actions,
    seed: common.getCurrentTime(), 
    expiration: common.getCurrentTime() + 600,
  };
  let orderDataTuple = ctx.tuple(orderData);
  const claim = await orderGateway.instance.methods.getOrderDataClaim(orderDataTuple).call();
  orderData.actions[0].kind = 0;
  orderDataTuple = ctx.tuple(orderData);
  
  const signature = await ctx.web3.eth.sign(claim, jane);
  const signatureData = {
    r: signature.substr(0, 66),
    s: `0x${signature.substr(66, 64)}`,
    v: parseInt(`0x${signature.substr(130, 2)}`) + 27,
    kind: 0,
  };
  const signatureDataTuple = ctx.tuple(signatureData);

  await cat.instance.methods.approve(nftProxy.receipt._address, 1).send({ from: jane });
  await cat.instance.methods.approve(nftProxy.receipt._address, 2).send({ from: bob });
  await ctx.reverts(() =>orderGateway.instance.methods.perform(orderDataTuple, signatureDataTuple).send({ from: bob }), '015006');
});

fail.test('when trying to perform an already perfomed swap', async (ctx) => {
  const orderGateway = ctx.get('orderGateway');
  const nftProxy = ctx.get('nftProxy');
  const jane = ctx.get('jane');
  const bob = ctx.get('bob');
  const cat = ctx.get('cat');

  const actions = [
    {
      kind: 1,
      proxy: 1,
      token: cat.receipt._address,
      from: ctx.web3.utils.padLeft(jane, 64),
      to: bob,
      value: 1,
    },
    {
      kind: 1,
      proxy: 1,
      token: cat.receipt._address,
      from: ctx.web3.utils.padLeft(bob, 64),
      to: jane,
      value: 2,
    },
  ];
  const orderData = {
    maker: jane,
    taker: bob,
    actions,
    seed: common.getCurrentTime(), 
    expiration: common.getCurrentTime() + 600,
  };
  const orderDataTuple = ctx.tuple(orderData);
  const claim = await orderGateway.instance.methods.getOrderDataClaim(orderDataTuple).call();
  
  const signature = await ctx.web3.eth.sign(claim, jane);
  const signatureData = {
    r: signature.substr(0, 66),
    s: `0x${signature.substr(66, 64)}`,
    v: parseInt(`0x${signature.substr(130, 2)}`) + 27,
    kind: 0,
  };
  const signatureDataTuple = ctx.tuple(signatureData);

  await cat.instance.methods.approve(nftProxy.receipt._address, 1).send({ from: jane });
  await cat.instance.methods.approve(nftProxy.receipt._address, 2).send({ from: bob });
  await orderGateway.instance.methods.perform(orderDataTuple, signatureDataTuple).send({ from: bob });
  await ctx.reverts(() => orderGateway.instance.methods.perform(orderDataTuple, signatureDataTuple).send({ from: bob }), '015008');
});

fail.test('when trying to transfer third party assets', async (ctx) => {
  const orderGateway = ctx.get('orderGateway');
  const nftProxy = ctx.get('nftProxy');
  const jane = ctx.get('jane');
  const bob = ctx.get('bob');
  const sara = ctx.get('sara');
  const cat = ctx.get('cat');

  const actions = [
    {
      kind: 1,
      proxy: 1,
      token: cat.receipt._address,
      from: ctx.web3.utils.padLeft(jane, 64),
      to: sara,
      value: 1,
    },
    {
      kind: 1,
      proxy: 1,
      token: cat.receipt._address,
      from: ctx.web3.utils.padLeft(bob, 64),
      to: sara,
      value: 2,
    },
  ];
  const orderData = {
    maker: sara,
    taker: bob,
    actions,
    seed: common.getCurrentTime(), 
    expiration: common.getCurrentTime() + 600,
  };
  const orderDataTuple = ctx.tuple(orderData);
  const claim = await orderGateway.instance.methods.getOrderDataClaim(orderDataTuple).call();
  
  const signature = await ctx.web3.eth.sign(claim, sara);
  const signatureData = {
    r: signature.substr(0, 66),
    s: `0x${signature.substr(66, 64)}`,
    v: parseInt(`0x${signature.substr(130, 2)}`) + 27,
    kind: 0,
  };
  const signatureDataTuple = ctx.tuple(signatureData);

  await cat.instance.methods.setApprovalForAll(nftProxy.receipt._address, true).send({ from: jane });
  await cat.instance.methods.approve(nftProxy.receipt._address, 2).send({ from: bob });
  await ctx.reverts(() => orderGateway.instance.methods.perform(orderDataTuple, signatureDataTuple).send({ from: bob }), '015004');
});