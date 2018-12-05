import { Spec } from '@specron/spec';
import { Protocol } from '@0xcert/ethereum-sandbox';
import { ProviderIssue } from '@0xcert/scaffold';
import { parseError } from '../../..';

interface Data {
  protocol: Protocol;
  owner: string;
  bob: string;
  jane: string;
  zeroAddress: string;
}

const spec = new Spec<Data>();

spec.before(async (stage) => {
  const accounts = await stage.web3.eth.getAccounts();
  stage.set('owner', accounts[0]);
  stage.set('bob', accounts[1]);
  stage.set('jane', accounts[2]);
  stage.set('zeroAddress', '0x0000000000000000000000000000000000000000');
});

spec.before(async (stage) => {
  const protocol = new Protocol(stage.web3);
  stage.set('protocol', await protocol.deploy());
});

spec.before(async (stage) => {
  const erc721 = stage.get('protocol').erc721;
  const erc721Metadata = stage.get('protocol').erc721Metadata;
  const erc721Enumerable = stage.get('protocol').erc721Enumerable;
  const burnableXcert = stage.get('protocol').xcertBurnable;
  const owner = stage.get('owner');
  const jane = stage.get('jane');
  await erc721.instance.methods.mint(jane, '123').send({ from: owner });
  await erc721Metadata.instance.methods.mint(jane, '123').send({ from: owner });
  await erc721Enumerable.instance.methods.mint(jane, '123').send({ from: owner });
  await burnableXcert.instance.methods.mint(jane, '123', '0x0').send({ from: owner });
});

spec.test('correctly throws ZERO_ADDRESS error', async (ctx) => {
  const erc721 = ctx.get('protocol').erc721;
  const erc721Metadata = ctx.get('protocol').erc721Metadata;
  const erc721Enumerable = ctx.get('protocol').erc721Enumerable;
  const zeroAddress = ctx.get('zeroAddress');
  await erc721.instance.methods.balanceOf(zeroAddress).call()
  .then(() => { ctx.fail(); })
  .catch((e) => {
    ctx.is(parseError(e).issue, ProviderIssue.ZERO_ADDRESS);
  });
  await erc721Metadata.instance.methods.balanceOf(zeroAddress).call()
  .then(() => { ctx.fail(); })
  .catch((e) => {
    ctx.is(parseError(e).issue, ProviderIssue.ZERO_ADDRESS);
  });
  await erc721Enumerable.instance.methods.balanceOf(zeroAddress).call()
  .then(() => { ctx.fail(); })
  .catch((e) => {
    ctx.is(parseError(e).issue, ProviderIssue.ZERO_ADDRESS);
  });
});

spec.test('correctly throws INVALID_NFT error', async (ctx) => {
  const erc721 = ctx.get('protocol').erc721;
  const erc721Metadata = ctx.get('protocol').erc721Metadata;
  const erc721Enumerable = ctx.get('protocol').erc721Enumerable;
  const mutableXcert = ctx.get('protocol').xcertMutable;
  const owner = ctx.get('owner');
  await erc721.instance.methods.ownerOf('2').call()
  .then(() => { ctx.fail(); })
  .catch((e) => {
    ctx.is(parseError(e).issue, ProviderIssue.INVALID_NFT);
  });
  await erc721Metadata.instance.methods.ownerOf('2').call()
  .then(() => { ctx.fail(); })
  .catch((e) => {
    ctx.is(parseError(e).issue, ProviderIssue.INVALID_NFT);
  });
  await erc721Enumerable.instance.methods.ownerOf('2').call()
  .then(() => { ctx.fail(); })
  .catch((e) => {
    ctx.is(parseError(e).issue, ProviderIssue.INVALID_NFT);
  });
  await mutableXcert.instance.methods.updateTokenImprint('1','0x973124ffc4a03e66d6a4458e587d5d6146f71fc57f359c8d516e0b12a50ab0d9')
  .call({ from: owner })
  .then(() => { ctx.fail(); })
  .catch((e) => {
    ctx.is(parseError(e).issue, ProviderIssue.INVALID_NFT);
  });
});

spec.test('correctly throws NOT_AUTHORIZED error', async (ctx) => {
  const erc721 = ctx.get('protocol').erc721;
  const erc721Metadata = ctx.get('protocol').erc721Metadata;
  const erc721Enumerable = ctx.get('protocol').erc721Enumerable;
  const burnableXcert = ctx.get('protocol').xcertBurnable;
  const xcert = ctx.get('protocol').xcert;
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const jane = ctx.get('jane');

  await erc721.instance.methods.approve(bob, '2').call({ from: owner })
  .then(() => { ctx.fail(); })
  .catch((e) => {
    ctx.is(parseError(e).issue, ProviderIssue.NOT_AUTHORIZED);
  });
  await erc721Metadata.instance.methods.approve(bob, '2').call({ from: owner })
  .then(() => { ctx.fail(); })
  .catch((e) => {
    ctx.is(parseError(e).issue, ProviderIssue.NOT_AUTHORIZED);
  });
  await erc721Enumerable.instance.methods.approve(bob, '2').call({ from: owner })
  .then(() => { ctx.fail(); })
  .catch((e) => {
    ctx.is(parseError(e).issue, ProviderIssue.NOT_AUTHORIZED);
  });
  await erc721.instance.methods.transferFrom(jane, bob, '123').call({ from: bob })
  .then(() => { ctx.fail(); })
  .catch((e) => {
    ctx.is(parseError(e).issue, ProviderIssue.NOT_AUTHORIZED);
  });
  await erc721Metadata.instance.methods.transferFrom(jane, bob, '123').call({ from: bob })
  .then(() => { ctx.fail(); })
  .catch((e) => {
    ctx.is(parseError(e).issue, ProviderIssue.NOT_AUTHORIZED);
  });
  await erc721Enumerable.instance.methods.transferFrom(jane, bob, '123').call({ from: bob })
  .then(() => { ctx.fail(); })
  .catch((e) => {
    ctx.is(parseError(e).issue, ProviderIssue.NOT_AUTHORIZED);
  });
  await burnableXcert.instance.methods.burn('123').call({ from: bob })
  .then(() => { ctx.fail(); })
  .catch((e) => {
    ctx.is(parseError(e).issue, ProviderIssue.NOT_AUTHORIZED);
  });
  await xcert.instance.methods.assignAbilities(bob, [0]).call({from: bob})
  .then(() => { ctx.fail(); })
  .catch((e) => {
    ctx.is(parseError(e).issue, ProviderIssue.NOT_AUTHORIZED);
  });
});

// TODO: For some reason the revert happens on another level so is throws a general revert. 
spec.test('correctly throws RECEIVER_DOES_NOT_SUPPORT_NFT error', async (ctx) => {
  const erc721 = ctx.get('protocol').erc721;
  const erc721Metadata = ctx.get('protocol').erc721Metadata;
  const erc721Enumerable = ctx.get('protocol').erc721Enumerable;
  const jane = ctx.get('jane');

  await erc721.instance.methods.safeTransferFrom(jane, erc721.instance._address, '123').call({ from: jane })
  .then(() => { ctx.fail(); })
  .catch((e) => {
    ctx.is(parseError(e).issue, ProviderIssue.GENERAL_REVERT);
  });
  await erc721Metadata.instance.methods.safeTransferFrom(jane, erc721.instance._address, '123').call({ from: jane })
  .then(() => { ctx.fail(); })
  .catch((e) => {
    ctx.is(parseError(e).issue, ProviderIssue.GENERAL_REVERT);
  });
  await erc721Enumerable.instance.methods.safeTransferFrom(jane, erc721.instance._address, '123').call({ from: jane })
  .then(() => { ctx.fail(); })
  .catch((e) => {
    ctx.is(parseError(e).issue, ProviderIssue.GENERAL_REVERT);
  });
});

spec.test('correctly throws NFT_ALREADY_EXISTS error', async (ctx) => {
  const erc721 = ctx.get('protocol').erc721;
  const erc721Metadata = ctx.get('protocol').erc721Metadata;
  const erc721Enumerable = ctx.get('protocol').erc721Enumerable;
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  await erc721.instance.methods.mint(bob, '123').call({ from: owner })
  .then(() => { ctx.fail(); })
  .catch((e) => {
    ctx.is(parseError(e).issue, ProviderIssue.NFT_ALREADY_EXISTS);
  });
  await erc721Metadata.instance.methods.mint(bob, '123').call({ from: owner })
  .then(() => { ctx.fail(); })
  .catch((e) => {
    ctx.is(parseError(e).issue, ProviderIssue.NFT_ALREADY_EXISTS);
  });
  await erc721Enumerable.instance.methods.mint(bob, '123').call({ from: owner })
  .then(() => { ctx.fail(); })
  .catch((e) => {
    ctx.is(parseError(e).issue, ProviderIssue.NFT_ALREADY_EXISTS);
  });
});

spec.test('correctly throws INVALID_INDEX error', async (ctx) => {
  const erc721Enumerable = ctx.get('protocol').erc721Enumerable;
  const owner = ctx.get('owner');
  await erc721Enumerable.instance.methods.tokenByIndex(2).call()
  .then(() => { ctx.fail(); })
  .catch((e) => {
    ctx.is(parseError(e).issue, ProviderIssue.INVALID_INDEX);
  });
  await erc721Enumerable.instance.methods.tokenOfOwnerByIndex(owner, 2).call()
  .then(() => { ctx.fail(); })
  .catch((e) => {
    ctx.is(parseError(e).issue, ProviderIssue.INVALID_INDEX);
  });
});

spec.test('correctly throws TRANSFERS_PAUSED error', async (ctx) => {
  const pausableXcert = ctx.get('protocol').xcertPausable;
  const jane = ctx.get('jane');
  const owner = ctx.get('owner');
  await pausableXcert.instance.methods.setPause(true).send({ from: owner });
  await pausableXcert.instance.methods.transferFrom(jane, owner, '123').call({ from: jane })
  .then(() => { ctx.fail(); })
  .catch((e) => {
    ctx.is(parseError(e).issue, ProviderIssue.TRANSFERS_PAUSED);
  });
});

// TODO: Because revert is done with revert() not require() ganache does not throw message.
spec.test('correctly throws INVALID_SIGNATURE_KIND error', async (ctx) => {
  const orderGateway = ctx.get('protocol').orderGateway;
  const jane = ctx.get('jane');
  const signatureData = {
    r: '0x0',
    s: '0x0',
    v: 1,
    kind: 3
  }

  const signatureDataTuple = ctx.tuple(signatureData);
  await orderGateway.instance.methods.isValidSignature(jane, '0x0', signatureDataTuple).call()
  .then(() => { ctx.fail(); })
  .catch((e) => {
    ctx.is(parseError(e).issue, ProviderIssue.GENERAL_REVERT); // INVALID_SIGNATURE_KIND
  });
});

spec.test('correctly throws INVALID_PROXY error', async (ctx) => {
  const orderGateway = ctx.get('protocol').orderGateway;
  const jane = ctx.get('jane');
  const bob = ctx.get('bob');
  const nftProxy = ctx.get('protocol').nftokenTransferProxy;
  const erc721 = ctx.get('protocol').erc721;

  const actions = [
    {
      kind: 1,
      proxy: 6,
      token: erc721.receipt._address,
      param1: ctx.web3.utils.padLeft(jane, 64),
      to: bob,
      value: '123',
    }
  ];

  const orderData = {
    maker: jane,
    taker: bob,
    actions,
    seed: new Date().getTime(),
    
    expiration: Math.floor((new Date().getTime() / 1000)) + 600,
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

  await orderGateway.instance.methods.perform(orderDataTuple, signatureDataTuple).call({ from: bob })
  .then(() => { ctx.fail(); })
  .catch((e) => {
    ctx.is(parseError(e).issue, ProviderIssue.INVALID_PROXY);
  });
});


spec.test('correctly throws YOU_ARE_NOT_THE_TAKER error', async (ctx) => {
  const orderGateway = ctx.get('protocol').orderGateway;
  const jane = ctx.get('jane');
  const bob = ctx.get('bob');
  const owner = ctx.get('owner');
  const nftProxy = ctx.get('protocol').nftokenTransferProxy;
  const erc721 = ctx.get('protocol').erc721;

  const actions = [
    {
      kind: 1,
      proxy: 2,
      token: erc721.receipt._address,
      param1: ctx.web3.utils.padLeft(jane, 64),
      to: bob,
      value: '123',
    }
  ];

  const orderData = {
    maker: jane,
    taker: bob,
    actions,
    seed: new Date().getTime(),
    
    expiration: Math.floor((new Date().getTime() / 1000)) + 600,
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

  await erc721.instance.methods.approve(nftProxy.receipt._address, '123').send({ from: jane });
  await orderGateway.instance.methods.perform(orderDataTuple, signatureDataTuple).call({ from: owner })
  .then(() => { ctx.fail(); })
  .catch((e) => {
    ctx.is(parseError(e).issue, ProviderIssue.YOU_ARE_NOT_THE_TAKER);
  });
});

spec.test('correctly throws SENDER_NOT_TAKER_OR_MAKER error', async (ctx) => {
  const orderGateway = ctx.get('protocol').orderGateway;
  const jane = ctx.get('jane');
  const bob = ctx.get('bob');
  const nftProxy = ctx.get('protocol').nftokenTransferProxy;
  const erc721 = ctx.get('protocol').erc721;

  const actions = [
    {
      kind: 1,
      proxy: 2,
      token: erc721.receipt._address,
      param1: ctx.web3.utils.padLeft(jane, 64),
      to: bob,
      value: '123',
    }
  ];

  const orderData = {
    maker: bob,
    taker: bob,
    actions,
    seed: new Date().getTime(),
    
    expiration: Math.floor((new Date().getTime() / 1000)) + 600,
  };
  const orderDataTuple = ctx.tuple(orderData);
  const claim = await orderGateway.instance.methods.getOrderDataClaim(orderDataTuple).call();

  const signature = await ctx.web3.eth.sign(claim, bob);
  const signatureData = {
    r: signature.substr(0, 66),
    s: `0x${signature.substr(66, 64)}`,
    v: parseInt(`0x${signature.substr(130, 2)}`) + 27,
    kind: 0,
  };
  const signatureDataTuple = ctx.tuple(signatureData);

  await erc721.instance.methods.approve(nftProxy.receipt._address, '123').send({ from: jane });
  await orderGateway.instance.methods.perform(orderDataTuple, signatureDataTuple).call({ from: bob })
  .then(() => { ctx.fail(); })
  .catch((e) => {
    ctx.is(parseError(e).issue, ProviderIssue.SENDER_NOT_TAKER_OR_MAKER);
  });
});

spec.test('correctly throws ORDER_EXPIRED error', async (ctx) => {
  const orderGateway = ctx.get('protocol').orderGateway;
  const jane = ctx.get('jane');
  const bob = ctx.get('bob');
  const nftProxy = ctx.get('protocol').nftokenTransferProxy;
  const erc721 = ctx.get('protocol').erc721;

  const actions = [
    {
      kind: 1,
      proxy: 2,
      token: erc721.receipt._address,
      param1: ctx.web3.utils.padLeft(jane, 64),
      to: bob,
      value: '123',
    }
  ];

  const orderData = {
    maker: jane,
    taker: bob,
    actions,
    seed: new Date().getTime(),
    expiration: Math.floor((new Date().getTime() / 1000)) - 600,
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

  await erc721.instance.methods.approve(nftProxy.receipt._address, '123').send({ from: jane });
  await orderGateway.instance.methods.perform(orderDataTuple, signatureDataTuple).call({ from: bob })
  .then(() => { ctx.fail(); })
  .catch((e) => {
    ctx.is(parseError(e).issue, ProviderIssue.ORDER_EXPIRED);
  });
});

spec.test('correctly throws INVALID_SIGNATURE error', async (ctx) => {
  const orderGateway = ctx.get('protocol').orderGateway;
  const jane = ctx.get('jane');
  const bob = ctx.get('bob');
  const nftProxy = ctx.get('protocol').nftokenTransferProxy;
  const erc721 = ctx.get('protocol').erc721;

  const actions = [
    {
      kind: 1,
      proxy: 2,
      token: erc721.receipt._address,
      param1: ctx.web3.utils.padLeft(jane, 64),
      to: bob,
      value: '123',
    }
  ];

  const orderData = {
    maker: jane,
    taker: bob,
    actions,
    seed: new Date().getTime(),
    expiration: Math.floor((new Date().getTime() / 1000)) + 600,
  };
  let orderDataTuple = ctx.tuple(orderData);
  const claim = await orderGateway.instance.methods.getOrderDataClaim(orderDataTuple).call();

  const signature = await ctx.web3.eth.sign(claim, jane);
  const signatureData = {
    r: signature.substr(0, 66),
    s: `0x${signature.substr(66, 64)}`,
    v: parseInt(`0x${signature.substr(130, 2)}`) + 27,
    kind: 0,
  };
  const signatureDataTuple = ctx.tuple(signatureData);

  orderData.seed = 123;
  orderDataTuple = ctx.tuple(orderData);
  await erc721.instance.methods.approve(nftProxy.receipt._address, '123').send({ from: jane });
  await orderGateway.instance.methods.perform(orderDataTuple, signatureDataTuple).call({ from: bob })
  .then(() => { ctx.fail(); })
  .catch((e) => {
    ctx.is(parseError(e).issue, ProviderIssue.INVALID_SIGNATURE);
  });
});

spec.test('correctly throws ORDER_CANCELED error', async (ctx) => {
  const orderGateway = ctx.get('protocol').orderGateway;
  const jane = ctx.get('jane');
  const bob = ctx.get('bob');
  const nftProxy = ctx.get('protocol').nftokenTransferProxy;
  const erc721 = ctx.get('protocol').erc721;

  const actions = [
    {
      kind: 1,
      proxy: 2,
      token: erc721.receipt._address,
      param1: ctx.web3.utils.padLeft(jane, 64),
      to: bob,
      value: '123',
    }
  ];

  const orderData = {
    maker: jane,
    taker: bob,
    actions,
    seed: new Date().getTime(),
    expiration: Math.floor((new Date().getTime() / 1000)) + 600,
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
  await orderGateway.instance.methods.cancel(orderDataTuple).send({ from: jane });
  await erc721.instance.methods.approve(nftProxy.receipt._address, '123').send({ from: jane });
  await orderGateway.instance.methods.perform(orderDataTuple, signatureDataTuple).call({ from: bob })
  .then(() => { ctx.fail(); })
  .catch((e) => {
    ctx.is(parseError(e).issue, ProviderIssue.ORDER_CANCELED);
  });
});

spec.test('correctly throws ORDER_CANNOT_BE_PERFORMED_TWICE error', async (ctx) => {
  const orderGateway = ctx.get('protocol').orderGateway;
  const jane = ctx.get('jane');
  const bob = ctx.get('bob');
  const nftProxy = ctx.get('protocol').nftokenTransferProxy;
  const erc721 = ctx.get('protocol').erc721;

  const actions = [
    {
      kind: 1,
      proxy: 2,
      token: erc721.receipt._address,
      param1: ctx.web3.utils.padLeft(jane, 64),
      to: bob,
      value: '123',
    }
  ];

  const orderData = {
    maker: jane,
    taker: bob,
    actions,
    seed: new Date().getTime(),
    expiration: Math.floor((new Date().getTime() / 1000)) + 600,
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
  await erc721.instance.methods.approve(nftProxy.receipt._address, '123').send({ from: jane });
  await orderGateway.instance.methods.perform(orderDataTuple, signatureDataTuple).send({ from: bob });
  await orderGateway.instance.methods.perform(orderDataTuple, signatureDataTuple).call({ from: bob })
  .then(() => { ctx.fail(); })
  .catch((e) => {
    ctx.is(parseError(e).issue, ProviderIssue.ORDER_CANNOT_BE_PERFORMED_TWICE);
  });
});

spec.test('correctly throws YOU_ARE_NOT_THE_MAKER error', async (ctx) => {
  const orderGateway = ctx.get('protocol').orderGateway;
  const jane = ctx.get('jane');
  const bob = ctx.get('bob');
  const erc721 = ctx.get('protocol').erc721;

  const actions = [
    {
      kind: 1,
      proxy: 2,
      token: erc721.receipt._address,
      param1: ctx.web3.utils.padLeft(jane, 64),
      to: bob,
      value: '123',
    }
  ];

  const orderData = {
    maker: jane,
    taker: bob,
    actions,
    seed: new Date().getTime(),
    expiration: Math.floor((new Date().getTime() / 1000)) + 600,
  };
  const orderDataTuple = ctx.tuple(orderData);
  
  await orderGateway.instance.methods.cancel(orderDataTuple).call({ from: bob })
  .then(() => { ctx.fail(); })
  .catch((e) => {
    ctx.is(parseError(e).issue, ProviderIssue.YOU_ARE_NOT_THE_MAKER);
  });
});

spec.test('correctly throws SIGNER_NOT_AUTHORIZED error', async (ctx) => {
  const orderGateway = ctx.get('protocol').orderGateway;
  const jane = ctx.get('jane');
  const bob = ctx.get('bob');
  const xcert = ctx.get('protocol').xcert;

  const actions = [
    {
      kind: 0,
      proxy: 0,
      token: xcert.receipt._address,
      param1: '0x1e205550c221490347e5e2393a02e94d284bbe9903f023ba098355b8d75974c8',
      to: bob,
      value: '1234',
    }
  ];

  const orderData = {
    maker: jane,
    taker: bob,
    actions,
    seed: new Date().getTime(),
    expiration: Math.floor((new Date().getTime() / 1000)) + 600,
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
  await orderGateway.instance.methods.perform(orderDataTuple, signatureDataTuple).call({ from: bob })
  .then(() => { ctx.fail(); })
  .catch((e) => {
    ctx.is(parseError(e).issue, ProviderIssue.SIGNER_NOT_AUTHORIZED);
  });
});

spec.test('correctly throws ONE_ZERO_ABILITY_HAS_TO_EXIST error', async (ctx) => {
  const owner = ctx.get('owner');
  const xcert = ctx.get('protocol').xcert;

  await xcert.instance.methods.revokeAbilities(owner, [0]).call({ from: owner })
  .then(() => { ctx.fail(); })
  .catch((e) => {
    ctx.is(parseError(e).issue, ProviderIssue.ONE_ZERO_ABILITY_HAS_TO_EXIST);
  });
});

export default spec;
