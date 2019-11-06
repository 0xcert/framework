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
  jane: string;
  owner: string;
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
  stage.set('owner', accounts[0]);
  stage.set('bob', accounts[1]);
  stage.set('jane', accounts[2]);
});

spec.test('revokes ledger abilities for an account', async (ctx) => {
  const ledger = ctx.get('ledger');
  const bob = ctx.get('bob');
  await ledger.grantAbilities(bob, [GeneralAssetLedgerAbility.CREATE_ASSET, GeneralAssetLedgerAbility.UPDATE_URI_BASE]).then(() => ctx.sleep(200));
  const mutation = await ledger.revokeAbilities(bob, [GeneralAssetLedgerAbility.UPDATE_URI_BASE]);
  await mutation.complete();
  ctx.is((mutation.logs[0]).event, 'SetAbilities');
  const abilities = await ledger.getAbilities(bob);
  ctx.deepEqual(abilities, [GeneralAssetLedgerAbility.CREATE_ASSET]);
});

spec.test('revokes ledger super abilities for an account', async (ctx) => {
  const ledger = ctx.get('ledger');
  const jane = ctx.get('jane');
  await ledger.grantAbilities(jane, [SuperAssetLedgerAbility.MANAGE_ABILITIES]).then(() => ctx.sleep(200));
  await ledger.revokeAbilities(jane, [SuperAssetLedgerAbility.MANAGE_ABILITIES]).then(() => ctx.sleep(200));
  const abilities = await ledger.getAbilities(jane);
  ctx.deepEqual(abilities, []);
});

spec.test('revokes own super ability', async (ctx) => {
  const ledger = ctx.get('ledger');
  const owner = ctx.get('owner');
  await ledger.revokeAbilities(owner, [SuperAssetLedgerAbility.MANAGE_ABILITIES]).then(() => ctx.sleep(200));
  const abilities = await ledger.getAbilities(owner);
  ctx.deepEqual(abilities, [
    GeneralAssetLedgerAbility.CREATE_ASSET,
    GeneralAssetLedgerAbility.REVOKE_ASSET,
    GeneralAssetLedgerAbility.TOGGLE_TRANSFERS,
    GeneralAssetLedgerAbility.UPDATE_ASSET,
    GeneralAssetLedgerAbility.UPDATE_URI_BASE,
    GeneralAssetLedgerAbility.ALLOW_CREATE_ASSET,
    GeneralAssetLedgerAbility.ALLOW_UPDATE_ASSET_IMPRINT,
  ]);
});

export default spec;
