import { Spec } from '@specron/spec';
import { GenericProvider } from '@0xcert/ethereum-generic-provider';
import { Protocol } from '@0xcert/ethereum-sandbox';
import { AssetLedger } from '../../../core/ledger';

interface Data {
  provider: GenericProvider;
  ledger: AssetLedger;
  protocol: Protocol;
}

const spec = new Spec<Data>();

spec.before(async (stage) => {
  const protocol = new Protocol(stage.web3);
  
  stage.set('protocol', await protocol.deploy());
});

spec.before(async (stage) => {
  const provider = new GenericProvider({
    client: stage.web3,
    accountId: await stage.web3.eth.getCoinbase(),
  });

  stage.set('provider', provider);
});

spec.before(async (stage) => {
  const provider = stage.get('provider');
  const ledgerId = stage.get('protocol').xcertPausable.instance.options.address;

  stage.set('ledger', new AssetLedger(provider, ledgerId));
});

spec.test('assignes ledger abilities for an account', async (ctx) => {
  const ledger = ctx.get('ledger');

  const enabled0 = await ledger.isTransferable();
  ctx.true(enabled0);

  await ledger.disableTransfer().then(() => ctx.sleep(200));

  const enabled1 = await ledger.isTransferable();
  ctx.false(enabled1);

  await ledger.enableTransfer().then(() => ctx.sleep(200));

  const enabled2 = await ledger.isTransferable();
  ctx.true(enabled2);
});

export default spec;
