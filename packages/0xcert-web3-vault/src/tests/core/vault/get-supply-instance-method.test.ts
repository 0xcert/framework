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

  stage.set('vault', new Vault(connector, vaultId));
});

spec.test('returns vault total supply', async (ctx) => {
  const vault = ctx.get('vault');
  
  const supply = await vault.getSupply().then((q) => q.result);

  ctx.is(supply, 300000000000000000000000000);
});

export default spec;
