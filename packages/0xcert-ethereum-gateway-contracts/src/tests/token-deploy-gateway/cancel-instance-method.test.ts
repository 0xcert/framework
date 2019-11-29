import { TokenTransferProxyAbilities } from '@0xcert/ethereum-proxy-contracts/src/core/types';
import { Spec } from '@specron/spec';
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

spec.test('cancels an deploy', async (ctx) => {
  const tokenDeployGateway = ctx.get('tokenDeployGateway');
  const zxc = ctx.get('zxc');
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

  const logs = await tokenDeployGateway.instance.methods.cancel(createTuple).send({ from: jane });
  ctx.not(logs.events.Cancel, undefined);
});

spec.test('fails when not the maker tries to cancel deploy', async (ctx) => {
  const tokenDeployGateway = ctx.get('tokenDeployGateway');
  const zxc = ctx.get('zxc');
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

  await ctx.reverts(() => tokenDeployGateway.instance.methods.cancel(createTuple).send({ from: owner }), '011007');
});

spec.test('fails when trying to cancel an alredy performed deploy', async (ctx) => {
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

  await ctx.reverts(() => tokenDeployGateway.instance.methods.cancel(createTuple).send({ from: jane }), '011006');
});

export default spec;
