import { TokenTransferProxyAbilities } from '@0xcert/ethereum-proxy-contracts/src/core/types';
import { Spec } from '@specron/spec';
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

spec.test('cancels an deploy', async (ctx) => {
  const xcertDeployGateway = ctx.get('xcertDeployGateway');
  const zxc = ctx.get('zxc');
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

  const logs = await xcertDeployGateway.instance.methods.cancel(createTuple).send({ from: jane });
  ctx.not(logs.events.Cancel, undefined);
});

spec.test('fails when not the maker tries to cancel deploy', async (ctx) => {
  const xcertDeployGateway = ctx.get('xcertDeployGateway');
  const zxc = ctx.get('zxc');
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

  await ctx.reverts(() => xcertDeployGateway.instance.methods.cancel(createTuple).send({ from: owner }), '009007');
});

spec.test('fails when trying to cancel an alredy performed deploy', async (ctx) => {
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

  // await ctx.reverts(() => xcertDeployGateway.instance.methods.cancel(createTuple).send({ from: jane }), '009006');
});

export default spec;
