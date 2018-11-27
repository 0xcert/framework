import { Spec } from '@specron/spec';
import { Connector } from '@0xcert/ethereum-connector';
import { Protocol } from '@0xcert/ethereum-sandbox';
import { AssetLedger } from '../../../core/ledger';
import { AssetLedgerCapability } from '@0xcert/scaffold';

interface Data {
  coinbase: string;
  connector: Connector;
  protocol: Protocol;
  burnableAssetLedger: AssetLedger;
  mutableAssetLedger: AssetLedger;
  pausableAssetLedger: AssetLedger;
  revokableAssetLedger: AssetLedger;
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
  const burnableAssetLedgerId = stage.get('protocol').xcertBurnable.instance.options.address;
  const mutableAssetLedgerId = stage.get('protocol').xcertMutable.instance.options.address;
  const pausableAssetLedgerId = stage.get('protocol').xcertPausable.instance.options.address;
  const revokableAssetLedgerId = stage.get('protocol').xcertRevokable.instance.options.address;

  stage.set('burnableAssetLedger', new AssetLedger(connector, burnableAssetLedgerId));
  stage.set('mutableAssetLedger', new AssetLedger(connector, mutableAssetLedgerId));
  stage.set('pausableAssetLedger', new AssetLedger(connector, pausableAssetLedgerId));
  stage.set('revokableAssetLedger', new AssetLedger(connector, revokableAssetLedgerId));
});

spec.before(async (stage) => {
  const accounts = await stage.web3.eth.getAccounts();

  stage.set('coinbase', accounts[0]);
});

spec.test('returns ledger capabilities', async (ctx) => {
  const burnableAssetLedger = ctx.get('burnableAssetLedger');
  const mutableAssetLedger = ctx.get('mutableAssetLedger');
  const pausableAssetLedger = ctx.get('pausableAssetLedger');
  const revokableAssetLedger = ctx.get('revokableAssetLedger');

  ctx.deepEqual(
    await burnableAssetLedger.getCapabilities(),
    [AssetLedgerCapability.BURNABLE],
  );
  ctx.deepEqual(
    await mutableAssetLedger.getCapabilities(),
    [AssetLedgerCapability.MUTABLE],
  );
  ctx.deepEqual(
    await pausableAssetLedger.getCapabilities(),
    [AssetLedgerCapability.PAUSABLE],
  );
  ctx.deepEqual(
    await revokableAssetLedger.getCapabilities(),
    [AssetLedgerCapability.REVOKABLE],
  );
});

export default spec;
