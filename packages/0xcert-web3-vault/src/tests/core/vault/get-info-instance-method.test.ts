import { Spec } from '@specron/spec';
import { Connector } from '@0xcert/web3-connector';
import { Protocol } from '@0xcert/web3-sandbox';
import { Vault } from '../../../core/vault';

interface Data {
  connector: Connector
  vault: Vault;
  protocol: Protocol;
}

const spec = new Spec<Data>();

spec.before(async (stage) => {
  const protocol = new Protocol(stage.web3);
  
  stage.set('protocol', await protocol.deploy());
});

spec.before(async (stage) => {
  const connector = new Connector();
  await connector.attach(stage);

  stage.set('connector', connector);
});

spec.before(async (stage) => {
  const connector = stage.get('connector');
  const vaultId = stage.get('protocol').erc20.instance.options.address;

  stage.set('vault', new Vault(vaultId, connector));
});

spec.test('returns vault info', async (ctx) => {
  const vault = ctx.get('vault');
  
  const info = await vault.getInfo().then((q) => q.result);

  ctx.deepEqual(info, {
    name: "Mock Token",
    symbol: "MCK",
    decimals: 18,
  });
});

export default spec;
