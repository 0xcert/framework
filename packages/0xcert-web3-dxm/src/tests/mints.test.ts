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
  cat?: any;
  owner?: string;
  bob?: string;
  jane?: string;
  sara?: string;
  zxc?: any;
  bnb?: any;
  id1?: string;
  url1?: string;
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
  const uri = "http://0xcert.org/1";
  const proof = '1e205550c271490347e5e2393a02e94d284bbe9903f023ba098355b8d75974c8';

  ctx.set('id1', id);
  ctx.set('url1', uri);
  ctx.set('proof1', proof);
});

/**
 * Cat
 */
spec.beforeEach(async (ctx) => {
  const cat = await ctx.deploy({ 
    src: '@0xcert/web3-xcert/build/xcert-mock.json',
    contract: 'XcertMock',
    args: ['cat', 'CAT', '0xa65de9e6'],
  });
  ctx.set('cat', cat);
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
    args: [mintProxy._address],
  });
  ctx.set('minter', minter);
});

spec.beforeEach(async (ctx) => {
  const tokenProxy = ctx.get('tokenProxy');
  const mintProxy = ctx.get('mintProxy');
  const minter = ctx.get('minter');
  const owner = ctx.get('owner');
  await minter.methods.setProxy(0, tokenProxy._address).send({ from: owner });
  await tokenProxy.methods.addAuthorizedAddress(minter._address).send({ from: owner });
  await mintProxy.methods.addAuthorizedAddress(minter._address).send({ from: owner });
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
  const uri = ctx.get('url1');
  const proof = ctx.get('proof1');

  const xcertData = {
    xcert: cat._address,
    id,
    uri,
    proof,
  };
  const transfer = [];
  const mintData = {
    to: jane,
    xcertData,
    transfer,
    seed: common.getCurrentTime(),
    expirationTimestamp: common.getCurrentTime() + 3600,
  }
  const mintTuple = ctx.tuple(mintData);

  const claim = await minter.methods.getMintDataClaim(mintTuple).call();

  const signature = await ctx.web3.eth.sign(claim, owner);
  const signatureData = {
    r: signature.substr(0, 66),
    s: `0x${signature.substr(66, 64)}`,
    v: parseInt(`0x${signature.substr(130, 2)}`) + 27,
    kind: 0,
  };
  const signatureDataTuple = ctx.tuple(signatureData);

  await cat.methods.setAuthorizedAddress(mintProxy._address, true).send({ from: owner });
  const logs = await minter.methods.performMint(mintTuple, signatureDataTuple).send({ from: jane });
  ctx.not(logs.events.PerformMint, undefined);

  const cat1Owner = await cat.methods.ownerOf(1).call();
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
  const uri = ctx.get('url1');
  const proof = ctx.get('proof1');

  const xcertData = {
    xcert: cat._address,
    id,
    uri,
    proof,
  };
  const transfers = [
    {
      token: zxc._address,
      proxy: 0,
      from: jane,
      to: owner,
      amount: 5000,
    },
  ];
  const mintData = {
    to: jane,
    xcertData,
    transfers,
    seed: common.getCurrentTime(),
    expirationTimestamp: common.getCurrentTime() + 3600,
  }
  const mintTuple = ctx.tuple(mintData);

  const claim = await minter.methods.getMintDataClaim(mintTuple).call();

  const signature = await ctx.web3.eth.sign(claim, owner);
  const signatureData = {
    r: signature.substr(0, 66),
    s: `0x${signature.substr(66, 64)}`,
    v: parseInt(`0x${signature.substr(130, 2)}`) + 27,
    kind: 0,
  };
  const signatureDataTuple = ctx.tuple(signatureData);

  await cat.methods.setAuthorizedAddress(mintProxy._address, true).send({ from: owner });
  await zxc.methods.approve(tokenProxy._address, 5000).send({ from: jane });
  const logs = await minter.methods.performMint(mintTuple, signatureDataTuple).send({ from: jane });
  ctx.not(logs.events.PerformMint, undefined);

  const cat1Owner = await cat.methods.ownerOf(1).call();
  ctx.is(cat1Owner, jane);

  const ownerZxcBalance = await zxc.methods.balanceOf(owner).call();
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
  const uri = ctx.get('url1');
  const proof = ctx.get('proof1');

  const xcertData = {
    xcert: cat._address,
    id,
    uri,
    proof,
  };
  const transfers = [
    {
      token: zxc._address,
      proxy: 0,
      from: jane,
      to: owner,
      amount: 5000,
    },
    {
      token: bnb._address,
      proxy: 0,
      from: jane,
      to: sara,
      amount: 100,
    }
  ];
  const mintData = {
    to: jane,
    xcertData,
    transfers,
    seed: common.getCurrentTime(),
    expirationTimestamp: common.getCurrentTime() + 3600,
  }
  const mintTuple = ctx.tuple(mintData);

  const claim = await minter.methods.getMintDataClaim(mintTuple).call();

  const signature = await ctx.web3.eth.sign(claim, owner);
  const signatureData = {
    r: signature.substr(0, 66),
    s: `0x${signature.substr(66, 64)}`,
    v: parseInt(`0x${signature.substr(130, 2)}`) + 27,
    kind: 0,
  };
  const signatureDataTuple = ctx.tuple(signatureData);

  await cat.methods.setAuthorizedAddress(mintProxy._address, true).send({ from: owner });
  await zxc.methods.approve(tokenProxy._address, 5000).send({ from: jane });
  await bnb.methods.approve(tokenProxy._address, 100).send({ from: jane });
  const logs = await minter.methods.performMint(mintTuple, signatureDataTuple).send({ from: jane });
  ctx.not(logs.events.PerformMint, undefined);

  const cat1Owner = await cat.methods.ownerOf(1).call();
  ctx.is(cat1Owner, jane);

  const ownerZxcBalance = await zxc.methods.balanceOf(owner).call();
  ctx.is(ownerZxcBalance, "5000");

  const saraBnbBalance = await bnb.methods.balanceOf(sara).call();
  ctx.is(saraBnbBalance, "100");
});

perform.test('Dog #1, Dog #2, Dog #3 => Cat #1', async (ctx) => {
  
});

perform.test('Dog #1, Dog #2, Dog #3, 10 ZXC => Cat #1', async (ctx) => {
  
});

perform.test('Dog #1, Fox #7, 10 ZXC => Cat #1', async (ctx) => {
  
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
  const uri = ctx.get('url1');
  const proof = ctx.get('proof1');

  const xcertData = {
    xcert: cat._address,
    id,
    uri,
    proof,
  };
  const transfers = [
    {
      token: zxc._address,
      proxy: 0,
      from: jane,
      to: owner,
      amount: 5000,
    },
  ];
  const mintData = {
    to: jane,
    xcertData,
    transfers,
    seed: common.getCurrentTime(),
    expirationTimestamp: common.getCurrentTime() + 3600,
  }
  const mintTuple = ctx.tuple(mintData);

  const claim = await minter.methods.getMintDataClaim(mintTuple).call();

  const signature = await ctx.web3.eth.sign(claim, owner);
  const signatureData = {
    r: signature.substr(0, 66),
    s: `0x${signature.substr(66, 64)}`,
    v: parseInt(`0x${signature.substr(130, 2)}`) + 27,
    kind: 0,
  };
  const signatureDataTuple = ctx.tuple(signatureData);

  await cat.methods.setAuthorizedAddress(mintProxy._address, true).send({ from: owner });
  await zxc.methods.approve(tokenProxy._address, 5000).send({ from: jane });
  await ctx.reverts(() => minter.methods.performMint(mintTuple, signatureDataTuple).send({ from: sara }), '016004');
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
  const uri = ctx.get('url1');
  const proof = ctx.get('proof1');

  const xcertData = {
    xcert: cat._address,
    id,
    uri,
    proof,
  };
  const transfers = [
    {
      token: zxc._address,
      proxy: 0,
      from: jane,
      to: owner,
      amount: 5000,
    },
  ];
  const mintData = {
    to: jane,
    xcertData,
    transfers,
    seed: common.getCurrentTime(),
    expirationTimestamp: common.getCurrentTime() + 3600,
  }
  const mintTuple = ctx.tuple(mintData);

  const claim = await minter.methods.getMintDataClaim(mintTuple).call();

  const signature = await ctx.web3.eth.sign(claim, owner);
  const signatureData = {
    r: signature.substr(0, 66),
    s: `0x${signature.substr(66, 64)}`,
    v: parseInt(`0x${signature.substr(130, 2)}`) + 27,
    kind: 0,
  };
  const signatureDataTuple = ctx.tuple(signatureData);

  await cat.methods.setAuthorizedAddress(mintProxy._address, true).send({ from: owner });
  await zxc.methods.approve(tokenProxy._address, 5000).send({ from: jane });
  await minter.methods.performMint(mintTuple, signatureDataTuple).send({ from: jane });
  await ctx.reverts(() => minter.methods.performMint(mintTuple, signatureDataTuple).send({ from: jane }), '016009');
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
  const uri = ctx.get('url1');
  const proof = ctx.get('proof1');

  const xcertData = {
    xcert: cat._address,
    id,
    uri,
    proof,
  };
  const transfers = [
    {
      token: zxc._address,
      proxy: 0,
      from: jane,
      to: owner,
      amount: 5000,
    },
  ];
  const mintData = {
    to: jane,
    xcertData,
    transfers,
    seed: common.getCurrentTime(),
    expirationTimestamp: common.getCurrentTime() + 3600,
  }
  const mintTuple = ctx.tuple(mintData);

  const claim = await minter.methods.getMintDataClaim(mintTuple).call();

  const signature = await ctx.web3.eth.sign(claim, owner);
  const signatureData = {
    r: signature.substr(0, 66),
    s: `0x${signature.substr(66, 64)}`,
    v: parseInt(`0x${signature.substr(130, 2)}`) + 27,
    kind: 0,
  };
  const signatureDataTuple = ctx.tuple(signatureData);

  await cat.methods.setAuthorizedAddress(mintProxy._address, true).send({ from: owner });
  await zxc.methods.approve(tokenProxy._address, 4999).send({ from: jane });
  await ctx.reverts(() => minter.methods.performMint(mintTuple, signatureDataTuple).send({ from: jane }), '001003');
});

perform.test('fails when proxy does not have the mint rights', async (ctx) => {
  const minter = ctx.get('minter');
  const zxc = ctx.get('zxc');
  const tokenProxy = ctx.get('tokenProxy');
  const jane = ctx.get('jane');
  const owner = ctx.get('owner');
  const cat = ctx.get('cat');
  const id = ctx.get('id1');
  const uri = ctx.get('url1');
  const proof = ctx.get('proof1');

  const xcertData = {
    xcert: cat._address,
    id,
    uri,
    proof,
  };
  const transfers = [
    {
      token: zxc._address,
      proxy: 0,
      from: jane,
      to: owner,
      amount: 5000,
    },
  ];
  const mintData = {
    to: jane,
    xcertData,
    transfers,
    seed: common.getCurrentTime(),
    expirationTimestamp: common.getCurrentTime() + 3600,
  }
  const mintTuple = ctx.tuple(mintData);

  const claim = await minter.methods.getMintDataClaim(mintTuple).call();

  const signature = await ctx.web3.eth.sign(claim, owner);
  const signatureData = {
    r: signature.substr(0, 66),
    s: `0x${signature.substr(66, 64)}`,
    v: parseInt(`0x${signature.substr(130, 2)}`) + 27,
    kind: 0,
  };
  const signatureDataTuple = ctx.tuple(signatureData);

  await zxc.methods.approve(tokenProxy._address, 5000).send({ from: jane });
  await ctx.reverts(() => minter.methods.performMint(mintTuple, signatureDataTuple).send({ from: jane }), '007001');
});

perform.test('fails when to and the owner addresses are the same', async (ctx) => {
  const minter = ctx.get('minter');
  const mintProxy = ctx.get('mintProxy');
  const owner = ctx.get('owner');
  const cat = ctx.get('cat');
  const id = ctx.get('id1');
  const uri = ctx.get('url1');
  const proof = ctx.get('proof1');

  const xcertData = {
    xcert: cat._address,
    id,
    uri,
    proof,
  };
  const transfers = [];
  const mintData = {
    to: owner,
    xcertData,
    transfers,
    seed: common.getCurrentTime(),
    expirationTimestamp: common.getCurrentTime() + 3600,
  }
  const mintTuple = ctx.tuple(mintData);

  const claim = await minter.methods.getMintDataClaim(mintTuple).call();

  const signature = await ctx.web3.eth.sign(claim, owner);
  const signatureData = {
    r: signature.substr(0, 66),
    s: `0x${signature.substr(66, 64)}`,
    v: parseInt(`0x${signature.substr(130, 2)}`) + 27,
    kind: 0,
  };
  const signatureDataTuple = ctx.tuple(signatureData);

  await cat.methods.setAuthorizedAddress(mintProxy._address, true).send({ from: owner });
  await ctx.reverts(() => minter.methods.performMint(mintTuple, signatureDataTuple).send({ from: owner }), '016005');
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
  const uri = ctx.get('url1');
  const proof = ctx.get('proof1');

  const xcertData = {
    xcert: cat._address,
    id,
    uri,
    proof,
  };
  const transfers = [
    {
      token: zxc._address,
      proxy: 0,
      from: jane,
      to: owner,
      amount: 5000,
    },
  ];
  const mintData = {
    to: jane,
    xcertData,
    transfers,
    seed: common.getCurrentTime(),
    expirationTimestamp: common.getCurrentTime() - 1000,
  }
  const mintTuple = ctx.tuple(mintData);

  const claim = await minter.methods.getMintDataClaim(mintTuple).call();

  const signature = await ctx.web3.eth.sign(claim, owner);
  const signatureData = {
    r: signature.substr(0, 66),
    s: `0x${signature.substr(66, 64)}`,
    v: parseInt(`0x${signature.substr(130, 2)}`) + 27,
    kind: 0,
  };
  const signatureDataTuple = ctx.tuple(signatureData);

  await cat.methods.setAuthorizedAddress(mintProxy._address, true).send({ from: owner });
  await zxc.methods.approve(tokenProxy._address, 5000).send({ from: jane });
  await ctx.reverts(() => minter.methods.performMint(mintTuple, signatureDataTuple).send({ from: jane }), '016006');
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
  const uri = ctx.get('url1');
  const proof = ctx.get('proof1');

  const xcertData = {
    xcert: cat._address,
    id,
    uri,
    proof,
  };
  const transfers = [
    {
      token: zxc._address,
      proxy: 0,
      from: jane,
      to: owner,
      amount: 5000,
    },
  ];
  const mintData = {
    to: jane,
    xcertData,
    transfers,
    seed: common.getCurrentTime(),
    expirationTimestamp: common.getCurrentTime() + 3600,
  }
  const mintTuple = ctx.tuple(mintData);

  const claim = await minter.methods.getMintDataClaim(mintTuple).call();

  const signature = await ctx.web3.eth.sign(claim, owner);
  const signatureData = {
    r: signature.substr(0, 66),
    s: `0x${signature.substr(66, 64)}`,
    v: parseInt(`0x${signature.substr(130, 2)}`) + 27,
    kind: 0,
  };
  const signatureDataTuple = ctx.tuple(signatureData);

  await cat.methods.setAuthorizedAddress(mintProxy._address, true).send({ from: owner });
  await zxc.methods.approve(tokenProxy._address, 5000).send({ from: jane });
  const logs = await minter.methods.cancelMint(mintTuple).send({ from: owner });
  ctx.not(logs.events.CancelMint, undefined);
  await ctx.reverts(() => minter.methods.performMint(mintTuple, signatureDataTuple).send({ from: jane }), '016008');
});

cancel.test('fails when a third party tries to cancel it', async (ctx) => {
  const minter = ctx.get('minter');
  const zxc = ctx.get('zxc');
  const jane = ctx.get('jane');
  const owner = ctx.get('owner');
  const cat = ctx.get('cat');
  const id = ctx.get('id1');
  const uri = ctx.get('url1');
  const proof = ctx.get('proof1');

  const xcertData = {
    xcert: cat._address,
    id,
    uri,
    proof,
  };
  const transfers = [
    {
      token: zxc._address,
      proxy: 0,
      from: jane,
      to: owner,
      amount: 5000,
    },
  ];
  const mintData = {
    to: jane,
    xcertData,
    transfers,
    seed: common.getCurrentTime(),
    expirationTimestamp: common.getCurrentTime() + 3600,
  }
  const mintTuple = ctx.tuple(mintData);

  await ctx.reverts(() => minter.methods.cancelMint(mintTuple).send({ from: jane }), '016010');
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
  const uri = ctx.get('url1');
  const proof = ctx.get('proof1');

  const xcertData = {
    xcert: cat._address,
    id,
    uri,
    proof,
  };
  const transfers = [
    {
      token: zxc._address,
      proxy: 0,
      from: jane,
      to: owner,
      amount: 5000,
    },
  ];
  const mintData = {
    to: jane,
    xcertData,
    transfers,
    seed: common.getCurrentTime(),
    expirationTimestamp: common.getCurrentTime() + 3600,
  }
  const mintTuple = ctx.tuple(mintData);

  const claim = await minter.methods.getMintDataClaim(mintTuple).call();

  const signature = await ctx.web3.eth.sign(claim, owner);
  const signatureData = {
    r: signature.substr(0, 66),
    s: `0x${signature.substr(66, 64)}`,
    v: parseInt(`0x${signature.substr(130, 2)}`) + 27,
    kind: 0,
  };
  const signatureDataTuple = ctx.tuple(signatureData);

  await cat.methods.setAuthorizedAddress(mintProxy._address, true).send({ from: owner });
  await zxc.methods.approve(tokenProxy._address, 5000).send({ from: jane });
  await minter.methods.performMint(mintTuple, signatureDataTuple).send({ from: jane });
  await ctx.reverts(() =>minter.methods.cancelMint(mintTuple).send({ from: owner }), '016009');
});