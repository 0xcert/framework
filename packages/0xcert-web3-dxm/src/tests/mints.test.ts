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
  minter?: any;
  tokenProxy?: any;
  mintProxy?: any;
  nftProxy? :any;
  cat?: any;
  dog?: any;
  fox?: any;
  owner?: string;
  bob?: string;
  jane?: string;
  sara?: string;
  zxc?: any;
  bnb?: any;
  id1?: string;
  proof1?: string;
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
  const id = '1';
  const proof = '1e205550c271490347e5e2393a02e94d284bbe9903f023ba098355b8d75974c8';

  ctx.set('id1', id);
  ctx.set('proof1', proof);
});

/**
 * Cat
 */
spec.beforeEach(async (ctx) => {
  const owner = ctx.get('owner');
  const cat = await ctx.deploy({ 
    src: '@0xcert/web3-xcert/build/xcert-mock.json',
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
    src: '@0xcert/web3-xcert/build/xcert-mock.json',
    contract: 'XcertMock',
    args: ['dog', 'DOG', 'http://0xcert.org/', '0xa65de9e6'],
  });
  await dog.instance.methods.assignAbilities(owner, [1]).send();
  await dog.instance.methods
    .mint(jane, 1, 'proof')
    .send({
      from: owner,
    });
  await dog.instance.methods
    .mint(jane, 2, 'proof')
    .send({
      from: owner,
    });
  await dog.instance.methods
    .mint(jane, 3, 'proof')
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
    src: '@0xcert/web3-xcert/build/xcert-mock.json',
    contract: 'XcertMock',
    args: ['fox', 'FOX', 'http://0xcert.org/', '0xa65de9e6'],
  });
  await fox.instance.methods.assignAbilities(owner, [1]).send();
  await fox.instance.methods
  .mint(jane, 1, 'proof')
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
    src: '@0xcert/web3-erc20/build/token-mock.json',
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
    src: '@0xcert/web3-erc20/build/token-mock.json',
    contract: 'TokenMock',
    from: jane
  });
  ctx.set('bnb', bnb);
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
    src: '@0xcert/web3-proxy/build/nftoken-transfer-proxy.json',
    contract: 'NFTokenTransferProxy'
  });
  ctx.set('nftProxy', nftProxy);
});

spec.beforeEach(async (ctx) => {
  const mintProxy = await ctx.deploy({
    src: '@0xcert/web3-proxy/build/xcert-mint-proxy.json',
    contract: 'XcertMintProxy',
  });
  ctx.set('mintProxy', mintProxy);
});

spec.beforeEach(async (ctx) => {
  const mintProxy = ctx.get('mintProxy');
  const minter = await ctx.deploy({
    src: './build/minter.json',
    contract: 'Minter',
    args: [mintProxy.receipt._address],
  });
  ctx.set('minter', minter);
});

spec.beforeEach(async (ctx) => {
  const tokenProxy = ctx.get('tokenProxy');
  const mintProxy = ctx.get('mintProxy');
  const nftProxy = ctx.get('nftProxy');
  const minter = ctx.get('minter');
  const owner = ctx.get('owner');
  await minter.instance.methods.assignAbilities(owner, [1]).send();
  await minter.instance.methods.setProxy(0, tokenProxy.receipt._address).send({ from: owner });
  await minter.instance.methods.setProxy(1, nftProxy.receipt._address).send({ from: owner });
  await tokenProxy.instance.methods.assignAbilities(minter.receipt._address, [1]).send({ from: owner });
  await mintProxy.instance.methods.assignAbilities(minter.receipt._address, [1]).send({ from: owner });
  await nftProxy.instance.methods.assignAbilities(minter.receipt._address, [1]).send({ from: owner });
});

/**
 * Perform mint.
 */

spec.spec('perform an atomic mint', perform);

perform.test('Cat #1', async (ctx) => {
  const minter = ctx.get('minter');
  const mintProxy = ctx.get('mintProxy');
  const jane = ctx.get('jane');
  const owner = ctx.get('owner');
  const cat = ctx.get('cat');
  const id = ctx.get('id1');
  const proof = ctx.get('proof1');

  const xcertData = {
    xcert: cat.receipt._address,
    id,
    proof,
  };
  const transfer = [];
  const mintData = {
    from: owner,
    to: jane,
    xcertData,
    transfer,
    seed: common.getCurrentTime(),
    expirationTimestamp: common.getCurrentTime() + 3600,
  }
  const mintTuple = ctx.tuple(mintData);

  const claim = await minter.instance.methods.getMintDataClaim(mintTuple).call();

  const signature = await ctx.web3.eth.sign(claim, owner);
  const signatureData = {
    r: signature.substr(0, 66),
    s: `0x${signature.substr(66, 64)}`,
    v: parseInt(`0x${signature.substr(130, 2)}`) + 27,
    kind: 0,
  };
  const signatureDataTuple = ctx.tuple(signatureData);

  await cat.instance.methods.assignAbilities(mintProxy.receipt._address, [1]).send({ from: owner });
  const logs = await minter.instance.methods.performMint(mintTuple, signatureDataTuple).send({ from: jane });
  ctx.not(logs.events.PerformMint, undefined);

  const cat1Owner = await cat.instance.methods.ownerOf(1).call();
  ctx.is(cat1Owner, jane);
});

perform.test('5000 ZXC => Cat #1', async (ctx) => {
  const minter = ctx.get('minter');
  const zxc = ctx.get('zxc');
  const mintProxy = ctx.get('mintProxy');
  const tokenProxy = ctx.get('tokenProxy');
  const jane = ctx.get('jane');
  const owner = ctx.get('owner');
  const cat = ctx.get('cat');
  const id = ctx.get('id1');
  const proof = ctx.get('proof1');

  const xcertData = {
    xcert: cat.receipt._address,
    id,
    proof,
  };
  const transfers = [
    {
      token: zxc.receipt._address,
      proxy: 0,
      from: jane,
      to: owner,
      amount: 5000,
    },
  ];
  const mintData = {
    from: owner,
    to: jane,
    xcertData,
    transfers,
    seed: common.getCurrentTime(),
    expirationTimestamp: common.getCurrentTime() + 3600,
  }
  const mintTuple = ctx.tuple(mintData);

  const claim = await minter.instance.methods.getMintDataClaim(mintTuple).call();

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
  const logs = await minter.instance.methods.performMint(mintTuple, signatureDataTuple).send({ from: jane });
  ctx.not(logs.events.PerformMint, undefined);

  const cat1Owner = await cat.instance.methods.ownerOf(1).call();
  ctx.is(cat1Owner, jane);

  const ownerZxcBalance = await zxc.instance.methods.balanceOf(owner).call();
  ctx.is(ownerZxcBalance, "5000");
});

perform.test('5000 ZXC, 100 BNB => Cat #1', async (ctx) => {
  const minter = ctx.get('minter');
  const zxc = ctx.get('zxc');
  const bnb = ctx.get('bnb');
  const mintProxy = ctx.get('mintProxy');
  const tokenProxy = ctx.get('tokenProxy');
  const jane = ctx.get('jane');
  const sara = ctx.get('sara');
  const owner = ctx.get('owner');
  const cat = ctx.get('cat');
  const id = ctx.get('id1');
  const proof = ctx.get('proof1');

  const xcertData = {
    xcert: cat.receipt._address,
    id,
    proof,
  };
  const transfers = [
    {
      token: zxc.receipt._address,
      proxy: 0,
      from: jane,
      to: owner,
      amount: 5000,
    },
    {
      token: bnb.receipt._address,
      proxy: 0,
      from: jane,
      to: sara,
      amount: 100,
    }
  ];
  const mintData = {
    from: owner,
    to: jane,
    xcertData,
    transfers,
    seed: common.getCurrentTime(),
    expirationTimestamp: common.getCurrentTime() + 3600,
  }
  const mintTuple = ctx.tuple(mintData);

  const claim = await minter.instance.methods.getMintDataClaim(mintTuple).call();

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
  const logs = await minter.instance.methods.performMint(mintTuple, signatureDataTuple).send({ from: jane });
  ctx.not(logs.events.PerformMint, undefined);

  const cat1Owner = await cat.instance.methods.ownerOf(1).call();
  ctx.is(cat1Owner, jane);

  const ownerZxcBalance = await zxc.instance.methods.balanceOf(owner).call();
  ctx.is(ownerZxcBalance, "5000");

  const saraBnbBalance = await bnb.instance.methods.balanceOf(sara).call();
  ctx.is(saraBnbBalance, "100");
});

perform.test('Dog #1, Dog #2, Dog #3 => Cat #1', async (ctx) => {
  const minter = ctx.get('minter');
  const mintProxy = ctx.get('mintProxy');
  const nftProxy = ctx.get('nftProxy');
  const jane = ctx.get('jane');
  const owner = ctx.get('owner');
  const cat = ctx.get('cat');
  const dog = ctx.get('dog');
  const id = ctx.get('id1');
  const proof = ctx.get('proof1');

  const xcertData = {
    xcert: cat.receipt._address,
    id,
    proof,
  };
  const transfers = [
    {
      token: dog.receipt._address,
      proxy: 1,
      from: jane,
      to: owner,
      amount: 1,
    },
    {
      token: dog.receipt._address,
      proxy: 1,
      from: jane,
      to: owner,
      amount: 2,
    },
    {
      token: dog.receipt._address,
      proxy: 1,
      from: jane,
      to: owner,
      amount: 3,
    },
  ];
  const mintData = {
    from: owner,
    to: jane,
    xcertData,
    transfers,
    seed: common.getCurrentTime(),
    expirationTimestamp: common.getCurrentTime() + 3600,
  }
  const mintTuple = ctx.tuple(mintData);

  const claim = await minter.instance.methods.getMintDataClaim(mintTuple).call();

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
  const logs = await minter.instance.methods.performMint(mintTuple, signatureDataTuple).send({ from: jane });
  ctx.not(logs.events.PerformMint, undefined);

  const cat1Owner = await cat.instance.methods.ownerOf(1).call();
  ctx.is(cat1Owner, jane);

  const dog1Owner = await dog.instance.methods.ownerOf(1).call();
  ctx.is(dog1Owner, owner);

  const dog2Owner = await dog.instance.methods.ownerOf(2).call();
  ctx.is(dog2Owner, owner);
  
  const dog3Owner = await dog.instance.methods.ownerOf(3).call();
  ctx.is(dog3Owner, owner);
});

perform.test('Dog #1, Dog #2, Dog #3, 10 ZXC => Cat #1', async (ctx) => {
  const minter = ctx.get('minter');
  const mintProxy = ctx.get('mintProxy');
  const nftProxy = ctx.get('nftProxy');
  const tokenProxy = ctx.get('tokenProxy');
  const zxc = ctx.get('zxc');
  const jane = ctx.get('jane');
  const owner = ctx.get('owner');
  const cat = ctx.get('cat');
  const dog = ctx.get('dog');
  const id = ctx.get('id1');
  const proof = ctx.get('proof1');

  const xcertData = {
    xcert: cat.receipt._address,
    id,
    proof,
  };
  const transfers = [
    {
      token: dog.receipt._address,
      proxy: 1,
      from: jane,
      to: owner,
      amount: 1,
    },
    {
      token: dog.receipt._address,
      proxy: 1,
      from: jane,
      to: owner,
      amount: 2,
    },
    {
      token: dog.receipt._address,
      proxy: 1,
      from: jane,
      to: owner,
      amount: 3,
    },
    {
      token: zxc.receipt._address,
      proxy: 0,
      from: jane,
      to: owner,
      amount: 10,
    },
  ];
  const mintData = {
    from: owner,
    to: jane,
    xcertData,
    transfers,
    seed: common.getCurrentTime(),
    expirationTimestamp: common.getCurrentTime() + 3600,
  }
  const mintTuple = ctx.tuple(mintData);

  const claim = await minter.instance.methods.getMintDataClaim(mintTuple).call();

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
  
  const logs = await minter.instance.methods.performMint(mintTuple, signatureDataTuple).send({ from: jane });
  ctx.not(logs.events.PerformMint, undefined);

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
  const minter = ctx.get('minter');
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
  const proof = ctx.get('proof1');

  const xcertData = {
    xcert: cat.receipt._address,
    id,
    proof,
  };
  const transfers = [
    {
      token: dog.receipt._address,
      proxy: 1,
      from: jane,
      to: owner,
      amount: 1,
    },
    {
      token: fox.receipt._address,
      proxy: 1,
      from: jane,
      to: owner,
      amount: 1,
    },
    {
      token: zxc.receipt._address,
      proxy: 0,
      from: jane,
      to: owner,
      amount: 10,
    },
  ];
  const mintData = {
    from: owner,
    to: jane,
    xcertData,
    transfers,
    seed: common.getCurrentTime(),
    expirationTimestamp: common.getCurrentTime() + 3600,
  }
  const mintTuple = ctx.tuple(mintData);

  const claim = await minter.instance.methods.getMintDataClaim(mintTuple).call();

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
  
  const logs = await minter.instance.methods.performMint(mintTuple, signatureDataTuple).send({ from: jane });
  ctx.not(logs.events.PerformMint, undefined);

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
  const minter = ctx.get('minter');
  const zxc = ctx.get('zxc');
  const mintProxy = ctx.get('mintProxy');
  const tokenProxy = ctx.get('tokenProxy');
  const jane = ctx.get('jane');
  const sara = ctx.get('sara');
  const owner = ctx.get('owner');
  const cat = ctx.get('cat');
  const id = ctx.get('id1');
  const proof = ctx.get('proof1');

  const xcertData = {
    xcert: cat.receipt._address,
    id,
    proof,
  };
  const transfers = [
    {
      token: zxc.receipt._address,
      proxy: 0,
      from: jane,
      to: owner,
      amount: 5000,
    },
  ];
  const mintData = {
    from: owner,
    to: jane,
    xcertData,
    transfers,
    seed: common.getCurrentTime(),
    expirationTimestamp: common.getCurrentTime() + 3600,
  }
  const mintTuple = ctx.tuple(mintData);

  const claim = await minter.instance.methods.getMintDataClaim(mintTuple).call();

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
  await ctx.reverts(() => minter.instance.methods.performMint(mintTuple, signatureDataTuple).send({ from: sara }), '016004');
});

perform.test('fails when trying to perform already performed mint', async (ctx) => {
  const minter = ctx.get('minter');
  const zxc = ctx.get('zxc');
  const mintProxy = ctx.get('mintProxy');
  const tokenProxy = ctx.get('tokenProxy');
  const jane = ctx.get('jane');
  const owner = ctx.get('owner');
  const cat = ctx.get('cat');
  const id = ctx.get('id1');
  const proof = ctx.get('proof1');

  const xcertData = {
    xcert: cat.receipt._address,
    id,
    proof,
  };
  const transfers = [
    {
      token: zxc.receipt._address,
      proxy: 0,
      from: jane,
      to: owner,
      amount: 5000,
    },
  ];
  const mintData = {
    from: owner,
    to: jane,
    xcertData,
    transfers,
    seed: common.getCurrentTime(),
    expirationTimestamp: common.getCurrentTime() + 3600,
  }
  const mintTuple = ctx.tuple(mintData);

  const claim = await minter.instance.methods.getMintDataClaim(mintTuple).call();

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
  await minter.instance.methods.performMint(mintTuple, signatureDataTuple).send({ from: jane });
  await ctx.reverts(() => minter.instance.methods.performMint(mintTuple, signatureDataTuple).send({ from: jane }), '016009');
});

perform.test('fails when approved token amount is not sufficient', async (ctx) => {
  const minter = ctx.get('minter');
  const zxc = ctx.get('zxc');
  const mintProxy = ctx.get('mintProxy');
  const tokenProxy = ctx.get('tokenProxy');
  const jane = ctx.get('jane');
  const owner = ctx.get('owner');
  const cat = ctx.get('cat');
  const id = ctx.get('id1');
  const proof = ctx.get('proof1');

  const xcertData = {
    xcert: cat.receipt._address,
    id,
    proof,
  };
  const transfers = [
    {
      token: zxc.receipt._address,
      proxy: 0,
      from: jane,
      to: owner,
      amount: 5000,
    },
  ];
  const mintData = {
    from: owner,
    to: jane,
    xcertData,
    transfers,
    seed: common.getCurrentTime(),
    expirationTimestamp: common.getCurrentTime() + 3600,
  }
  const mintTuple = ctx.tuple(mintData);

  const claim = await minter.instance.methods.getMintDataClaim(mintTuple).call();

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
  await ctx.reverts(() => minter.instance.methods.performMint(mintTuple, signatureDataTuple).send({ from: jane }), '001003');
});

perform.test('fails when proxy does not have the mint rights', async (ctx) => {
  const minter = ctx.get('minter');
  const zxc = ctx.get('zxc');
  const tokenProxy = ctx.get('tokenProxy');
  const jane = ctx.get('jane');
  const owner = ctx.get('owner');
  const cat = ctx.get('cat');
  const id = ctx.get('id1');
  const proof = ctx.get('proof1');

  const xcertData = {
    xcert: cat.receipt._address,
    id,
    proof,
  };
  const transfers = [
    {
      token: zxc.receipt._address,
      proxy: 0,
      from: jane,
      to: owner,
      amount: 5000,
    },
  ];
  const mintData = {
    from: owner,
    to: jane,
    xcertData,
    transfers,
    seed: common.getCurrentTime(),
    expirationTimestamp: common.getCurrentTime() + 3600,
  }
  const mintTuple = ctx.tuple(mintData);

  const claim = await minter.instance.methods.getMintDataClaim(mintTuple).call();

  const signature = await ctx.web3.eth.sign(claim, owner);
  const signatureData = {
    r: signature.substr(0, 66),
    s: `0x${signature.substr(66, 64)}`,
    v: parseInt(`0x${signature.substr(130, 2)}`) + 27,
    kind: 0,
  };
  const signatureDataTuple = ctx.tuple(signatureData);

  await zxc.instance.methods.approve(tokenProxy.receipt._address, 5000).send({ from: jane });
  await ctx.reverts(() => minter.instance.methods.performMint(mintTuple, signatureDataTuple).send({ from: jane }), '017001');
});

perform.test('fails if current time is after expirationTimestamp', async (ctx) => {
  const minter = ctx.get('minter');
  const zxc = ctx.get('zxc');
  const mintProxy = ctx.get('mintProxy');
  const tokenProxy = ctx.get('tokenProxy');
  const jane = ctx.get('jane');
  const owner = ctx.get('owner');
  const cat = ctx.get('cat');
  const id = ctx.get('id1');
  const proof = ctx.get('proof1');

  const xcertData = {
    xcert: cat.receipt._address,
    id,
    proof,
  };
  const transfers = [
    {
      token: zxc.receipt._address,
      proxy: 0,
      from: jane,
      to: owner,
      amount: 5000,
    },
  ];
  const mintData = {
    from: owner,
    to: jane,
    xcertData,
    transfers,
    seed: common.getCurrentTime(),
    expirationTimestamp: common.getCurrentTime() - 1000,
  }
  const mintTuple = ctx.tuple(mintData);

  const claim = await minter.instance.methods.getMintDataClaim(mintTuple).call();

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
  await ctx.reverts(() => minter.instance.methods.performMint(mintTuple, signatureDataTuple).send({ from: jane }), '016006');
});


/**
 * Cancel mint.
 */

spec.spec('cancel an atomic mint', cancel);

cancel.test('succeeds', async (ctx) => {
  const minter = ctx.get('minter');
  const zxc = ctx.get('zxc');
  const mintProxy = ctx.get('mintProxy');
  const tokenProxy = ctx.get('tokenProxy');
  const jane = ctx.get('jane');
  const owner = ctx.get('owner');
  const cat = ctx.get('cat');
  const id = ctx.get('id1');
  const proof = ctx.get('proof1');

  const xcertData = {
    xcert: cat.receipt._address,
    id,
    proof,
  };
  const transfers = [
    {
      token: zxc.receipt._address,
      proxy: 0,
      from: jane,
      to: owner,
      amount: 5000,
    },
  ];
  const mintData = {
    from: owner,
    to: jane,
    xcertData,
    transfers,
    seed: common.getCurrentTime(),
    expirationTimestamp: common.getCurrentTime() + 3600,
  }
  const mintTuple = ctx.tuple(mintData);

  const claim = await minter.instance.methods.getMintDataClaim(mintTuple).call();

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
  const logs = await minter.instance.methods.cancelMint(mintTuple).send({ from: owner });
  ctx.not(logs.events.CancelMint, undefined);
  await ctx.reverts(() => minter.instance.methods.performMint(mintTuple, signatureDataTuple).send({ from: jane }), '016008');
});

cancel.test('fails when a third party tries to cancel it', async (ctx) => {
  const minter = ctx.get('minter');
  const zxc = ctx.get('zxc');
  const jane = ctx.get('jane');
  const owner = ctx.get('owner');
  const cat = ctx.get('cat');
  const id = ctx.get('id1');
  const proof = ctx.get('proof1');

  const xcertData = {
    xcert: cat.receipt._address,
    id,
    proof,
  };
  const transfers = [
    {
      token: zxc.receipt._address,
      proxy: 0,
      from: jane,
      to: owner,
      amount: 5000,
    },
  ];
  const mintData = {
    from: owner,
    to: jane,
    xcertData,
    transfers,
    seed: common.getCurrentTime(),
    expirationTimestamp: common.getCurrentTime() + 3600,
  }
  const mintTuple = ctx.tuple(mintData);

  await ctx.reverts(() => minter.instance.methods.cancelMint(mintTuple).send({ from: jane }), '016010');
});

cancel.test('fails when trying to cancel an already performed mint', async (ctx) => {
  const minter = ctx.get('minter');
  const zxc = ctx.get('zxc');
  const mintProxy = ctx.get('mintProxy');
  const tokenProxy = ctx.get('tokenProxy');
  const jane = ctx.get('jane');
  const owner = ctx.get('owner');
  const cat = ctx.get('cat');
  const id = ctx.get('id1');
  const proof = ctx.get('proof1');

  const xcertData = {
    xcert: cat.receipt._address,
    id,
    proof,
  };
  const transfers = [
    {
      token: zxc.receipt._address,
      proxy: 0,
      from: jane,
      to: owner,
      amount: 5000,
    },
  ];
  const mintData = {
    from: owner,
    to: jane,
    xcertData,
    transfers,
    seed: common.getCurrentTime(),
    expirationTimestamp: common.getCurrentTime() + 3600,
  }
  const mintTuple = ctx.tuple(mintData);

  const claim = await minter.instance.methods.getMintDataClaim(mintTuple).call();

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
  await minter.instance.methods.performMint(mintTuple, signatureDataTuple).send({ from: jane });
  await ctx.reverts(() =>minter.instance.methods.cancelMint(mintTuple).send({ from: owner }), '016009');
});