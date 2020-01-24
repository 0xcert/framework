import { AbilitableManageProxyAbilities, NFTokenSafeTransferProxyAbilities, TokenTransferProxyAbilities,
  XcertCreateProxyAbilities, XcertUpdateProxyAbilities } from '@0xcert/ethereum-proxy-contracts/src/core/types';
import { XcertAbilities } from '@0xcert/ethereum-xcert-contracts/src/core/types';
import { Spec } from '@specron/spec';
import { ActionsGatewayAbilities } from '../../../core/types';
import * as common from '../../helpers/common';
import { getSignature } from '../../helpers/signature';

/**
 * Test definition.
 * ERC20: ZXC, BNB, OMG, BAT, GNT
 * ERC-721: Cat, Dog, Fox, Bee, Ant, Ape, Pig
 */

interface Data {
  actionsGateway?: any;
  tokenProxy?: any;
  nftSafeProxy?: any;
  updateProxy?: any;
  createProxy?: any;
  abilitableManageProxy?: any;
  cat?: any;
  dog?: any;
  fox?: any;
  owner?: string;
  bob?: string;
  jane?: string;
  sara?: string;
  ben?: string;
  zeroAddress?: string;
  zxc?: any;
  gnt?: any;
  bnb?: any;
  id1?: string;
  id2?: string;
  id3?: string;
  id4?: string;
  digest1?: string;
  digest2?: string;
  digest3?: string;
}

const spec = new Spec<Data>();

spec.beforeEach(async (ctx) => {
  const accounts = await ctx.web3.eth.getAccounts();
  ctx.set('owner', accounts[0]);
  ctx.set('bob', accounts[1]);
  ctx.set('jane', accounts[2]);
  ctx.set('sara', accounts[3]);
  ctx.set('ben', accounts[4]);
  ctx.set('zeroAddress', '0x0000000000000000000000000000000000000000');
});

spec.beforeEach(async (ctx) => {
  ctx.set('id1', '0x0000000000000000000000000000000000000000000000000000000000000001');
  ctx.set('id2', '0x0000000000000000000000000000000000000000000000000000000000000002');
  ctx.set('id3', '0x0000000000000000000000000000000000000000000000000000000000000003');
  ctx.set('id4', '0x0000000000000000000000000000000000000000000000000000000000000004');
  ctx.set('digest1', '0x1e205550c221490347e5e2393a02e94d284bbe9903f023ba098355b8d75974c8');
  ctx.set('digest2', '0x5e20552dc271490347e5e2391b02e94d684bbe9903f023fa098355bed7597434');
  ctx.set('digest3', '0x53f0df2dc671410347e5eef91b02344d687bbe9903f456fa0983eebed7517521');
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
    args: ['cat', 'CAT', 'https://0xcert.org/', '.json'],
  });
  await cat.instance.methods
    .create(ctx.get('jane'), 1)
    .send({
      from: ctx.get('owner'),
      gas: 4000000,
    });
  await cat.instance.methods
    .create(ctx.get('jane'), 4)
    .send({
      from: ctx.get('owner'),
      gas: 4000000,
    });
  await cat.instance.methods
    .create(ctx.get('bob'), 2)
    .send({
      from: ctx.get('owner'),
      gas: 4000000,
    });
  await cat.instance.methods
    .create(ctx.get('bob'), 3)
    .send({
      from: ctx.get('owner'),
      gas: 4000000,
    });
  ctx.set('cat', cat);
});

/**
 * Dog
 * Jane owns: #1, #2, #3
 */
spec.beforeEach(async (ctx) => {
  const jane = ctx.get('jane');
  const owner = ctx.get('owner');
  const digest1 = ctx.get('digest1');
  const digest2 = ctx.get('digest2');
  const digest3 = ctx.get('digest3');
  const dog = await ctx.deploy({
    src: '@0xcert/ethereum-xcert-contracts/build/xcert-mock.json',
    contract: 'XcertMock',
    args: ['dog', 'DOG', 'https://0xcert.org/', '.json', '0xa65de9e6', ['0x0d04c3b8']],
  });
  await dog.instance.methods
    .create(jane, 1, digest1)
    .send({
      from: owner,
    });
  await dog.instance.methods
    .create(jane, 2, digest2)
    .send({
      from: owner,
    });
  await dog.instance.methods
    .create(jane, 3, digest3)
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
    args: ['fox', 'FOX', 'https://0xcert.org/', '.json', '0xa65de9e6', ['0x0d04c3b8']],
  });
  await fox.instance.methods
    .create(jane, 1, '0x0')
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
    from: jane,
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
    from: jane,
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
    from: bob,
  });
  ctx.set('gnt', gnt);
});

spec.beforeEach(async (ctx) => {
  const tokenProxy = await ctx.deploy({
    src: '@0xcert/ethereum-proxy-contracts/build/token-transfer-proxy.json',
    contract: 'TokenTransferProxy',
  });
  ctx.set('tokenProxy', tokenProxy);
});

spec.beforeEach(async (ctx) => {
  const nftSafeProxy = await ctx.deploy({
    src: '@0xcert/ethereum-proxy-contracts/build/nftoken-safe-transfer-proxy.json',
    contract: 'NFTokenSafeTransferProxy',
  });
  ctx.set('nftSafeProxy', nftSafeProxy);
});

spec.beforeEach(async (ctx) => {
  const updateProxy = await ctx.deploy({
    src: '@0xcert/ethereum-proxy-contracts/build/xcert-update-proxy.json',
    contract: 'XcertUpdateProxy',
  });
  ctx.set('updateProxy', updateProxy);
});

spec.beforeEach(async (ctx) => {
  const createProxy = await ctx.deploy({
    src: '@0xcert/ethereum-proxy-contracts/build/xcert-create-proxy.json',
    contract: 'XcertCreateProxy',
  });
  ctx.set('createProxy', createProxy);
});

spec.beforeEach(async (ctx) => {
  const abilitableManageProxy = await ctx.deploy({
    src: '@0xcert/ethereum-proxy-contracts/build/abilitable-manage-proxy.json',
    contract: 'AbilitableManageProxy',
  });
  ctx.set('abilitableManageProxy', abilitableManageProxy);
});

spec.beforeEach(async (ctx) => {
  const tokenProxy = ctx.get('tokenProxy');
  const nftSafeProxy = ctx.get('nftSafeProxy');
  const updateProxy = ctx.get('updateProxy');
  const createProxy = ctx.get('createProxy');
  const abilitableManageProxy = ctx.get('abilitableManageProxy');
  const owner = ctx.get('owner');
  const actionsGateway = await ctx.deploy({
    src: './build/actions-gateway.json',
    contract: 'ActionsGateway',
  });
  await actionsGateway.instance.methods.grantAbilities(owner, ActionsGatewayAbilities.SET_PROXIES).send();
  await actionsGateway.instance.methods.addProxy(createProxy.receipt._address, 0).send({ from: owner });
  await actionsGateway.instance.methods.addProxy(tokenProxy.receipt._address, 1).send({ from: owner });
  await actionsGateway.instance.methods.addProxy(nftSafeProxy.receipt._address, 1).send({ from: owner });
  await actionsGateway.instance.methods.addProxy(updateProxy.receipt._address, 2).send({ from: owner });
  await actionsGateway.instance.methods.addProxy(abilitableManageProxy.receipt._address, 3).send({ from: owner });
  ctx.set('actionsGateway', actionsGateway);
});

spec.beforeEach(async (ctx) => {
  const tokenProxy = ctx.get('tokenProxy');
  const nftSafeProxy = ctx.get('nftSafeProxy');
  const updateProxy = ctx.get('updateProxy');
  const createProxy = ctx.get('createProxy');
  const abilitableManageProxy = ctx.get('abilitableManageProxy');
  const actionsGateway = ctx.get('actionsGateway');
  const owner = ctx.get('owner');
  await tokenProxy.instance.methods.grantAbilities(actionsGateway.receipt._address, TokenTransferProxyAbilities.EXECUTE).send({ from: owner });
  await nftSafeProxy.instance.methods.grantAbilities(actionsGateway.receipt._address, NFTokenSafeTransferProxyAbilities.EXECUTE).send({ from: owner });
  await updateProxy.instance.methods.grantAbilities(actionsGateway.receipt._address, XcertUpdateProxyAbilities.EXECUTE).send({ from: owner });
  await createProxy.instance.methods.grantAbilities(actionsGateway.receipt._address, XcertCreateProxyAbilities.EXECUTE).send({ from: owner });
  await abilitableManageProxy.instance.methods.grantAbilities(actionsGateway.receipt._address, AbilitableManageProxyAbilities.EXECUTE).send({ from: owner });
});

spec.test('sucesfully executes multiple actions scenario #1', async (ctx) => {
  // This test expects 3 signers (Owner, Jane, Bob) and signatures from all 3. Sara is the executor of the order.
  // Actions defined in this test are as follows:
  // - Owner creates dog #4 with Jane as receiver
  // - Bob sends 3000 GNT to owner
  // - Jane sends dog #1 to Bob
  // - Jane sends dog #2 to Bob
  // - Jane sends 1000 ZXC to Bob
  // - Owner updates digest of dog #1
  // - Owner grants create ability for dog to Bob
  // - Jane sends fox #1 to Owner
  const actionsGateway = ctx.get('actionsGateway');
  const updateProxy = ctx.get('updateProxy');
  const createProxy = ctx.get('createProxy');
  const tokenProxy = ctx.get('tokenProxy');
  const nftSafeProxy = ctx.get('nftSafeProxy');
  const abilitableManageProxy = ctx.get('abilitableManageProxy');
  const jane = ctx.get('jane');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const sara = ctx.get('sara');
  const dog = ctx.get('dog');
  const fox = ctx.get('fox');
  const id = ctx.get('id1');
  const id2 = ctx.get('id2');
  const id4 = ctx.get('id4');
  const digest1 = ctx.get('digest1');
  const digest2 = ctx.get('digest2');
  const zxc = ctx.get('zxc');
  const gnt = ctx.get('gnt');
  const gntAmountDec = 3000;
  const gntAmountHex = '0x0000000000000000000000000000000000000000000000000000000000000BB8';
  const zxcAmountDec = 1000;
  const zxcAmountHex = '0x00000000000000000000000000000000000000000000000000000000000003E8';
  const createAbility = '0x0000000000000000000000000000000000000000000000000000000000000010'; // create asset in hex uint256

  const actions = [
    {
      proxyId: 0,
      contractAddress: dog.receipt._address,
      params: `${digest1}${id4.substring(2)}${jane.substring(2)}00`,
    },
    {
      proxyId: 1,
      contractAddress: gnt.receipt._address,
      params: `${gntAmountHex}${owner.substring(2)}02`,
    },
    {
      proxyId: 2,
      contractAddress: dog.receipt._address,
      params: `${id}${bob.substring(2)}01`,
    },
    {
      proxyId: 2,
      contractAddress: dog.receipt._address,
      params: `${id2}${bob.substring(2)}01`,
    },
    {
      proxyId: 1,
      contractAddress: zxc.receipt._address,
      params: `${zxcAmountHex}${bob.substring(2)}01`,
    },
    {
      proxyId: 3,
      contractAddress: dog.receipt._address,
      params: `${digest2}${id.substring(2)}00`,
    },
    {
      proxyId: 4,
      contractAddress: dog.receipt._address,
      params: `${createAbility}${bob.substring(2)}00`,
    },
    {
      proxyId: 2,
      contractAddress: fox.receipt._address,
      params: `${id}${owner.substring(2)}01`,
    },
  ];

  const orderData = {
    signers: [owner, jane, bob],
    actions,
    seed: common.getCurrentTime(),
    expirationTimestamp: common.getCurrentTime() + 3600,
  };
  const createTuple = ctx.tuple(orderData);

  const claim = await actionsGateway.instance.methods.getOrderDataClaim(createTuple).call();

  const signature = await getSignature(ctx.web3, claim, owner);
  const signature2 = await getSignature(ctx.web3, claim, jane);
  const signature3 = await getSignature(ctx.web3, claim, bob);
  const signatureDataTuple = ctx.tuple([signature, signature2, signature3]);

  await dog.instance.methods.grantAbilities(createProxy.receipt._address, XcertAbilities.CREATE_ASSET).send({ from: owner });
  await gnt.instance.methods.approve(tokenProxy.receipt._address, gntAmountDec).send({ from: bob });
  await zxc.instance.methods.approve(tokenProxy.receipt._address, zxcAmountDec).send({ from: jane });
  await dog.instance.methods.setApprovalForAll(nftSafeProxy.receipt._address, true).send({ from: jane });
  await dog.instance.methods.grantAbilities(updateProxy.receipt._address, XcertAbilities.UPDATE_ASSET_IMPRINT).send({ from: owner });
  await dog.instance.methods.grantAbilities(abilitableManageProxy.receipt._address, XcertAbilities.MANAGE_ABILITIES).send({ from: owner });
  await fox.instance.methods.setApprovalForAll(nftSafeProxy.receipt._address, true).send({ from: jane });
  const logs = await actionsGateway.instance.methods.perform(createTuple, signatureDataTuple).send({ from: sara });
  ctx.not(logs.events.Perform, undefined);

  const dog4Owner = await dog.instance.methods.ownerOf(id4).call();
  ctx.is(dog4Owner, jane);
  const ownerGntBalance = await gnt.instance.methods.balanceOf(owner).call();
  ctx.is(ownerGntBalance, gntAmountDec.toString());
  const dog1Owner = await dog.instance.methods.ownerOf(id).call();
  ctx.is(dog1Owner, bob);
  const dog2Owner = await dog.instance.methods.ownerOf(id2).call();
  ctx.is(dog2Owner, bob);
  const bobZxcBalance = await zxc.instance.methods.balanceOf(bob).call();
  ctx.is(bobZxcBalance, zxcAmountDec.toString());
  const dog1Digest = await dog.instance.methods.tokenURIIntegrity(id).call();
  ctx.is(dog1Digest.digest, digest2);
  const bobCreateDog = await dog.instance.methods.isAble(bob, XcertAbilities.CREATE_ASSET).call();
  ctx.true(bobCreateDog);
  const fox1Owner = await fox.instance.methods.ownerOf(id).call();
  ctx.is(fox1Owner, owner);
});

spec.test('sucesfully executes multiple actions scenario #2', async (ctx) => {
  // This test expects 3 signers (Owner, Jane, Bob) and signatures from all 3. Ben is the executor of the order.
  // Actions defined in this test are as follows:
  // - Owner creates fox #2 with Bob as receiver
  // - Owner creates fox #3 with Jane as receiver
  // - Owner creates fox #4 with Sara as receiver
  // - Bob sends 3000 GNT to Sara
  // - Jane sends 3000 ZXC to Sara
  const actionsGateway = ctx.get('actionsGateway');
  const createProxy = ctx.get('createProxy');
  const tokenProxy = ctx.get('tokenProxy');
  const jane = ctx.get('jane');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const sara = ctx.get('sara');
  const ben = ctx.get('ben');
  const fox = ctx.get('fox');
  const id2 = ctx.get('id2');
  const id3 = ctx.get('id3');
  const id4 = ctx.get('id4');
  const digest1 = ctx.get('digest1');
  const digest2 = ctx.get('digest2');
  const digest3 = ctx.get('digest3');
  const zxc = ctx.get('zxc');
  const gnt = ctx.get('gnt');
  const gntAmountDec = 3000;
  const gntAmountHex = '0x0000000000000000000000000000000000000000000000000000000000000BB8';
  const zxcAmountDec = 3000;
  const zxcAmountHex = '0x0000000000000000000000000000000000000000000000000000000000000BB8';

  const actions = [
    {
      proxyId: 0,
      contractAddress: fox.receipt._address,
      params: `${digest2}${id2.substring(2)}${bob.substring(2)}00`,
    },
    {
      proxyId: 0,
      contractAddress: fox.receipt._address,
      params: `${digest3}${id3.substring(2)}${jane.substring(2)}00`,
    },
    {
      proxyId: 0,
      contractAddress: fox.receipt._address,
      params: `${digest1}${id4.substring(2)}${sara.substring(2)}00`,
    },
    {
      proxyId: 1,
      contractAddress: gnt.receipt._address,
      params: `${gntAmountHex}${sara.substring(2)}02`,
    },
    {
      proxyId: 1,
      contractAddress: zxc.receipt._address,
      params: `${zxcAmountHex}${sara.substring(2)}01`,
    },
  ];

  const orderData = {
    signers: [owner, jane, bob],
    actions,
    seed: common.getCurrentTime(),
    expirationTimestamp: common.getCurrentTime() + 3600,
  };
  const createTuple = ctx.tuple(orderData);

  const claim = await actionsGateway.instance.methods.getOrderDataClaim(createTuple).call();

  const signature = await getSignature(ctx.web3, claim, owner);
  const signature2 = await getSignature(ctx.web3, claim, jane);
  const signature3 = await getSignature(ctx.web3, claim, bob);
  const signatureDataTuple = ctx.tuple([signature, signature2, signature3]);

  await fox.instance.methods.grantAbilities(createProxy.receipt._address, XcertAbilities.CREATE_ASSET).send({ from: owner });
  await gnt.instance.methods.approve(tokenProxy.receipt._address, gntAmountDec).send({ from: bob });
  await zxc.instance.methods.approve(tokenProxy.receipt._address, zxcAmountDec).send({ from: jane });
  const logs = await actionsGateway.instance.methods.perform(createTuple, signatureDataTuple).send({ from: ben });
  ctx.not(logs.events.Perform, undefined);

  const saraGntBalance = await gnt.instance.methods.balanceOf(sara).call();
  ctx.is(saraGntBalance, gntAmountDec.toString());
  const saraZxcBalance = await zxc.instance.methods.balanceOf(sara).call();
  ctx.is(saraZxcBalance, zxcAmountDec.toString());
  const fox2Owner = await fox.instance.methods.ownerOf(id2).call();
  ctx.is(fox2Owner, bob);
  const fox3Owner = await fox.instance.methods.ownerOf(id3).call();
  ctx.is(fox3Owner, jane);
  const fox4Owner = await fox.instance.methods.ownerOf(id4).call();
  ctx.is(fox4Owner, sara);
});

/**
 * owner, ben, bob, sara -> sara executes
 * owner gives ben sign manage ability
 * ben gives bob allow create ability
 * ben gives sara allow create and allow update abilities
 * bob creates fox 2 to himself
 * sara creates fox 3 to bob
 * sara updates fox 3
 */
spec.test('sucesfully executes multiple actions  scenario #3', async (ctx) => {
  // This test expects 4 signers (Owner, Ben, Bob, Sara) and signatures from first 3.
  // Sara executes as the last signer which is why she does not need to sign.
  // Actions defined in this test are as follows:
  // - Owner grants allow manage ability to Ben
  // - Ben grants allow create ability to Bob
  // - Ben grants allow create and allow updates abilities to Sara
  // - Bob creates fox #2 with himself as receiver
  // - Sara creates fox #3 with Bob as receiver
  // - Sara updates fox #3 digest
  const actionsGateway = ctx.get('actionsGateway');
  const updateProxy = ctx.get('updateProxy');
  const createProxy = ctx.get('createProxy');
  const abilitableManageProxy = ctx.get('abilitableManageProxy');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const sara = ctx.get('sara');
  const ben = ctx.get('ben');
  const fox = ctx.get('fox');
  const id2 = ctx.get('id2');
  const id3 = ctx.get('id3');
  const digest1 = ctx.get('digest1');
  const digest2 = ctx.get('digest2');
  const digest3 = ctx.get('digest3');
  const allowManageAbility = '0x0000000000000000000000000000000000000000000000000000000000000002'; // allow manage ability in hex uint256
  const allowCreateAbility = '0x0000000000000000000000000000000000000000000000000000000000000200'; // allow create ability in hex uint256
  const allowCreateAndAllowUpdateAbilities = '0x0000000000000000000000000000000000000000000000000000000000000600'; // allow create ability and allow update ability in hex uint256

  const actions = [
    {
      proxyId: 4,
      contractAddress: fox.receipt._address,
      params: `${allowManageAbility}${ben.substring(2)}00`,
    },
    {
      proxyId: 4,
      contractAddress: fox.receipt._address,
      params: `${allowCreateAbility}${bob.substring(2)}01`,
    },
    {
      proxyId: 4,
      contractAddress: fox.receipt._address,
      params: `${allowCreateAndAllowUpdateAbilities}${sara.substring(2)}01`,
    },
    {
      proxyId: 0,
      contractAddress: fox.receipt._address,
      params: `${digest2}${id2.substring(2)}${bob.substring(2)}02`,
    },
    {
      proxyId: 0,
      contractAddress: fox.receipt._address,
      params: `${digest3}${id3.substring(2)}${bob.substring(2)}03`,
    },
    {
      proxyId: 3,
      contractAddress: fox.receipt._address,
      params: `${digest1}${id3.substring(2)}03`,
    },
  ];

  const orderData = {
    signers: [owner, ben, bob, sara],
    actions,
    seed: common.getCurrentTime(),
    expirationTimestamp: common.getCurrentTime() + 3600,
  };
  const createTuple = ctx.tuple(orderData);

  const claim = await actionsGateway.instance.methods.getOrderDataClaim(createTuple).call();

  const signature = await getSignature(ctx.web3, claim, owner);
  const signature2 = await getSignature(ctx.web3, claim, ben);
  const signature3 = await getSignature(ctx.web3, claim, bob);
  const signatureDataTuple = ctx.tuple([signature, signature2, signature3]);

  await fox.instance.methods.grantAbilities(createProxy.receipt._address, XcertAbilities.CREATE_ASSET).send({ from: owner });
  await fox.instance.methods.grantAbilities(abilitableManageProxy.receipt._address, XcertAbilities.MANAGE_ABILITIES).send({ from: owner });
  await fox.instance.methods.grantAbilities(updateProxy.receipt._address, XcertAbilities.UPDATE_ASSET_IMPRINT).send({ from: owner });
  const logs = await actionsGateway.instance.methods.perform(createTuple, signatureDataTuple).send({ from: sara });
  ctx.not(logs.events.Perform, undefined);

  const benAllowManageAbility = await fox.instance.methods.isAble(ben, XcertAbilities.ALLOW_MANAGE_ABILITIES).call();
  ctx.true(benAllowManageAbility);
  const bobAllowCreateAbility = await fox.instance.methods.isAble(bob, XcertAbilities.ALLOW_CREATE_ASSET).call();
  ctx.true(bobAllowCreateAbility);
  const saraAllowCreateAbility = await fox.instance.methods.isAble(sara, XcertAbilities.ALLOW_CREATE_ASSET).call();
  ctx.true(saraAllowCreateAbility);
  const saraAllowUpdateAbility = await fox.instance.methods.isAble(sara, XcertAbilities.ALLOW_UPDATE_ASSET_IMPRINT).call();
  ctx.true(saraAllowUpdateAbility);
  const fox2Owner = await fox.instance.methods.ownerOf(id2).call();
  ctx.is(fox2Owner, bob);
  const fox3Owner = await fox.instance.methods.ownerOf(id3).call();
  ctx.is(fox3Owner, bob);
  const fox3Digest = await fox.instance.methods.tokenURIIntegrity(id3).call();
  ctx.is(fox3Digest.digest, digest1);
});

spec.test('sucesfully executes multiple actions scenario #4', async (ctx) => {
  // This test expects 3 signers (Owner, Bob and unknown address represented as zero address) and signatures from all 3.
  // Sara executes the order, unknown signer is automatically replaced with the address provided by the 3rd signature.
  // Jane will be the 3rd "unknown" signer.
  // Actions defined in this test are as follows:
  // - Owner create fox #2 with unkown receiver.
  // - Owner create fox #3 with unkown receiver.
  // - Bob send 3000 GNT to unknown receiver
  // - Owner grants revoke ability for fox to unkown receiver.
  // - Unknown receiver sends 10000 ZXC to Sara.
  const actionsGateway = ctx.get('actionsGateway');
  const createProxy = ctx.get('createProxy');
  const tokenProxy = ctx.get('tokenProxy');
  const abilitableManageProxy = ctx.get('abilitableManageProxy');
  const jane = ctx.get('jane');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const sara = ctx.get('sara');
  const zeroAddress = ctx.get('zeroAddress');
  const fox = ctx.get('fox');
  const id2 = ctx.get('id2');
  const id3 = ctx.get('id3');
  const digest2 = ctx.get('digest2');
  const digest3 = ctx.get('digest3');
  const zxc = ctx.get('zxc');
  const gnt = ctx.get('gnt');
  const gntAmountDec = 3000;
  const gntAmountHex = '0x0000000000000000000000000000000000000000000000000000000000000BB8';
  const zxcAmountDec = 10000;
  const zxcAmountHex = '0x0000000000000000000000000000000000000000000000000000000000002710';
  const revokeAbility = '0x0000000000000000000000000000000000000000000000000000000000000020'; // create asset in hex uint256

  const actions = [
    {
      proxyId: 0,
      contractAddress: fox.receipt._address,
      params: `${digest2}${id2.substring(2)}${zeroAddress.substring(2)}00`,
    },
    {
      proxyId: 0,
      contractAddress: fox.receipt._address,
      params: `${digest3}${id3.substring(2)}${zeroAddress.substring(2)}00`,
    },
    {
      proxyId: 1,
      contractAddress: gnt.receipt._address,
      params: `${gntAmountHex}${zeroAddress.substring(2)}01`,
    },
    {
      proxyId: 4,
      contractAddress: fox.receipt._address,
      params: `${revokeAbility}${zeroAddress.substring(2)}00`,
    },
    {
      proxyId: 1,
      contractAddress: zxc.receipt._address,
      params: `${zxcAmountHex}${sara.substring(2)}02`,
    },
  ];

  const orderData = {
    signers: [owner, bob, zeroAddress],
    actions,
    seed: common.getCurrentTime(),
    expirationTimestamp: common.getCurrentTime() + 3600,
  };
  const createTuple = ctx.tuple(orderData);

  const claim = await actionsGateway.instance.methods.getOrderDataClaim(createTuple).call();

  const signature = await getSignature(ctx.web3, claim, owner);
  const signature2 = await getSignature(ctx.web3, claim, bob);
  const signature3 = await getSignature(ctx.web3, claim, jane);
  const signatureDataTuple = ctx.tuple([signature, signature2, signature3]);

  await fox.instance.methods.grantAbilities(createProxy.receipt._address, XcertAbilities.CREATE_ASSET).send({ from: owner });
  await gnt.instance.methods.approve(tokenProxy.receipt._address, gntAmountDec).send({ from: bob });
  await zxc.instance.methods.approve(tokenProxy.receipt._address, zxcAmountDec).send({ from: jane });
  await fox.instance.methods.grantAbilities(abilitableManageProxy.receipt._address, XcertAbilities.MANAGE_ABILITIES).send({ from: owner });
  const logs = await actionsGateway.instance.methods.perform(createTuple, signatureDataTuple).send({ from: sara });
  ctx.not(logs.events.Perform, undefined);

  const fox2Owner = await fox.instance.methods.ownerOf(id2).call();
  ctx.is(fox2Owner, jane);
  const fox3Owner = await fox.instance.methods.ownerOf(id3).call();
  ctx.is(fox3Owner, jane);
  const janeGntBalance = await gnt.instance.methods.balanceOf(jane).call();
  ctx.is(janeGntBalance, gntAmountDec.toString());
  const janeRevokeAbility = await fox.instance.methods.isAble(jane, XcertAbilities.REVOKE_ASSET).call();
  ctx.true(janeRevokeAbility);
  const saraZxcBalance = await zxc.instance.methods.balanceOf(sara).call();
  ctx.is(saraZxcBalance, zxcAmountDec.toString());
});

export default spec;
