import { Spec } from '@specron/spec';
import { Connector } from '@0xcert/ethereum-connector';
import { Protocol } from '@0xcert/ethereum-sandbox';
import { AssetLedger } from '../../../core/ledger';
import { AssetLedgerAbility } from '@0xcert/scaffold';

interface Data {
  protocol: Protocol;
  connector: Connector;
  ledger: AssetLedger;
  coinbase: string;
}

const spec = new Spec<Data>();

spec.before(async (stage) => {
  const protocol = new Protocol(stage.web3);
  
  stage.set('protocol', await protocol.deploy());
});

spec.before(async (stage) => {
  const connector = new Connector({
    provider: stage.web3,
  });

  stage.set('connector', connector);
});

spec.before(async (stage) => {
  const connector = stage.get('connector');
  const ledgerId = stage.get('protocol').xcert.instance.options.address;

  stage.set('ledger', new AssetLedger(connector, ledgerId));
});

spec.before(async (stage) => {
  const accounts = await stage.web3.eth.getAccounts();

  stage.set('coinbase', accounts[0]);
});

spec.test('returns account abilities', async (ctx) => {
  const coinbase = ctx.get('coinbase');
  const ledger = ctx.get('ledger');

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

export default spec;
