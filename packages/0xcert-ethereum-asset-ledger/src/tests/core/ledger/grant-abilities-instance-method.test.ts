import { GenericProvider } from '@0xcert/ethereum-generic-provider';
import { Protocol } from '@0xcert/ethereum-sandbox';
import { GeneralAssetLedgerAbility, SuperAssetLedgerAbility } from '@0xcert/scaffold';
import { Spec } from '@specron/spec';
import { AssetLedger } from '../../../core/ledger';

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
    requiredConfirmations: 0,
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

spec.test('grants ledger abilities for an account', async (ctx) => {
  const ledger = ctx.get('ledger');
  const bob = ctx.get('bob');
  const mutation = await ledger.grantAbilities(bob, [GeneralAssetLedgerAbility.CREATE_ASSET, GeneralAssetLedgerAbility.TOGGLE_TRANSFERS]);
  await mutation.complete();
  ctx.is((mutation.logs[0]).event, 'SetAbilities');
  const abilities = await ledger.getAbilities(bob);
  ctx.deepEqual(abilities, [GeneralAssetLedgerAbility.CREATE_ASSET, GeneralAssetLedgerAbility.TOGGLE_TRANSFERS]);
});

export default spec;
