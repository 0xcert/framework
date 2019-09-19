import { GenericProvider } from '@0xcert/ethereum-generic-provider';
import { Protocol } from '@0xcert/ethereum-sandbox';
import { GeneralAssetLedgerAbility, SuperAssetLedgerAbility } from '@0xcert/scaffold';
import { Spec } from '@specron/spec';
import { AssetLedger } from '../../../core/ledger';

const spec = new Spec<{
  protocol: Protocol;
  provider: GenericProvider;
  coinbase: string;
}>();

spec.before(async (stage) => {
  const protocol = new Protocol(stage.web3);
  stage.set('protocol', await protocol.deploy());
});

spec.before(async (stage) => {
  const provider = new GenericProvider({
    client: stage.web3,
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
  stage.set('coinbase', accounts[0]);
});

spec.test('returns account abilities (Xcert smart contract)', async (ctx) => {
  const coinbase = ctx.get('coinbase');
  const provider = ctx.get('provider');
  const ledgerId = ctx.get('protocol').xcert.instance.options.address;
  const ledger = new AssetLedger(provider, ledgerId);
  const abilities = await ledger.getAbilities(coinbase);
  ctx.deepEqual(abilities, [
    SuperAssetLedgerAbility.MANAGE_ABILITIES,
    GeneralAssetLedgerAbility.CREATE_ASSET,
    GeneralAssetLedgerAbility.REVOKE_ASSET,
    GeneralAssetLedgerAbility.TOGGLE_TRANSFERS,
    GeneralAssetLedgerAbility.UPDATE_ASSET,
    GeneralAssetLedgerAbility.UPDATE_URI_BASE,
    GeneralAssetLedgerAbility.ALLOW_CREATE_ASSET,
    GeneralAssetLedgerAbility.ALLOW_UPDATE_ASSET_IMPRINT,
  ]);
});

spec.test('returns account abilities (erc721 smart contract)', async (ctx) => {
  const coinbase = ctx.get('coinbase');
  const provider = ctx.get('provider');
  const ledgerId = ctx.get('protocol').erc721.instance.options.address;
  const ledger = new AssetLedger(provider, ledgerId);
  ctx.deepEqual(await ledger.getAbilities(coinbase), []);
});

export default spec;
