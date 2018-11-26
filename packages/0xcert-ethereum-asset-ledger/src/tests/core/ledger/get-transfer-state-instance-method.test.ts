import { Spec } from '@specron/spec';
import { Connector } from '@0xcert/ethereum-connector';
import { Protocol } from '@0xcert/ethereum-sandbox';
import { AssetLedger } from '../../../core/ledger';
import { AssetLedgerTransferState } from '@0xcert/scaffold';

interface Data {
  connector: Connector;
  ledger: AssetLedger;
  protocol: Protocol;
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
  const ledgerId = stage.get('protocol').xcertPausable.instance.options.address;

  stage.set('ledger', new AssetLedger(connector, ledgerId));
});

spec.test('returns ledger transfer state', async (ctx) => {
  const ledger = ctx.get('ledger');
  
  const state = await ledger.getTransferState();

  ctx.is(state, AssetLedgerTransferState.ENABLED);
});

export default spec;
