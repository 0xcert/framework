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
  exchange?: any;
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
    src: '@0xcert/web3-erc721/build/NFTokenMetadataEnumerableMock.json',
    contract: 'NFTokenMetadataEnumerableMock',
    args: ['cat', 'CAT'],
  });
  await cat.methods
    .mint(ctx.get('jane'), 1, '0xcert.org')
    .send({
      from: ctx.get('owner'),
      gas: 4000000,
    });
  await cat.methods
    .mint(ctx.get('jane'), 4, '0xcert.org')
    .send({
      from: ctx.get('owner'),
      gas: 4000000,
    });
  await cat.methods
    .mint(ctx.get('bob'), 2, '0xcert.org')
    .send({
      from: ctx.get('owner'),
      gas: 4000000,
    });
  await cat.methods
    .mint(ctx.get('bob'), 3, '0xcert.org')
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
    src: '@0xcert/web3-erc721/build/NFTokenMetadataEnumerableMock.json',
    contract: 'NFTokenMetadataEnumerableMock',
    args: ['dog', 'DOG'],
  });
  await dog.methods
    .mint(ctx.get('jane'), 1, '0xcert.org')
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
    src: '@0xcert/web3-erc721/build/NFTokenMetadataEnumerableMock.json',
    contract: 'NFTokenMetadataEnumerableMock',
    args: ['bee', 'BEE'],
  });
  await bee.methods
    .mint(ctx.get('bob'), 3, '0xcert.org')
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
    src: '@0xcert/web3-erc721/build/NFTokenMetadataEnumerableMock.json',
    contract: 'NFTokenMetadataEnumerableMock',
    args: ['fox', 'FOX'],
  });
  await fox.methods
    .mint(ctx.get('bob'), 1, '0xcert.org')
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
    src: '@0xcert/web3-erc20/build/TokenMock.json',
    contract: 'TokenMock',
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
    src: '@0xcert/web3-erc20/build/TokenMock.json',
    contract: 'TokenMock',
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
    src: '@0xcert/web3-erc20/build/TokenMock.json',
    contract: 'TokenMock',
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
    src: '@0xcert/web3-erc20/build/TokenMock.json',
    contract: 'TokenMock',
    from: bob
  });
  ctx.set('omg', omg);
});

spec.beforeEach(async (ctx) => {
  const tokenProxy = await ctx.deploy({
    src: '@0xcert/web3-proxy/build/token-transfer-proxy.json',
    contract: 'TokenTransferProxy'
  });
  ctx.set('tokenProxy', tokenProxy);
});

spec.beforeEach(async (ctx) => {
  const nftProxy = await ctx.deploy({
    src: '@0xcert/web3-proxy/build/nftokens-transfer-proxy.json',
    contract: 'NFTokenTransferProxy',
  });
  ctx.set('nftProxy', nftProxy);
});

spec.beforeEach(async (ctx) => {
  const tokenProxy = ctx.get('tokenProxy');
  const nftProxy = ctx.get('nftProxy');
  const exchange = await ctx.deploy({
    src: './build/exchange.json',
    contract: 'Exchange',
    args: [tokenProxy._address, nftProxy._address],
  });
  ctx.set('exchange', exchange);
});

spec.beforeEach(async (ctx) => {
  const tokenProxy = ctx.get('tokenProxy');
  const nftProxy = ctx.get('nftProxy');
  const exchange = ctx.get('exchange');
  const owner = ctx.get('owner');
  await tokenProxy.methods.addAuthorizedAddress(exchange._address).send({ from: owner });
  await nftProxy.methods.addAuthorizedAddress(exchange._address).send({ from: owner });
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
  const exchange = ctx.get('exchange');
  const nftProxy = ctx.get('nftProxy');
  const jane = ctx.get('jane');
  const bob = ctx.get('bob');
  const cat = ctx.get('cat');

  const transfers = [
    {
      token: cat._address,
      kind: 1,
      from: jane,
      to: bob,
      value: 1,
    },
    {
      token: cat._address,
      kind: 1,
      from: bob,
      to: jane,
      value: 2,
    },
  ];
  const swapData = {
    maker: jane,
    taker: bob,
    transfers,
    seed: common.getCurrentTime(), 
    expiration: common.getCurrentTime() + 600,
  };
  const swapDataTuple = ctx.tuple(swapData);
  const claim = await exchange.methods.getSwapDataClaim(swapDataTuple).call();

  const signature = await ctx.web3.eth.sign(claim, jane);
  const signatureData = {
    r: signature.substr(0, 66),
    s: `0x${signature.substr(66, 64)}`,
    v: parseInt(`0x${signature.substr(130, 2)}`) + 27,
    kind: 0,
  };
  const signatureDataTuple = ctx.tuple(signatureData);

  await cat.methods.approve(nftProxy._address, 1).send({ from: jane });
  await cat.methods.approve(nftProxy._address, 2).send({ from: bob });
  const logs = await exchange.methods.swap(swapDataTuple, signatureDataTuple).send({ from: bob, gas: 4000000 });
  ctx.not(logs.events.PerformSwap, undefined);

  const cat1Owner = await cat.methods.ownerOf(1).call();
  const cat2Owner = await cat.methods.ownerOf(2).call();
  ctx.is(cat1Owner, bob);
  ctx.is(cat2Owner, jane);
});

erc721s.test('Cat #1, Cat #4 <=> Cat #2', async (ctx) => {
  const exchange = ctx.get('exchange');
  const nftProxy = ctx.get('nftProxy');
  const jane = ctx.get('jane');
  const bob = ctx.get('bob');
  const cat = ctx.get('cat');

  const transfers = [
    {
      token: cat._address,
      kind: 1,
      from: jane,
      to: bob,
      value: 1,
    },
    {
      token: cat._address,
      kind: 1,
      from: jane,
      to: bob,
      value: 4,
    }, 
    {
      token: cat._address,
      kind: 1,
      from: bob,
      to: jane,
      value: 2,
    },
  ];
  const swapData = {
    maker: jane,
    taker: bob,
    transfers,
    seed: common.getCurrentTime(), 
    expiration: common.getCurrentTime() + 600,
  };
  const swapDataTuple = ctx.tuple(swapData);
  const claim = await exchange.methods.getSwapDataClaim(swapDataTuple).call();

  const signature = await ctx.web3.eth.sign(claim, jane);
  const signatureData = {
    r: signature.substr(0, 66),
    s: `0x${signature.substr(66, 64)}`,
    v: parseInt(`0x${signature.substr(130, 2)}`) + 27,
    kind: 0,
  };
  const signatureDataTuple = ctx.tuple(signatureData);

  await cat.methods.approve(nftProxy._address, 1).send({ from: jane });
  await cat.methods.approve(nftProxy._address, 4).send({ from: jane });
  await cat.methods.approve(nftProxy._address, 2).send({ from: bob });
  const logs = await exchange.methods.swap(swapDataTuple, signatureDataTuple).send({ from: bob, gas: 4000000 });
  ctx.not(logs.events.PerformSwap, undefined);

  const cat1Owner = await cat.methods.ownerOf(1).call();
  const cat2Owner = await cat.methods.ownerOf(2).call();
  const cat4Owner = await cat.methods.ownerOf(4).call();
  ctx.is(cat1Owner, bob);
  ctx.is(cat2Owner, jane);
  ctx.is(cat4Owner, bob);
});

erc721s.test('Cat #1, Dog #1 <=> Fox #1, Bee #3', async (ctx) => {
  const exchange = ctx.get('exchange');
  const nftProxy = ctx.get('nftProxy');
  const jane = ctx.get('jane');
  const bob = ctx.get('bob');
  const cat = ctx.get('cat');
  const dog = ctx.get('dog');
  const fox = ctx.get('fox');
  const bee = ctx.get('bee');

  const transfers = [
    {
      token: cat._address,
      kind: 1,
      from: jane,
      to: bob,
      value: 1,
    },
    {
      token: dog._address,
      kind: 1,
      from: jane,
      to: bob,
      value: 1,
    },
    {
      token: fox._address,
      kind: 1,
      from: bob,
      to: jane,
      value: 1,
    },
    {
      token: bee._address,
      kind: 1,
      from: bob,
      to: jane,
      value: 3,
    },
  ];
  const swapData = {
    maker: jane,
    taker: bob,
    transfers,
    seed: common.getCurrentTime(), 
    expiration: common.getCurrentTime() + 600,
  };
  const swapDataTuple = ctx.tuple(swapData);
  const claim = await exchange.methods.getSwapDataClaim(swapDataTuple).call();

  const signature = await ctx.web3.eth.sign(claim, jane);
  const signatureData = {
    r: signature.substr(0, 66),
    s: `0x${signature.substr(66, 64)}`,
    v: parseInt(`0x${signature.substr(130, 2)}`) + 27,
    kind: 0,
  };
  const signatureDataTuple = ctx.tuple(signatureData);

  await cat.methods.approve(nftProxy._address, 1).send({ from: jane });
  await dog.methods.approve(nftProxy._address, 1).send({ from: jane });
  await fox.methods.approve(nftProxy._address, 1).send({ from: bob });
  await bee.methods.approve(nftProxy._address, 3).send({ from: bob });
  const logs = await exchange.methods.swap(swapDataTuple, signatureDataTuple).send({ from: bob, gas: 6000000 });
  ctx.not(logs.events.PerformSwap, undefined);

  const cat1Owner = await cat.methods.ownerOf(1).call();
  const dog1Owner = await dog.methods.ownerOf(1).call();
  const fox1Owner = await fox.methods.ownerOf(1).call();
  const bee3Owner = await bee.methods.ownerOf(3).call();
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
  const exchange = ctx.get('exchange');
  const tokenProxy = ctx.get('tokenProxy');
  const jane = ctx.get('jane');
  const bob = ctx.get('bob');
  const zxc = ctx.get('zxc');
  const gnt = ctx.get('gnt');
  const zxcAmount = 3000;
  const gntAmount = 50000;

  const transfers = [
    {
      token: zxc._address,
      kind: 0,
      from: jane,
      to: bob,
      value: zxcAmount,
    },
    {
      token: gnt._address,
      kind: 0,
      from: bob,
      to: jane,
      value: gntAmount,
    },
  ];
  const swapData = {
    maker: jane,
    taker: bob,
    transfers,
    seed: common.getCurrentTime(), 
    expiration: common.getCurrentTime() + 600,
  };
  const swapDataTuple = ctx.tuple(swapData);
  const claim = await exchange.methods.getSwapDataClaim(swapDataTuple).call();

  const signature = await ctx.web3.eth.sign(claim, jane);
  const signatureData = {
    r: signature.substr(0, 66),
    s: `0x${signature.substr(66, 64)}`,
    v: parseInt(`0x${signature.substr(130, 2)}`) + 27,
    kind: 0,
  };
  const signatureDataTuple = ctx.tuple(signatureData);

  await zxc.methods.approve(tokenProxy._address, zxcAmount).send({ from: jane });
  await gnt.methods.approve(tokenProxy._address, gntAmount).send({ from: bob });
  const logs = await exchange.methods.swap(swapDataTuple, signatureDataTuple).send({from: bob, gas: 4000000});
  ctx.not(logs.events.PerformSwap, undefined);

  const bobBalance = await zxc.methods.balanceOf(bob).call();
  const janeBalance = await gnt.methods.balanceOf(jane).call();
  ctx.is(bobBalance, zxcAmount.toString());
  ctx.is(janeBalance, gntAmount.toString());
});

erc20s.test('500 ZXC, 1 BNB <=> 30 GNT, 5 OMG', async (ctx) => {
  const exchange = ctx.get('exchange');
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

  const transfers = [
    {
      token: zxc._address,
      kind: 0,
      from: jane,
      to: bob,
      value: zxcAmount,
    },
    {
      token: bnb._address,
      kind: 0,
      from: jane,
      to: bob,
      value: bnbAmount,
    },
    {
      token: gnt._address,
      kind: 0,
      from: bob,
      to: jane,
      value: gntAmount,
    },
    {
      token: omg._address,
      kind: 0,
      from: bob,
      to: jane,
      value: omgAmount,
    },
  ];
  const swapData = {
    maker: jane,
    taker: bob,
    transfers,
    seed: common.getCurrentTime(), 
    expiration: common.getCurrentTime() + 600,
  };
  const swapDataTuple = ctx.tuple(swapData);
  const claim = await exchange.methods.getSwapDataClaim(swapDataTuple).call();

  const signature = await ctx.web3.eth.sign(claim, jane);
  const signatureData = {
    r: signature.substr(0, 66),
    s: `0x${signature.substr(66, 64)}`,
    v: parseInt(`0x${signature.substr(130, 2)}`) + 27,
    kind: 0,
  };
  const signatureDataTuple = ctx.tuple(signatureData);

  await zxc.methods.approve(tokenProxy._address, zxcAmount).send({ from: jane });
  await bnb.methods.approve(tokenProxy._address, bnbAmount).send({ from: jane });
  await gnt.methods.approve(tokenProxy._address, gntAmount).send({ from: bob });
  await omg.methods.approve(tokenProxy._address, omgAmount).send({ from: bob });
  const logs = await exchange.methods.swap(swapDataTuple, signatureDataTuple).send({from: bob, gas: 4000000});
  ctx.not(logs.events.PerformSwap, undefined);

  const bobZxcBalance = await zxc.methods.balanceOf(bob).call();
  const bobBnbBalance = await bnb.methods.balanceOf(bob).call();
  const janeGntBalance = await gnt.methods.balanceOf(jane).call();
  const janeOmgBalance = await omg.methods.balanceOf(jane).call();
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
  const exchange = ctx.get('exchange');
  const nftProxy = ctx.get('nftProxy');
  const tokenProxy = ctx.get('tokenProxy');
  const jane = ctx.get('jane');
  const bob = ctx.get('bob');
  const cat = ctx.get('cat');
  const omg = ctx.get('omg');
  const omgAmount = 5000;

  const transfers = [
    {
      token: cat._address,
      kind: 1,
      from: jane,
      to: bob,
      value: 1,
    },
    {
      token: omg._address,
      kind: 0,
      from: bob,
      to: jane,
      value: omgAmount,
    },
  ];
  const swapData = {
    maker: jane,
    taker: bob,
    transfers,
    seed: common.getCurrentTime(), 
    expiration: common.getCurrentTime() + 600,
  };
  const swapDataTuple = ctx.tuple(swapData);
  const claim = await exchange.methods.getSwapDataClaim(swapDataTuple).call();

  const signature = await ctx.web3.eth.sign(claim, jane);
  const signatureData = {
    r: signature.substr(0, 66),
    s: `0x${signature.substr(66, 64)}`,
    v: parseInt(`0x${signature.substr(130, 2)}`) + 27,
    kind: 0,
  };
  const signatureDataTuple = ctx.tuple(signatureData);

  await cat.methods.approve(nftProxy._address, 1).send({ from: jane });
  await omg.methods.approve(tokenProxy._address, omgAmount).send({ from: bob });
  const logs = await exchange.methods.swap(swapDataTuple, signatureDataTuple).send({ from: bob, gas: 4000000 });
  ctx.not(logs.events.PerformSwap, undefined);

  const cat1Owner = await cat.methods.ownerOf(1).call();
  const janeOmgAmount = await omg.methods.balanceOf(jane).call();
  ctx.is(cat1Owner, bob);
  ctx.is(janeOmgAmount, omgAmount.toString());
});

erc721sErc20s.test('Cat #1, Dog #1, 3 ZXC <=> Cat #3, Fox #1, 30 OMG, 5000 GNT', async (ctx) => {
  const exchange = ctx.get('exchange');
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

  const transfers = [
    {
      token: cat._address,
      kind: 1,
      from: jane,
      to: bob,
      value: 1,
    },
    {
      token: dog._address,
      kind: 1,
      from: jane,
      to: bob,
      value: 1,
    },
    {
      token: zxc._address,
      kind: 0,
      from: jane,
      to: bob,
      value: zxcAmount,
    },
    {
      token: cat._address,
      kind: 1,
      from: bob,
      to: jane,
      value: 3,
    },
    {
      token: fox._address,
      kind: 1,
      from: bob,
      to: jane,
      value: 1,
    },
    {
      token: omg._address,
      kind: 0,
      from: bob,
      to: jane,
      value: omgAmount,
    },
    {
      token: gnt._address,
      kind: 0,
      from: bob,
      to: jane,
      value: gntAmount,
    },
  ];
  const swapData = {
    maker: jane,
    taker: bob,
    transfers,
    seed: common.getCurrentTime(), 
    expiration: common.getCurrentTime() + 600,
  };
  const swapDataTuple = ctx.tuple(swapData);
  const claim = await exchange.methods.getSwapDataClaim(swapDataTuple).call();

  const signature = await ctx.web3.eth.sign(claim, jane);
  const signatureData = {
    r: signature.substr(0, 66),
    s: `0x${signature.substr(66, 64)}`,
    v: parseInt(`0x${signature.substr(130, 2)}`) + 27,
    kind: 0,
  };
  const signatureDataTuple = ctx.tuple(signatureData);

  await cat.methods.approve(nftProxy._address, 1).send({ from: jane });
  await dog.methods.approve(nftProxy._address, 1).send({ from: jane });
  await zxc.methods.approve(tokenProxy._address, zxcAmount).send({ from: jane });
  await cat.methods.approve(nftProxy._address, 3).send({ from: bob });
  await fox.methods.approve(nftProxy._address, 1).send({ from: bob });
  await omg.methods.approve(tokenProxy._address, omgAmount).send({ from: bob });
  await gnt.methods.approve(tokenProxy._address, gntAmount).send({ from: bob });
  const logs = await exchange.methods.swap(swapDataTuple, signatureDataTuple).send({ from: bob, gas: 4000000 });
  ctx.not(logs.events.PerformSwap, undefined);

  const cat1Owner = await cat.methods.ownerOf(1).call();
  const cat3Owner = await cat.methods.ownerOf(3).call();
  const dog1Owner = await dog.methods.ownerOf(1).call();
  const fox1Owner = await fox.methods.ownerOf(1).call();
  const janeOmgAmount = await omg.methods.balanceOf(jane).call();
  const janeGntAmount = await gnt.methods.balanceOf(jane).call();
  const bobZxcAmount = await zxc.methods.balanceOf(bob).call();+
  ctx.is(cat1Owner, bob);
  ctx.is(dog1Owner, bob);
  ctx.is(cat3Owner, jane);
  ctx.is(fox1Owner, jane);
  ctx.is(janeOmgAmount, omgAmount.toString());
  ctx.is(janeGntAmount, gntAmount.toString());
  ctx.is(bobZxcAmount, zxcAmount.toString());
});

erc721sErc20s.test('Cat #1, Dog #1 <=> Cat #3, Fox #1 => 40 ZXC', async (ctx) => {
  const exchange = ctx.get('exchange');
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

  const transfers = [
    {
      token: cat._address,
      kind: 1,
      from: jane,
      to: bob,
      value: 1,
    },
    {
      token: dog._address,
      kind: 1,
      from: jane,
      to: bob,
      value: 1,
    },
    {
      token: zxc._address,
      kind: 0,
      from: jane,
      to: sara,
      value: zxcAmount,
    },
    {
      token: cat._address,
      kind: 1,
      from: bob,
      to: jane,
      value: 3,
    },
    {
      token: fox._address,
      kind: 1,
      from: bob,
      to: jane,
      value: 1,
    },
  ];
  const swapData = {
    maker: jane,
    taker: bob,
    transfers,
    seed: common.getCurrentTime(), 
    expiration: common.getCurrentTime() + 600,
  };
  const swapDataTuple = ctx.tuple(swapData);
  const claim = await exchange.methods.getSwapDataClaim(swapDataTuple).call();

  const signature = await ctx.web3.eth.sign(claim, jane);
  const signatureData = {
    r: signature.substr(0, 66),
    s: `0x${signature.substr(66, 64)}`,
    v: parseInt(`0x${signature.substr(130, 2)}`) + 27,
    kind: 0,
  };
  const signatureDataTuple = ctx.tuple(signatureData);

  await cat.methods.approve(nftProxy._address, 1).send({ from: jane });
  await dog.methods.approve(nftProxy._address, 1).send({ from: jane });
  await zxc.methods.approve(tokenProxy._address, zxcAmount).send({ from: jane });
  await cat.methods.approve(nftProxy._address, 3).send({ from: bob });
  await fox.methods.approve(nftProxy._address, 1).send({ from: bob });
  const logs = await exchange.methods.swap(swapDataTuple, signatureDataTuple).send({ from: bob, gas: 4000000 });
  ctx.not(logs.events.PerformSwap, undefined);

  const cat1Owner = await cat.methods.ownerOf(1).call();
  const cat3Owner = await cat.methods.ownerOf(3).call();
  const dog1Owner = await dog.methods.ownerOf(1).call();
  const fox1Owner = await fox.methods.ownerOf(1).call();
  const saraZxcAmount = await zxc.methods.balanceOf(sara).call();
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
  const exchange = ctx.get('exchange');
  const nftProxy = ctx.get('nftProxy');
  const jane = ctx.get('jane');
  const bob = ctx.get('bob');
  const cat = ctx.get('cat');

  const transfers = [
    {
      token: cat._address,
      kind: 1,
      from: jane,
      to: bob,
      value: 1,
    },
    {
      token: cat._address,
      kind: 1,
      from: bob,
      to: jane,
      value: 2,
    },
  ];
  const swapData = {
    maker: jane,
    taker: bob,
    transfers,
    seed: common.getCurrentTime(), 
    expiration: common.getCurrentTime() + 600,
  };
  const swapDataTuple = ctx.tuple(swapData);
  const claim = await exchange.methods.getSwapDataClaim(swapDataTuple).call();

  const signature = await ctx.web3.eth.sign(claim, jane);
  const signatureData = {
    r: signature.substr(0, 66),
    s: `0x${signature.substr(66, 64)}`,
    v: parseInt(`0x${signature.substr(130, 2)}`) + 27,
    kind: 0,
  };
  const signatureDataTuple = ctx.tuple(signatureData);

  await cat.methods.approve(nftProxy._address, 1).send({ from: jane });
  await cat.methods.approve(nftProxy._address, 2).send({ from: bob });

  ctx.set('signatureTuple', signatureDataTuple);
  ctx.set('dataTuple', swapDataTuple);
});

cancel.test('succeeds', async (ctx) => {
  const signatureTuple = ctx.get('signatureTuple');
  const dataTuple = ctx.get('dataTuple');
  const exchange = ctx.get('exchange');
  const jane = ctx.get('jane');
  const bob = ctx.get('bob');

  const logs = await exchange.methods.cancelSwap(dataTuple).send({ from: jane });
  ctx.not(logs.events.CancelSwap, undefined);
  // TODO(Tadej): check revert for code 2005
  await ctx.reverts(() => exchange.methods.swap(dataTuple, signatureTuple).send({ from: bob, gas: 4000000 }));
});

cancel.test('throws when trying to cancel an already performed atomic swap', async (ctx) => {
  const signatureTuple = ctx.get('signatureTuple');
  const dataTuple = ctx.get('dataTuple');
  const exchange = ctx.get('exchange');
  const jane = ctx.get('jane');
  const bob = ctx.get('bob');

  await exchange.methods.swap(dataTuple, signatureTuple).send({ from: bob, gas: 4000000 });
  // TODO(Tadej): check revert for code 2006
  await ctx.reverts(() => exchange.methods.cancelSwap(dataTuple).send({ from: jane }));
});

cancel.test('throws when a third party tries to cancel an atomic swap', async (ctx) => {
  const dataTuple = ctx.get('dataTuple');
  const exchange = ctx.get('exchange');
  const sara = ctx.get('sara');

  // TODO(Tadej): check revert for code 2009
  await ctx.reverts(() => exchange.methods.cancelSwap(dataTuple).send({ from: sara }));
});

/**
 * Swap fails.
 */

spec.spec('fail an atomic swap', fail);

fail.test('when proxy not allowed to transfer nft', async (ctx) => {
  const exchange = ctx.get('exchange');
  const nftProxy = ctx.get('nftProxy');
  const jane = ctx.get('jane');
  const bob = ctx.get('bob');
  const cat = ctx.get('cat');

  const transfers = [
    {
      token: cat._address,
      kind: 1,
      from: jane,
      to: bob,
      value: 1,
    },
    {
      token: cat._address,
      kind: 1,
      from: bob,
      to: jane,
      value: 2,
    },
  ];
  const swapData = {
    maker: jane,
    taker: bob,
    transfers,
    seed: common.getCurrentTime(), 
    expiration: common.getCurrentTime() + 600,
  };
  const swapDataTuple = ctx.tuple(swapData);
  const claim = await exchange.methods.getSwapDataClaim(swapDataTuple).call();

  const signature = await ctx.web3.eth.sign(claim, jane);
  const signatureData = {
    r: signature.substr(0, 66),
    s: `0x${signature.substr(66, 64)}`,
    v: parseInt(`0x${signature.substr(130, 2)}`) + 27,
    kind: 0,
  };
  const signatureDataTuple = ctx.tuple(signatureData);

  await cat.methods.approve(nftProxy._address, 1).send({ from: jane });
  await ctx.reverts(() => exchange.methods.swap(swapDataTuple, signatureDataTuple).send({ from: bob, gas: 4000000 }));
});

fail.test('when proxy has unsofficient allowence for a token', async (ctx) => {
  const exchange = ctx.get('exchange');
  const nftProxy = ctx.get('nftProxy');
  const tokenProxy = ctx.get('tokenProxy');
  const jane = ctx.get('jane');
  const bob = ctx.get('bob');
  const cat = ctx.get('cat');
  const omg = ctx.get('omg');
  const omgAmount = 5000;

  const transfers = [
    {
      token: cat._address,
      kind: 1,
      from: jane,
      to: bob,
      value: 1,
    },
    {
      token: omg._address,
      kind: 0,
      from: bob,
      to: jane,
      value: omgAmount,
    },
  ];
  const swapData = {
    maker: jane,
    taker: bob,
    transfers,
    seed: common.getCurrentTime(), 
    expiration: common.getCurrentTime() + 600,
  };
  const swapDataTuple = ctx.tuple(swapData);
  const claim = await exchange.methods.getSwapDataClaim(swapDataTuple).call();

  const signature = await ctx.web3.eth.sign(claim, jane);
  const signatureData = {
    r: signature.substr(0, 66),
    s: `0x${signature.substr(66, 64)}`,
    v: parseInt(`0x${signature.substr(130, 2)}`) + 27,
    kind: 0,
  };
  const signatureDataTuple = ctx.tuple(signatureData);

  await cat.methods.approve(nftProxy._address, 1).send({ from: jane });
  await omg.methods.approve(tokenProxy._address, omgAmount - 1000).send({ from: bob });
  await ctx.reverts(() => exchange.methods.swap(swapDataTuple, signatureDataTuple).send({ from: bob, gas: 4000000 }));
});

fail.test('when _to address is not the one performing the transfer', async (ctx) => {
  const exchange = ctx.get('exchange');
  const nftProxy = ctx.get('nftProxy');
  const jane = ctx.get('jane');
  const sara = ctx.get('sara');
  const bob = ctx.get('bob');
  const cat = ctx.get('cat');

  const transfers = [
    {
      token: cat._address,
      kind: 1,
      from: jane,
      to: bob,
      value: 1,
    },
    {
      token: cat._address,
      kind: 1,
      from: bob,
      to: jane,
      value: 2,
    },
  ];
  const swapData = {
    maker: jane,
    taker: bob,
    transfers,
    seed: common.getCurrentTime(), 
    expiration: common.getCurrentTime() + 600,
  };
  const swapDataTuple = ctx.tuple(swapData);
  const claim = await exchange.methods.getSwapDataClaim(swapDataTuple).call();

  const signature = await ctx.web3.eth.sign(claim, jane);
  const signatureData = {
    r: signature.substr(0, 66),
    s: `0x${signature.substr(66, 64)}`,
    v: parseInt(`0x${signature.substr(130, 2)}`) + 27,
    kind: 0,
  };
  const signatureDataTuple = ctx.tuple(signatureData);

  await cat.methods.approve(nftProxy._address, 1).send({ from: jane });
  await cat.methods.approve(nftProxy._address, 2).send({ from: bob });
  // TODO(Tadej): check revert for code 2001
  await ctx.reverts(() => exchange.methods.swap(swapDataTuple, signatureDataTuple).send({ from: sara, gas: 4000000 }));
});

fail.test('when taker and makes addresses are the same', async (ctx) => {
  const exchange = ctx.get('exchange');
  const nftProxy = ctx.get('nftProxy');
  const jane = ctx.get('jane');
  const bob = ctx.get('bob');
  const cat = ctx.get('cat');

  const transfers = [
    {
      token: cat._address,
      kind: 1,
      from: jane,
      to: bob,
      value: 1,
    },
    {
      token: cat._address,
      kind: 1,
      from: bob,
      to: jane,
      value: 2,
    },
  ];
  const swapData = {
    maker: jane,
    taker: jane,
    transfers,
    seed: common.getCurrentTime(), 
    expiration: common.getCurrentTime() + 600,
  };
  const swapDataTuple = ctx.tuple(swapData);
  const claim = await exchange.methods.getSwapDataClaim(swapDataTuple).call();

  const signature = await ctx.web3.eth.sign(claim, jane);
  const signatureData = {
    r: signature.substr(0, 66),
    s: `0x${signature.substr(66, 64)}`,
    v: parseInt(`0x${signature.substr(130, 2)}`) + 27,
    kind: 0,
  };
  const signatureDataTuple = ctx.tuple(signatureData);

  await cat.methods.approve(nftProxy._address, 1).send({ from: jane });
  await cat.methods.approve(nftProxy._address, 2).send({ from: bob });
  // TODO(Tadej): check revert for code 2002
  await ctx.reverts(() => exchange.methods.swap(swapDataTuple, signatureDataTuple).send({ from: jane, gas: 4000000 }));
});

fail.test('when current time is after expirationTimestamp', async (ctx) => {
  const exchange = ctx.get('exchange');
  const nftProxy = ctx.get('nftProxy');
  const jane = ctx.get('jane');
  const bob = ctx.get('bob');
  const cat = ctx.get('cat');

  const transfers = [
    {
      token: cat._address,
      kind: 1,
      from: jane,
      to: bob,
      value: 1,
    },
    {
      token: cat._address,
      kind: 1,
      from: bob,
      to: jane,
      value: 2,
    },
  ];
  const swapData = {
    maker: jane,
    taker: bob,
    transfers,
    seed: common.getCurrentTime(), 
    expiration: common.getCurrentTime() - 600,
  };
  const swapDataTuple = ctx.tuple(swapData);
  const claim = await exchange.methods.getSwapDataClaim(swapDataTuple).call();

  const signature = await ctx.web3.eth.sign(claim, jane);
  const signatureData = {
    r: signature.substr(0, 66),
    s: `0x${signature.substr(66, 64)}`,
    v: parseInt(`0x${signature.substr(130, 2)}`) + 27,
    kind: 0,
  };
  const signatureDataTuple = ctx.tuple(signatureData);

  await cat.methods.approve(nftProxy._address, 1).send({ from: jane });
  await cat.methods.approve(nftProxy._address, 2).send({ from: bob });
  // TODO(Tadej): check revert for code 2003
  await ctx.reverts(() => exchange.methods.swap(swapDataTuple, signatureDataTuple).send({ from: bob, gas: 4000000 }));
});

fail.test('when signature is invalid', async (ctx) => {
  const exchange = ctx.get('exchange');
  const nftProxy = ctx.get('nftProxy');
  const jane = ctx.get('jane');
  const bob = ctx.get('bob');
  const cat = ctx.get('cat');

  const transfers = [
    {
      token: cat._address,
      kind: 1,
      from: jane,
      to: bob,
      value: 1,
    },
    {
      token: cat._address,
      kind: 1,
      from: bob,
      to: jane,
      value: 2,
    },
  ];
  const swapData = {
    maker: jane,
    taker: bob,
    transfers,
    seed: common.getCurrentTime(), 
    expiration: common.getCurrentTime() + 600,
  };
  let swapDataTuple = ctx.tuple(swapData);
  const claim = await exchange.methods.getSwapDataClaim(swapDataTuple).call();
  swapData.transfers[0].kind = 0;
  swapDataTuple = ctx.tuple(swapData);
  
  const signature = await ctx.web3.eth.sign(claim, jane);
  const signatureData = {
    r: signature.substr(0, 66),
    s: `0x${signature.substr(66, 64)}`,
    v: parseInt(`0x${signature.substr(130, 2)}`) + 27,
    kind: 0,
  };
  const signatureDataTuple = ctx.tuple(signatureData);

  await cat.methods.approve(nftProxy._address, 1).send({ from: jane });
  await cat.methods.approve(nftProxy._address, 2).send({ from: bob });
  // TODO(Tadej): check revert for code 2004
  await ctx.reverts(() =>exchange.methods.swap(swapDataTuple, signatureDataTuple).send({ from: bob, gas: 4000000 }));
});

fail.test('when trying to perform an already perfomed swap', async (ctx) => {
  const exchange = ctx.get('exchange');
  const nftProxy = ctx.get('nftProxy');
  const jane = ctx.get('jane');
  const bob = ctx.get('bob');
  const cat = ctx.get('cat');

  const transfers = [
    {
      token: cat._address,
      kind: 1,
      from: jane,
      to: bob,
      value: 1,
    },
    {
      token: cat._address,
      kind: 1,
      from: bob,
      to: jane,
      value: 2,
    },
  ];
  const swapData = {
    maker: jane,
    taker: bob,
    transfers,
    seed: common.getCurrentTime(), 
    expiration: common.getCurrentTime() + 600,
  };
  const swapDataTuple = ctx.tuple(swapData);
  const claim = await exchange.methods.getSwapDataClaim(swapDataTuple).call();
  
  const signature = await ctx.web3.eth.sign(claim, jane);
  const signatureData = {
    r: signature.substr(0, 66),
    s: `0x${signature.substr(66, 64)}`,
    v: parseInt(`0x${signature.substr(130, 2)}`) + 27,
    kind: 0,
  };
  const signatureDataTuple = ctx.tuple(signatureData);

  await cat.methods.approve(nftProxy._address, 1).send({ from: jane });
  await cat.methods.approve(nftProxy._address, 2).send({ from: bob });
  await exchange.methods.swap(swapDataTuple, signatureDataTuple).send({ from: bob, gas: 4000000 });
  // TODO(Tadej): check revert for code 2006
   await ctx.reverts(() => exchange.methods.swap(swapDataTuple, signatureDataTuple).send({ from: bob, gas: 4000000 }));
});
