import { Spec } from '@specron/spec';
import { GenericProvider } from '@0xcert/ethereum-generic-provider';
import { Protocol } from '@0xcert/ethereum-sandbox';
import { AssetLedger } from '../../../core/ledger';
import { AssetLedgerAbility } from '@0xcert/scaffold';

const spec = new Spec<{
  provider: GenericProvider;
  ledger: AssetLedger;
  protocol: Protocol;
  bob: string;
}>();

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
  const ledgerId = stage.get('protocol').xcert.instance.options.address;
  stage.set('ledger', new AssetLedger(provider, ledgerId));
});

spec.before(async (stage) => {
  const accounts = await stage.web3.eth.getAccounts();
  stage.set('bob', accounts[1]);
});

spec.test('assignes ledger abilities for an account', async (ctx) => {
  const ledger = ctx.get('ledger');
  const bob = ctx.get('bob');
  await ledger.assignAbilities(bob, [AssetLedgerAbility.MINT_ASSET]);
  const abilities = await ledger.getAbilities(bob);
  ctx.deepEqual(abilities, [AssetLedgerAbility.MINT_ASSET]);
});

export default spec;
