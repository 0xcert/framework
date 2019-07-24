import { GenericProvider } from '@0xcert/ethereum-generic-provider';
import { Protocol } from '@0xcert/ethereum-sandbox';
import { Spec } from '@specron/spec';
import { AssetLedger } from '../../../core/ledger';

const spec = new Spec<{
  provider: GenericProvider;
  ledger: AssetLedger;
  protocol: Protocol;
}>();

spec.before(async (stage) => {
  const protocol = new Protocol(stage.web3);
  stage.set('protocol', await protocol.deploy());
});

spec.before(async (stage) => {
  const provider = new GenericProvider({
    client: stage.web3,
    accountId: await stage.web3.eth.getCoinbase(),
    requiredConfirmations: 0,
  });
  stage.set('provider', provider);
});

spec.before(async (stage) => {
  const provider = stage.get('provider');
  const ledgerId = stage.get('protocol').xcertPausable.instance.options.address;
  stage.set('ledger', new AssetLedger(provider, ledgerId));
});

spec.test('grants ledger abilities for an account', async (ctx) => {
  const ledger = ctx.get('ledger');
  ctx.true(await ledger.isTransferable());
  const mutation = await ledger.disableTransfers();
  await mutation.complete();
  ctx.is((mutation.logs[0]).event, 'IsPaused');
  ctx.false(await ledger.isTransferable());
  await ledger.enableTransfers().then(() => ctx.sleep(200));
  ctx.true(await ledger.isTransferable());
});

export default spec;
