import { Spec } from '@specron/spec';
import { Context } from '@0xcert/web3-context';
import { Protocol } from '@0xcert/web3-sandbox';
import { AssetLedger } from '../../../core/ledger';
import { AssetLedgerTransferState } from '@0xcert/scaffold';

interface Data {
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
  const context = new Context({
    web3: stage.web3,
    myId: await stage.web3.eth.getCoinbase(),
  });

  stage.set('context', context);
});

spec.before(async (stage) => {
  const context = stage.get('context');
  const ledgerId = stage.get('protocol').xcertPausable.instance.options.address;

  stage.set('ledger', new AssetLedger(context, ledgerId));
});

spec.test('assignes ledger abilities for an account', async (ctx) => {
  const ledger = ctx.get('ledger');

  const state0 = await ledger.getTransferState().then((q) => q.result);
  ctx.is(state0, AssetLedgerTransferState.ENABLED);

  await ledger.setTransferState(AssetLedgerTransferState.DISABLED).then(() => ctx.sleep(200));

  const state1 = await ledger.getTransferState().then((q) => q.result);
  ctx.is(state1, AssetLedgerTransferState.DISABLED);

  await ledger.setTransferState(AssetLedgerTransferState.ENABLED).then(() => ctx.sleep(200));

  const state2 = await ledger.getTransferState().then((q) => q.result);
  ctx.is(state2, AssetLedgerTransferState.ENABLED);
});

export default spec;
