import { TokenTransferProxyAbilities } from '@0xcert/ethereum-proxy-contracts/src/core/types';
import { Spec } from '@specron/spec';
import * as path from 'path';
import * as common from '../helpers/common';

interface Data {
  tokenDeployGateway?: any;
  tokenDeployProxy?: any;
  tokenProxy?: any;
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
  const tokenDeployProxy = await ctx.deploy({
    src: '@0xcert/ethereum-proxy-contracts/build/token-deploy-proxy.json',
    contract: 'TokenDeployProxy',
  });
  ctx.set('tokenDeployProxy', tokenDeployProxy);
});

spec.beforeEach(async (ctx) => {
  const tokenProxy = await ctx.deploy({
    src: '@0xcert/ethereum-proxy-contracts/build/token-transfer-proxy.json',
    contract: 'TokenTransferProxy',
  });
  ctx.set('tokenProxy', tokenProxy);
});

spec.beforeEach(async (ctx) => {
  const tokenDeployProxy = ctx.get('tokenDeployProxy');
  const tokenProxy = ctx.get('tokenProxy');
  const tokenDeployGateway = await ctx.deploy({
    src: './build/token-deploy-gateway.json',
    contract: 'TokenDeployGateway',
    args: [
      tokenDeployProxy.receipt._address,
      tokenProxy.receipt._address,
    ],
  });
  ctx.set('tokenDeployGateway', tokenDeployGateway);
});

spec.beforeEach(async (ctx) => {
  const tokenProxy = ctx.get('tokenProxy');
  const tokenDeployGateway = ctx.get('tokenDeployGateway');
  const owner = ctx.get('owner');
  await tokenProxy.instance.methods.grantAbilities(tokenDeployGateway.receipt._address, TokenTransferProxyAbilities.EXECUTE).send({ from: owner });
});

spec.test('performs a deploy', async (ctx) => {
  const tokenDeployGateway = ctx.get('tokenDeployGateway');
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
      supply: '5000000000000000000000000',
      decimals: '18',
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

  const claim = await tokenDeployGateway.instance.methods.getDeployDataClaim(createTuple).call();

  const signature = await ctx.web3.eth.sign(claim, jane);
  const signatureData = {
    r: signature.substr(0, 66),
    s: `0x${signature.substr(66, 64)}`,
    v: parseInt(`0x${signature.substr(130, 2)}`) + 27,
    kind: 0,
  };
  const signatureDataTuple = ctx.tuple(signatureData);

  await zxc.instance.methods.approve(tokenProxy.receipt._address, 10000).send({ from: jane });
  const logs = await tokenDeployGateway.instance.methods.perform(createTuple, signatureDataTuple).send({ from: owner });
  ctx.not(logs.events.Perform, undefined);

  const tokenAddress = logs.events.Perform.returnValues._createdContract;
  const src = path.resolve(process.cwd(), 'node_modules', '@0xcert', 'ethereum-proxy-contracts', 'build', 'token-custom.json');
  const data = require(src);
  const abi = data['TokenCustom'].abi;
  const token = new ctx.web3.eth.Contract(abi, tokenAddress);

  const tokenName = await token.methods.name().call();
  ctx.is(tokenName, 'test');

  const ownerBalance = await token.methods.balanceOf(jane).call();
  ctx.is(ownerBalance, '5000000000000000000000000');

  const ownerZxcBalance = await zxc.instance.methods.balanceOf(owner).call();
  ctx.is(ownerZxcBalance, '10000');
});

spec.test('fails when not enough balance', async (ctx) => {
  const tokenDeployGateway = ctx.get('tokenDeployGateway');
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
      supply: '5000000000000000000000000',
      decimals: '18',
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

  const claim = await tokenDeployGateway.instance.methods.getDeployDataClaim(createTuple).call();

  const signature = await ctx.web3.eth.sign(claim, jane);
  const signatureData = {
    r: signature.substr(0, 66),
    s: `0x${signature.substr(66, 64)}`,
    v: parseInt(`0x${signature.substr(130, 2)}`) + 27,
    kind: 0,
  };
  const signatureDataTuple = ctx.tuple(signatureData);

  await zxc.instance.methods.approve(tokenProxy.receipt._address, 9000).send({ from: jane });
  await ctx.reverts(() => tokenDeployGateway.instance.methods.perform(createTuple, signatureDataTuple).send({ from: owner }), '001002');
});

spec.test('fails when not specified taker', async (ctx) => {
  const tokenDeployGateway = ctx.get('tokenDeployGateway');
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
      supply: '5000000000000000000000000',
      decimals: '18',
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

  const claim = await tokenDeployGateway.instance.methods.getDeployDataClaim(createTuple).call();

  const signature = await ctx.web3.eth.sign(claim, jane);
  const signatureData = {
    r: signature.substr(0, 66),
    s: `0x${signature.substr(66, 64)}`,
    v: parseInt(`0x${signature.substr(130, 2)}`) + 27,
    kind: 0,
  };
  const signatureDataTuple = ctx.tuple(signatureData);

  await zxc.instance.methods.approve(tokenProxy.receipt._address, 10000).send({ from: jane });
  await ctx.reverts(() => tokenDeployGateway.instance.methods.perform(createTuple, signatureDataTuple).send({ from: sara }), '011002');
});

spec.test('fails with expired claim', async (ctx) => {
  const tokenDeployGateway = ctx.get('tokenDeployGateway');
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
      supply: '5000000000000000000000000',
      decimals: '18',
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

  const claim = await tokenDeployGateway.instance.methods.getDeployDataClaim(createTuple).call();

  const signature = await ctx.web3.eth.sign(claim, jane);
  const signatureData = {
    r: signature.substr(0, 66),
    s: `0x${signature.substr(66, 64)}`,
    v: parseInt(`0x${signature.substr(130, 2)}`) + 27,
    kind: 0,
  };
  const signatureDataTuple = ctx.tuple(signatureData);

  await zxc.instance.methods.approve(tokenProxy.receipt._address, 10000).send({ from: jane });
  await ctx.reverts(() => tokenDeployGateway.instance.methods.perform(createTuple, signatureDataTuple).send({ from: owner }), '011003');
});

spec.test('fails with invalid signature', async (ctx) => {
  const tokenDeployGateway = ctx.get('tokenDeployGateway');
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
      supply: '5000000000000000000000000',
      decimals: '18',
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

  const claim = await tokenDeployGateway.instance.methods.getDeployDataClaim(invalidTuple).call();

  const signature = await ctx.web3.eth.sign(claim, jane);
  const signatureData = {
    r: signature.substr(0, 66),
    s: `0x${signature.substr(66, 64)}`,
    v: parseInt(`0x${signature.substr(130, 2)}`) + 27,
    kind: 0,
  };
  const signatureDataTuple = ctx.tuple(signatureData);

  await zxc.instance.methods.approve(tokenProxy.receipt._address, 10000).send({ from: jane });
  await ctx.reverts(() => tokenDeployGateway.instance.methods.perform(createTuple, signatureDataTuple).send({ from: owner }), '011004');
});

spec.test('fails with invalid signature kind', async (ctx) => {
  const tokenDeployGateway = ctx.get('tokenDeployGateway');
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
      supply: '5000000000000000000000000',
      decimals: '18',
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

  const claim = await tokenDeployGateway.instance.methods.getDeployDataClaim(createTuple).call();

  const signature = await ctx.web3.eth.sign(claim, jane);
  const signatureData = {
    r: signature.substr(0, 66),
    s: `0x${signature.substr(66, 64)}`,
    v: parseInt(`0x${signature.substr(130, 2)}`) + 27,
    kind: 5,
  };
  const signatureDataTuple = ctx.tuple(signatureData);

  await zxc.instance.methods.approve(tokenProxy.receipt._address, 10000).send({ from: jane });
  await ctx.reverts(() => tokenDeployGateway.instance.methods.perform(createTuple, signatureDataTuple).send({ from: owner }));
});

spec.test('fails trying to perform an already performed deploy', async (ctx) => {
  const tokenDeployGateway = ctx.get('tokenDeployGateway');
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
      supply: '5000000000000000000000000',
      decimals: '18',
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

  const claim = await tokenDeployGateway.instance.methods.getDeployDataClaim(createTuple).call();

  const signature = await ctx.web3.eth.sign(claim, jane);
  const signatureData = {
    r: signature.substr(0, 66),
    s: `0x${signature.substr(66, 64)}`,
    v: parseInt(`0x${signature.substr(130, 2)}`) + 27,
    kind: 0,
  };
  const signatureDataTuple = ctx.tuple(signatureData);

  await zxc.instance.methods.approve(tokenProxy.receipt._address, 10000).send({ from: jane });
  await tokenDeployGateway.instance.methods.perform(createTuple, signatureDataTuple).send({ from: owner });
  await ctx.reverts(() => tokenDeployGateway.instance.methods.perform(createTuple, signatureDataTuple).send({ from: owner }), '011006');
});

spec.test('fails trying to perform a canceled deploy', async (ctx) => {
  const tokenDeployGateway = ctx.get('tokenDeployGateway');
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
      supply: '5000000000000000000000000',
      decimals: '18',
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

  const claim = await tokenDeployGateway.instance.methods.getDeployDataClaim(createTuple).call();

  const signature = await ctx.web3.eth.sign(claim, jane);
  const signatureData = {
    r: signature.substr(0, 66),
    s: `0x${signature.substr(66, 64)}`,
    v: parseInt(`0x${signature.substr(130, 2)}`) + 27,
    kind: 0,
  };
  const signatureDataTuple = ctx.tuple(signatureData);

  await zxc.instance.methods.approve(tokenProxy.receipt._address, 10000).send({ from: jane });
  await tokenDeployGateway.instance.methods.cancel(createTuple).send({ from: jane });
  await ctx.reverts(() => tokenDeployGateway.instance.methods.perform(createTuple, signatureDataTuple).send({ from: owner }), '011005');
});

export default spec;
