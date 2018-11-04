import { Spec } from '@specron/spec';
import { Context } from '@0xcert/web3-context';
import { Protocol } from '@0xcert/web3-sandbox';
import { AssetLedger } from '../../../core/ledger';
import { AssetLedgerAbility } from '@0xcert/scaffold';

interface Data {
  context: Context
  ledger: AssetLedger;
  protocol: Protocol;
  bob: string;
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

spec.before(async (stage) => {
  const accounts = await stage.web3.eth.getAccounts();

  stage.set('bob', accounts[1]);
});

spec.test('assignes ledger abilities for an account', async (ctx) => {
  const ledger = ctx.get('ledger');
  const bob = ctx.get('bob');
  
  await ledger.assignAbilities(bob, [AssetLedgerAbility.MINT_ASSET]).then(() => ctx.sleep(200));

  const abilities = await ledger.getAbilities(bob).then((q) => q.result);
  ctx.deepEqual(abilities, [AssetLedgerAbility.MINT_ASSET]);
});

export default spec;
