import { Spec } from '@specron/spec';
import { Context } from '@0xcert/web3-context';
import { Protocol } from '@0xcert/web3-sandbox';
import { AssetLedger } from '../../../core/ledger';

interface Data {
  context: Context
  ledger: AssetLedger;
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
  const ledgerId = stage.get('protocol').xcert.instance.options.address;

  stage.set('ledger', new AssetLedger(context, ledgerId));
});

spec.test('returns ledger total supply', async (ctx) => {
  const ledger = ctx.get('ledger');
  
  const supply = await ledger.getSupply().then((q) => q.result);

  ctx.is(supply, 0);
});

export default spec;
