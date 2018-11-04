import { Spec } from '@specron/spec';
import { Context } from '@0xcert/web3-context';
import { Protocol } from '@0xcert/web3-sandbox';
import { Vault } from '../../../core/vault';

interface Data {
  context: Context
  vault: Vault;
  protocol: Protocol;
}

const spec = new Spec<Data>();

spec.before(async (stage) => {
  const protocol = new Protocol(stage.web3);
  
  stage.set('protocol', await protocol.deploy());
});

spec.before(async (stage) => {
  const context = new Context();
  await context.attach(stage);

  stage.set('context', context);
});

spec.before(async (stage) => {
  const context = stage.get('context');
  const vaultId = stage.get('protocol').erc20.instance.options.address;

  stage.set('vault', new Vault(context, vaultId));
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
