import { GenericProvider } from '@0xcert/ethereum-generic-provider';
import { Protocol } from '@0xcert/ethereum-sandbox';
import { Deploy, AssetLedgerCapability } from '@0xcert/scaffold';
import { Spec } from '@specron/spec';
import { DeployGateway } from '../../../core/gateway';
import { createDeployHash } from '../../../lib/deploy';

interface Data {
  protocol: Protocol;
  makerGenericProvider: GenericProvider;
  claim: string;
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

  const makerGenericProvider = new GenericProvider({
    client: stage.web3,
    accountId: coinbase,
  });

  stage.set('makerGenericProvider', makerGenericProvider);
});

spec.test('check if deploy data claim equals locally created one', async (ctx) => {
  const coinbase = ctx.get('coinbase');
  const bob = ctx.get('bob');
  const token = ctx.get('protocol').erc20.instance.options.address;

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
      ledgerId: token,
      receiverId: coinbase,
      value: '10000',
    },
  };

  const provider = ctx.get('makerGenericProvider');
  const deployGatewayId = ctx.get('protocol').deployGateway.instance.options.address;

  const deployGateway = new DeployGateway(provider, deployGatewayId);
  const claim = await deployGateway.getDeployDataClaim(deploy);

  const localClaim = createDeployHash(deployGateway, deploy);

  ctx.is(claim, localClaim);
});

export default spec;
