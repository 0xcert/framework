import { GenericProvider } from '@0xcert/ethereum-generic-provider';
import { Protocol } from '@0xcert/ethereum-sandbox';
import { AssetLedgerCapability, Deploy } from '@0xcert/scaffold';
import { Spec } from '@specron/spec';
import { DeployGateway } from '../../../core/gateway';
import { createDeployHash } from '../../../lib/deploy';

interface Data {
  protocol: Protocol;
  coinbaseGenericProvider: GenericProvider;
  bobGenericProvider: GenericProvider;
  coinbase: string;
  bob: string;
}

const spec = new Spec<Data>();

spec.before(async (stage) => {
  const protocol = new Protocol(stage.web3);
  stage.set('protocol', await protocol.deploy());
});

spec.before(async (stage) => {
  const accounts = await stage.web3.eth.getAccounts();
  stage.set('coinbase', accounts[0]);
  stage.set('bob', accounts[1]);
});

spec.before(async (stage) => {
  const coinbase = stage.get('coinbase');
  const bob = stage.get('bob');

  const coinbaseGenericProvider = new GenericProvider({
    client: stage.web3,
    accountId: coinbase,
  });
  const bobGenericProvider = new GenericProvider({
    client: stage.web3,
    accountId: bob,
  });

  stage.set('coinbaseGenericProvider', coinbaseGenericProvider);
  stage.set('bobGenericProvider', bobGenericProvider);
});

spec.before(async (stage) => {
  const coinbase = stage.get('coinbase');
  const bob = stage.get('bob');

  const erc20 = stage.get('protocol').erc20;
  const tokenTransferProxy = stage.get('protocol').tokenTransferProxy.instance.options.address;

  await erc20.instance.methods.transfer(bob, 100000).send({ form: coinbase });
  await erc20.instance.methods.approve(tokenTransferProxy, 100000).send({ from: bob });
});

spec.test('submits deployGateway deploy to the network which executes transfer and creates a new xcert', async (ctx) => {
  const coinbase = ctx.get('coinbase');
  const bob = ctx.get('bob');
  const token = ctx.get('protocol').erc20;
  const tokenId = ctx.get('protocol').erc20.instance.options.address;
  const bobGenericProvider = ctx.get('bobGenericProvider');
  const coinbaseGenericProvider = ctx.get('coinbaseGenericProvider');

  const deploy: Deploy = {
    makerId: bob,
    takerId: coinbase,
    seed: 1535113220.12345, // should handle floats
    expiration: Date.now() * 60.1234, // should handle floats
    assetLedgerData: {
      name: 'test',
      symbol: 'TST',
      uriBase: 'https://base.com/',
      schemaId: '0x9c22ff5f21f0b81b113e63f7db6da94fedef11b2119b4088b89664fb9a3cb658',
      capabilities: [AssetLedgerCapability.TOGGLE_TRANSFERS, AssetLedgerCapability.DESTROY_ASSET],
      owner: bob,
    },
    tokenTransferData: {
      ledgerId: tokenId,
      receiverId: coinbase,
      value: '50000',
    },
  };

  const deployGatewayId = ctx.get('protocol').deployGateway.instance.options.address;

  const deployGatewayBob = new DeployGateway(bobGenericProvider, deployGatewayId);
  const claim = await deployGatewayBob.claim(deploy);

  const deployGatewayCoinbase = new DeployGateway(coinbaseGenericProvider, deployGatewayId);
  const mutation = await deployGatewayCoinbase.perform(deploy, claim);
  const receipt = await ctx.web3.eth.getTransactionReceipt(mutation.id);

  const performEvent = receipt.logs.filter((r) => { return r.topics[0] === '0x492318801c2cec532d47019a0b69f83b8d5b499a022b7adb6100a766050644f2'; });
  const xcertAddress = (deployGatewayCoinbase.provider.encoder.decodeParameters(['address', 'bytes32'], performEvent[0].data))[0];

  const xcert = ctx.get('protocol').xcert;
  xcert.instance.options.address = xcertAddress;

  const xcertName = await xcert.instance.methods.name().call();
  ctx.is(xcertName, 'test');

  ctx.is(await token.instance.methods.balanceOf(bob).call(), '50000');
});

spec.test('submits dynamic deployGateway deploy to the network which executes transfer and creates a new xcert', async (ctx) => {
  const coinbase = ctx.get('coinbase');
  const bob = ctx.get('bob');
  const token = ctx.get('protocol').erc20;
  const tokenId = ctx.get('protocol').erc20.instance.options.address;
  const bobGenericProvider = ctx.get('bobGenericProvider');
  const coinbaseGenericProvider = ctx.get('coinbaseGenericProvider');

  const deploy: Deploy = {
    makerId: bob,
    seed: 1535113220.12345, // should handle floats
    expiration: Date.now() * 60.1234, // should handle floats
    assetLedgerData: {
      name: 'test',
      symbol: 'TST',
      uriBase: 'https://base.com/',
      schemaId: '0x9c22ff5f21f0b81b113e63f7db6da94fedef11b2119b4088b89664fb9a3cb658',
      capabilities: [AssetLedgerCapability.TOGGLE_TRANSFERS, AssetLedgerCapability.DESTROY_ASSET],
      owner: bob,
    },
    tokenTransferData: {
      ledgerId: tokenId,
      receiverId: coinbase,
      value: '50000',
    },
  };

  const deployGatewayId = ctx.get('protocol').deployGateway.instance.options.address;

  const deployGatewayBob = new DeployGateway(bobGenericProvider, deployGatewayId);
  const claim = await deployGatewayBob.claim(deploy);

  const deployGatewayCoinbase = new DeployGateway(coinbaseGenericProvider, deployGatewayId);
  const mutation = await deployGatewayCoinbase.perform(deploy, claim);
  const receipt = await ctx.web3.eth.getTransactionReceipt(mutation.id);

  const performEvent = receipt.logs.filter((r) => { return r.topics[0] === '0x492318801c2cec532d47019a0b69f83b8d5b499a022b7adb6100a766050644f2'; });
  const xcertAddress = (deployGatewayCoinbase.provider.encoder.decodeParameters(['address', 'bytes32'], performEvent[0].data))[0];

  const xcert = ctx.get('protocol').xcert;
  xcert.instance.options.address = xcertAddress;

  const xcertName = await xcert.instance.methods.name().call();
  ctx.is(xcertName, 'test');

  ctx.is(await token.instance.methods.balanceOf(bob).call(), '0');
});

export default spec;
