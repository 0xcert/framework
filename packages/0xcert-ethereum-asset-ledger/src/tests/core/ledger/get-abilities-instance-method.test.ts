import { Spec } from '@specron/spec';
import { GenericProvider } from '@0xcert/ethereum-generic-provider';
import { Protocol } from '@0xcert/ethereum-sandbox';
import { AssetLedger } from '../../../core/ledger';
import { AssetLedgerAbility } from '@0xcert/scaffold';

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

spec.test('returns account abilities (xcert smart contract)', async (ctx) => {
  const coinbase = ctx.get('coinbase');
  const provider = ctx.get('provider');
  const ledgerId = ctx.get('protocol').xcert.instance.options.address;
  const ledger = new AssetLedger(provider, ledgerId);
  const abilities = await ledger.getAbilities(coinbase);
  ctx.deepEqual(abilities, [
    AssetLedgerAbility.MANAGE_ABILITIES,
    AssetLedgerAbility.MINT_ASSET,
    AssetLedgerAbility.REVOKE_ASSET,
    AssetLedgerAbility.PAUSE_TRANSFER,
    AssetLedgerAbility.UPDATE_PROOF,
    AssetLedgerAbility.SIGN_MINT_CLAIM,
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
