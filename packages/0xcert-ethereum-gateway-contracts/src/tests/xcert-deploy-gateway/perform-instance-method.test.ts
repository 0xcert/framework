import { TokenTransferProxyAbilities } from '@0xcert/ethereum-proxy-contracts/src/core/types';
import { XcertAbilities } from '@0xcert/ethereum-xcert-contracts/src/core/types';
import { Spec } from '@specron/spec';
import * as path from 'path';
import * as common from '../helpers/common';

interface Data {
  xcertDeployGateway?: any;
  deployProxy?: any;
  tokenProxy?: any;
  createProxy?: any;
  updateProxy?: any;
  manageProxy?: any;
  nftTransferProxy?: any;
  burnProxy?: any;
  zxc?: any;
  jane?: string;
  sara?: string;
  owner?: string;
}

const spec = new Spec<Data>();

spec.before(async (ctx) => {
  const accounts = await ctx.web3.eth.getAccounts();
  ctx.set('owner', accounts[0]);
  ctx.set('jane', accounts[1]);
  ctx.set('sara', accounts[2]);
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

spec.beforeEach(async (ctx) => {
  const deployProxy = await ctx.deploy({
    src: '@0xcert/ethereum-proxy-contracts/build/xcert-deploy-proxy.json',
    contract: 'XcertDeployProxy',
  });
  ctx.set('deployProxy', deployProxy);
});

spec.beforeEach(async (ctx) => {
  const tokenProxy = await ctx.deploy({
    src: '@0xcert/ethereum-proxy-contracts/build/token-transfer-proxy.json',
    contract: 'TokenTransferProxy',
  });
  ctx.set('tokenProxy', tokenProxy);
});

spec.beforeEach(async (ctx) => {
  const createProxy = await ctx.deploy({
    src: '@0xcert/ethereum-proxy-contracts/build/xcert-create-proxy.json',
    contract: 'XcertCreateProxy',
  });
  ctx.set('createProxy', createProxy);
});

spec.beforeEach(async (ctx) => {
  const updateProxy = await ctx.deploy({
    src: '@0xcert/ethereum-proxy-contracts/build/xcert-update-proxy.json',
    contract: 'XcertUpdateProxy',
  });
  ctx.set('updateProxy', updateProxy);
});

spec.beforeEach(async (ctx) => {
  const manageProxy = await ctx.deploy({
    src: '@0xcert/ethereum-proxy-contracts/build/abilitable-manage-proxy.json',
    contract: 'AbilitableManageProxy',
  });
  ctx.set('manageProxy', manageProxy);
});

spec.beforeEach(async (ctx) => {
  const nftTransferProxy = await ctx.deploy({
    src: '@0xcert/ethereum-proxy-contracts/build/nftoken-safe-transfer-proxy.json',
    contract: 'NFTokenSafeTransferProxy',
  });
  ctx.set('nftTransferProxy', nftTransferProxy);
});

spec.beforeEach(async (ctx) => {
  const burnProxy = await ctx.deploy({
    src: '@0xcert/ethereum-proxy-contracts/build/xcert-burn-proxy.json',
    contract: 'XcertBurnProxy',
  });
  ctx.set('burnProxy', burnProxy);
});

spec.beforeEach(async (ctx) => {
  const deployProxy = ctx.get('deployProxy');
  const tokenProxy = ctx.get('tokenProxy');
  const createProxy = ctx.get('createProxy');
  const updateProxy = ctx.get('updateProxy');
  const manageProxy = ctx.get('manageProxy');
  const nftTransferProxy = ctx.get('nftTransferProxy');
  const burnProxy = ctx.get('burnProxy');
  const xcertDeployGateway = await ctx.deploy({
    src: './build/xcert-deploy-gateway.json',
    contract: 'XcertDeployGateway',
    args: [
      deployProxy.receipt._address,
      tokenProxy.receipt._address,
      createProxy.receipt._address,
      updateProxy.receipt._address,
      manageProxy.receipt._address,
      nftTransferProxy.receipt._address,
      burnProxy.receipt._address,
    ],
  });
  ctx.set('xcertDeployGateway', xcertDeployGateway);
});

spec.beforeEach(async (ctx) => {
  const tokenProxy = ctx.get('tokenProxy');
  const xcertDeployGateway = ctx.get('xcertDeployGateway');
  const owner = ctx.get('owner');
  await tokenProxy.instance.methods.grantAbilities(xcertDeployGateway.receipt._address, TokenTransferProxyAbilities.EXECUTE).send({ from: owner });
});

spec.test('performs a deploy', async (ctx) => {
  const xcertDeployGateway = ctx.get('xcertDeployGateway');
  const zxc = ctx.get('zxc');
  const tokenProxy = ctx.get('tokenProxy');
  const createProxy = ctx.get('createProxy');
  const nftTransferProxy = ctx.get('nftTransferProxy');
  const burnProxy = ctx.get('burnProxy');
  const jane = ctx.get('jane');
  const owner = ctx.get('owner');

  const deployData = {
    maker: jane,
    taker: owner,
    deployData: {
      name: 'test',
      symbol: 'TST',
      uriPrefix: 'https://base.com/',
      uriPostfix: '.json',
      schemaId: '0x9c22ff5f21f0b81b113e63f7db6da94fedef11b2119b4088b89664fb9a3cb658',
      capabilities: ['0x9d118770', '0x0d04c3b8', '0xbedb86fb', '0x20c5429b'],
      owner: jane,
    },
    paymentData: {
      token: zxc.receipt._address,
      to: owner,
      value: '10000',
    },
    seed: common.getCurrentTime(),
    expirationTimestamp: common.getCurrentTime() + 3600,
  };
  const createTuple = ctx.tuple(deployData);

  const claim = await xcertDeployGateway.instance.methods.getDeployDataClaim(createTuple).call();

  const signature = await ctx.web3.eth.sign(claim, jane);
  const signatureData = {
    r: signature.substr(0, 66),
    s: `0x${signature.substr(66, 64)}`,
    v: parseInt(`0x${signature.substr(130, 2)}`) + 27,
    kind: 0,
  };
  const signatureDataTuple = ctx.tuple(signatureData);

  await zxc.instance.methods.approve(tokenProxy.receipt._address, 10000).send({ from: jane });
  const logs = await xcertDeployGateway.instance.methods.perform(createTuple, signatureDataTuple).send({ from: owner });
  ctx.not(logs.events.Perform, undefined);

  const xcertAddress = logs.events.Perform.returnValues._createdContract;
  const src = path.resolve(process.cwd(), 'node_modules', '@0xcert', 'ethereum-proxy-contracts', 'build', 'xcert-custom.json');
  const data = require(src);
  const abi = data['XcertCustom'].abi;
  const xcert = new ctx.web3.eth.Contract(abi, xcertAddress);

  const xcertName = await xcert.methods.name().call();
  ctx.is(xcertName, 'test');

  await xcert.methods.create(jane, '1', '0x1234567890123456789012345678901234567891').send({
    from: jane,
    gas: '1000000',
  });
  const xcert1Owner = await xcert.methods.ownerOf('1').call();
  ctx.is(xcert1Owner, jane);

  const isAble = await xcert.methods.isAble(createProxy.receipt._address, XcertAbilities.CREATE_ASSET).call();
  ctx.true(isAble);

  const supportsInterface = await xcert.methods.supportsInterface('0xbedb86fb').call();
  ctx.true(supportsInterface);

  const ownerZxcBalance = await zxc.instance.methods.balanceOf(owner).call();
  ctx.is(ownerZxcBalance, '10000');

  const nftSafeTransferProxyApproved = await xcert.methods.isApprovedForAll(jane, nftTransferProxy.receipt._address).call();
  ctx.true(nftSafeTransferProxyApproved);

  const xcertBurnProxyApproved = await xcert.methods.isApprovedForAll(jane, burnProxy.receipt._address).call();
  ctx.true(xcertBurnProxyApproved);
});

spec.test('fails when not enough balance', async (ctx) => {
  const xcertDeployGateway = ctx.get('xcertDeployGateway');
  const zxc = ctx.get('zxc');
  const tokenProxy = ctx.get('tokenProxy');
  const jane = ctx.get('jane');
  const owner = ctx.get('owner');

  const deployData = {
    maker: jane,
    taker: owner,
    deployData: {
      name: 'test',
      symbol: 'TST',
      uriPrefix: 'https://base.com/',
      uriPostfix: '.json',
      schemaId: '0x9c22ff5f21f0b81b113e63f7db6da94fedef11b2119b4088b89664fb9a3cb658',
      capabilities: ['0x9d118770', '0x0d04c3b8', '0xbedb86fb', '0x20c5429b'],
      owner: jane,
    },
    paymentData: {
      token: zxc.receipt._address,
      to: owner,
      value: '10000',
    },
    seed: common.getCurrentTime(),
    expirationTimestamp: common.getCurrentTime() + 3600,
  };
  const createTuple = ctx.tuple(deployData);

  const claim = await xcertDeployGateway.instance.methods.getDeployDataClaim(createTuple).call();

  const signature = await ctx.web3.eth.sign(claim, jane);
  const signatureData = {
    r: signature.substr(0, 66),
    s: `0x${signature.substr(66, 64)}`,
    v: parseInt(`0x${signature.substr(130, 2)}`) + 27,
    kind: 0,
  };
  const signatureDataTuple = ctx.tuple(signatureData);

  await zxc.instance.methods.approve(tokenProxy.receipt._address, 9000).send({ from: jane });
  await ctx.reverts(() => xcertDeployGateway.instance.methods.perform(createTuple, signatureDataTuple).send({ from: owner }), '001002');
});

spec.test('fails when not specified taker', async (ctx) => {
  const xcertDeployGateway = ctx.get('xcertDeployGateway');
  const zxc = ctx.get('zxc');
  const tokenProxy = ctx.get('tokenProxy');
  const jane = ctx.get('jane');
  const sara = ctx.get('sara');
  const owner = ctx.get('owner');

  const deployData = {
    maker: jane,
    taker: owner,
    deployData: {
      name: 'test',
      symbol: 'TST',
      uriPrefix: 'https://base.com/',
      uriPostfix: '.json',
      schemaId: '0x9c22ff5f21f0b81b113e63f7db6da94fedef11b2119b4088b89664fb9a3cb658',
      capabilities: ['0x9d118770', '0x0d04c3b8', '0xbedb86fb', '0x20c5429b'],
      owner: jane,
    },
    paymentData: {
      token: zxc.receipt._address,
      to: owner,
      value: '10000',
    },
    seed: common.getCurrentTime(),
    expirationTimestamp: common.getCurrentTime() + 3600,
  };
  const createTuple = ctx.tuple(deployData);

  const claim = await xcertDeployGateway.instance.methods.getDeployDataClaim(createTuple).call();

  const signature = await ctx.web3.eth.sign(claim, jane);
  const signatureData = {
    r: signature.substr(0, 66),
    s: `0x${signature.substr(66, 64)}`,
    v: parseInt(`0x${signature.substr(130, 2)}`) + 27,
    kind: 0,
  };
  const signatureDataTuple = ctx.tuple(signatureData);

  await zxc.instance.methods.approve(tokenProxy.receipt._address, 10000).send({ from: jane });
  await ctx.reverts(() => xcertDeployGateway.instance.methods.perform(createTuple, signatureDataTuple).send({ from: sara }), '009002');
});

spec.test('fails with expired claim', async (ctx) => {
  const xcertDeployGateway = ctx.get('xcertDeployGateway');
  const zxc = ctx.get('zxc');
  const tokenProxy = ctx.get('tokenProxy');
  const jane = ctx.get('jane');
  const owner = ctx.get('owner');

  const deployData = {
    maker: jane,
    taker: owner,
    deployData: {
      name: 'test',
      symbol: 'TST',
      uriPrefix: 'https://base.com/',
      uriPostfix: '.json',
      schemaId: '0x9c22ff5f21f0b81b113e63f7db6da94fedef11b2119b4088b89664fb9a3cb658',
      capabilities: ['0x9d118770', '0x0d04c3b8', '0xbedb86fb', '0x20c5429b'],
      owner: jane,
    },
    paymentData: {
      token: zxc.receipt._address,
      to: owner,
      value: '10000',
    },
    seed: common.getCurrentTime(),
    expirationTimestamp: common.getCurrentTime() - 3600,
  };
  const createTuple = ctx.tuple(deployData);

  const claim = await xcertDeployGateway.instance.methods.getDeployDataClaim(createTuple).call();

  const signature = await ctx.web3.eth.sign(claim, jane);
  const signatureData = {
    r: signature.substr(0, 66),
    s: `0x${signature.substr(66, 64)}`,
    v: parseInt(`0x${signature.substr(130, 2)}`) + 27,
    kind: 0,
  };
  const signatureDataTuple = ctx.tuple(signatureData);

  await zxc.instance.methods.approve(tokenProxy.receipt._address, 10000).send({ from: jane });
  await ctx.reverts(() => xcertDeployGateway.instance.methods.perform(createTuple, signatureDataTuple).send({ from: owner }), '009003');
});

spec.test('fails with invalid signature', async (ctx) => {
  const xcertDeployGateway = ctx.get('xcertDeployGateway');
  const zxc = ctx.get('zxc');
  const tokenProxy = ctx.get('tokenProxy');
  const jane = ctx.get('jane');
  const owner = ctx.get('owner');

  const deployData = {
    maker: jane,
    taker: owner,
    deployData: {
      name: 'test',
      symbol: 'TST',
      uriPrefix: 'https://base.com/',
      uriPostfix: '.json',
      schemaId: '0x9c22ff5f21f0b81b113e63f7db6da94fedef11b2119b4088b89664fb9a3cb658',
      capabilities: ['0x9d118770', '0x0d04c3b8', '0xbedb86fb', '0x20c5429b'],
      owner: jane,
    },
    paymentData: {
      token: zxc.receipt._address,
      to: owner,
      value: '10000',
    },
    seed: common.getCurrentTime(),
    expirationTimestamp: common.getCurrentTime() + 3600,
  };
  const createTuple = ctx.tuple(deployData);
  deployData.taker = jane;
  const invalidTuple = ctx.tuple(deployData);

  const claim = await xcertDeployGateway.instance.methods.getDeployDataClaim(invalidTuple).call();

  const signature = await ctx.web3.eth.sign(claim, jane);
  const signatureData = {
    r: signature.substr(0, 66),
    s: `0x${signature.substr(66, 64)}`,
    v: parseInt(`0x${signature.substr(130, 2)}`) + 27,
    kind: 0,
  };
  const signatureDataTuple = ctx.tuple(signatureData);

  await zxc.instance.methods.approve(tokenProxy.receipt._address, 10000).send({ from: jane });
  await ctx.reverts(() => xcertDeployGateway.instance.methods.perform(createTuple, signatureDataTuple).send({ from: owner }), '009004');
});

spec.test('fails with invalid signature kind', async (ctx) => {
  const xcertDeployGateway = ctx.get('xcertDeployGateway');
  const zxc = ctx.get('zxc');
  const tokenProxy = ctx.get('tokenProxy');
  const jane = ctx.get('jane');
  const owner = ctx.get('owner');

  const deployData = {
    maker: jane,
    taker: owner,
    deployData: {
      name: 'test',
      symbol: 'TST',
      uriPrefix: 'https://base.com/',
      uriPostfix: '.json',
      schemaId: '0x9c22ff5f21f0b81b113e63f7db6da94fedef11b2119b4088b89664fb9a3cb658',
      capabilities: ['0x9d118770', '0x0d04c3b8', '0xbedb86fb', '0x20c5429b'],
      owner: jane,
    },
    paymentData: {
      token: zxc.receipt._address,
      to: owner,
      value: '10000',
    },
    seed: common.getCurrentTime(),
    expirationTimestamp: common.getCurrentTime() + 3600,
  };
  const createTuple = ctx.tuple(deployData);

  const claim = await xcertDeployGateway.instance.methods.getDeployDataClaim(createTuple).call();

  const signature = await ctx.web3.eth.sign(claim, jane);
  const signatureData = {
    r: signature.substr(0, 66),
    s: `0x${signature.substr(66, 64)}`,
    v: parseInt(`0x${signature.substr(130, 2)}`) + 27,
    kind: 5,
  };
  const signatureDataTuple = ctx.tuple(signatureData);

  await zxc.instance.methods.approve(tokenProxy.receipt._address, 10000).send({ from: jane });
  await ctx.reverts(() => xcertDeployGateway.instance.methods.perform(createTuple, signatureDataTuple).send({ from: owner }));
});

spec.test('fails trying to perform an already performed deploy', async (ctx) => {
  const xcertDeployGateway = ctx.get('xcertDeployGateway');
  const zxc = ctx.get('zxc');
  const tokenProxy = ctx.get('tokenProxy');
  const jane = ctx.get('jane');
  const owner = ctx.get('owner');

  const deployData = {
    maker: jane,
    taker: owner,
    deployData: {
      name: 'test',
      symbol: 'TST',
      uriPrefix: 'https://base.com/',
      uriPostfix: '.json',
      schemaId: '0x9c22ff5f21f0b81b113e63f7db6da94fedef11b2119b4088b89664fb9a3cb658',
      capabilities: ['0x9d118770', '0x0d04c3b8', '0xbedb86fb', '0x20c5429b'],
      owner: jane,
    },
    paymentData: {
      token: zxc.receipt._address,
      to: owner,
      value: '10000',
    },
    seed: common.getCurrentTime(),
    expirationTimestamp: common.getCurrentTime() + 3600,
  };
  const createTuple = ctx.tuple(deployData);

  const claim = await xcertDeployGateway.instance.methods.getDeployDataClaim(createTuple).call();

  const signature = await ctx.web3.eth.sign(claim, jane);
  const signatureData = {
    r: signature.substr(0, 66),
    s: `0x${signature.substr(66, 64)}`,
    v: parseInt(`0x${signature.substr(130, 2)}`) + 27,
    kind: 0,
  };
  const signatureDataTuple = ctx.tuple(signatureData);

  await zxc.instance.methods.approve(tokenProxy.receipt._address, 10000).send({ from: jane });
  await xcertDeployGateway.instance.methods.perform(createTuple, signatureDataTuple).send({ from: owner });
  await ctx.reverts(() => xcertDeployGateway.instance.methods.perform(createTuple, signatureDataTuple).send({ from: owner }), '009006');
});

spec.test('fails trying to perform a canceled deploy', async (ctx) => {
  const xcertDeployGateway = ctx.get('xcertDeployGateway');
  const zxc = ctx.get('zxc');
  const tokenProxy = ctx.get('tokenProxy');
  const jane = ctx.get('jane');
  const owner = ctx.get('owner');

  const deployData = {
    maker: jane,
    taker: owner,
    deployData: {
      name: 'test',
      symbol: 'TST',
      uriPrefix: 'https://base.com/',
      uriPostfix: '.json',
      schemaId: '0x9c22ff5f21f0b81b113e63f7db6da94fedef11b2119b4088b89664fb9a3cb658',
      capabilities: ['0x9d118770', '0x0d04c3b8', '0xbedb86fb', '0x20c5429b'],
      owner: jane,
    },
    paymentData: {
      token: zxc.receipt._address,
      to: owner,
      value: '10000',
    },
    seed: common.getCurrentTime(),
    expirationTimestamp: common.getCurrentTime() + 3600,
  };
  const createTuple = ctx.tuple(deployData);

  const claim = await xcertDeployGateway.instance.methods.getDeployDataClaim(createTuple).call();

  const signature = await ctx.web3.eth.sign(claim, jane);
  const signatureData = {
    r: signature.substr(0, 66),
    s: `0x${signature.substr(66, 64)}`,
    v: parseInt(`0x${signature.substr(130, 2)}`) + 27,
    kind: 0,
  };
  const signatureDataTuple = ctx.tuple(signatureData);

  await zxc.instance.methods.approve(tokenProxy.receipt._address, 10000).send({ from: jane });
  await xcertDeployGateway.instance.methods.cancel(createTuple).send({ from: jane });
  await ctx.reverts(() => xcertDeployGateway.instance.methods.perform(createTuple, signatureDataTuple).send({ from: owner }), '009005');
});

export default spec;
