import { Spec } from '@specron/spec';
import { Context } from '@0xcert/web3-context';
import { Protocol } from '@0xcert/web3-sandbox';
import { AssetLedger } from '../../../core/ledger';
import { AssetLedgerAbility } from '@0xcert/scaffold';

interface Data {
  coinbase: string;
  context: Context;
  ledger: AssetLedger;
  protocol: Protocol;
}

const spec = new Spec<Data>();

spec.before(async (stage) => {
  const protocol = new Protocol(stage.web3);
  
  stage.set('protocol', await protocol.deploy());
});

spec.before(async (stage) => {
  const context = new Context(stage);
  await context.attach();

  stage.set('context', context);
});

spec.before(async (stage) => {
  const context = stage.get('context');
  const ledgerId = stage.get('protocol').xcert.instance.options.address;

  stage.set('ledger', new AssetLedger(context, ledgerId));
});

spec.before(async (stage) => {
  const accounts = await stage.web3.eth.getAccounts();

  stage.set('coinbase', accounts[0]);
});

spec.test('returns account abilities', async (ctx) => {
  const coinbase = ctx.get('coinbase');
  const ledger = ctx.get('ledger');

  const abilities = await ledger.getAbilities(coinbase).then((q) => q.result);

  ctx.deepEqual(abilities, [
    AssetLedgerAbility.MANAGE_ABILITIES,
    AssetLedgerAbility.MINT_ASSET,
    AssetLedgerAbility.REVOKE_ASSET,
    AssetLedgerAbility.PAUSE_TRANSFER,
    AssetLedgerAbility.UPDATE_PROOF,
    AssetLedgerAbility.SIGN_MINT_CLAIM,
  ]);
});

export default spec;
