import { Spec } from '@specron/spec';
import { GenericProvider } from '@0xcert/ethereum-generic-provider';
import { Protocol } from '@0xcert/ethereum-sandbox';
import { AssetLedger } from '../../../core/ledger';
import { AssetLedgerCapability } from '@0xcert/scaffold';

interface Data {
  coinbase: string;
  provider: GenericProvider;
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
  const provider = new GenericProvider({
    client: stage.web3,
  });

  stage.set('provider', provider);
});

spec.before(async (stage) => {
  const provider = stage.get('provider');
  const burnableAssetLedgerId = stage.get('protocol').xcertBurnable.instance.options.address;
  const mutableAssetLedgerId = stage.get('protocol').xcertMutable.instance.options.address;
  const pausableAssetLedgerId = stage.get('protocol').xcertPausable.instance.options.address;
  const revokableAssetLedgerId = stage.get('protocol').xcertRevokable.instance.options.address;

  stage.set('burnableAssetLedger', new AssetLedger(provider, burnableAssetLedgerId));
  stage.set('mutableAssetLedger', new AssetLedger(provider, mutableAssetLedgerId));
  stage.set('pausableAssetLedger', new AssetLedger(provider, pausableAssetLedgerId));
  stage.set('revokableAssetLedger', new AssetLedger(provider, revokableAssetLedgerId));
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
