import { Spec } from '@specron/spec';
import { Context } from '@0xcert/web3-context';
import { Protocol } from '@0xcert/web3-sandbox';
import { AssetLedger } from '../../../core/ledger';
import { AssetLedgerCapability } from '@0xcert/scaffold';

interface Data {
  coinbase: string;
  context: Context
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
  const context = new Context(stage);
  await context.attach();

  stage.set('context', context);
});

spec.before(async (stage) => {
  const context = stage.get('context');
  const burnableAssetLedgerId = stage.get('protocol').xcertBurnable.instance.options.address;
  const mutableAssetLedgerId = stage.get('protocol').xcertMutable.instance.options.address;
  const pausableAssetLedgerId = stage.get('protocol').xcertPausable.instance.options.address;
  const revokableAssetLedgerId = stage.get('protocol').xcertRevokable.instance.options.address;

  stage.set('burnableAssetLedger', new AssetLedger(context, burnableAssetLedgerId));
  stage.set('mutableAssetLedger', new AssetLedger(context, mutableAssetLedgerId));
  stage.set('pausableAssetLedger', new AssetLedger(context, pausableAssetLedgerId));
  stage.set('revokableAssetLedger', new AssetLedger(context, revokableAssetLedgerId));
});

spec.before(async (stage) => {
  const accounts = await stage.web3.eth.getAccounts();

  stage.set('coinbase', accounts[0]);
});

spec.test('returns ledger capabilities', async (ctx) => {
  const coinbase = ctx.get('coinbase');
  const burnableAssetLedger = ctx.get('burnableAssetLedger');
  const mutableAssetLedger = ctx.get('mutableAssetLedger');
  const pausableAssetLedger = ctx.get('pausableAssetLedger');
  const revokableAssetLedger = ctx.get('revokableAssetLedger');

  ctx.deepEqual(
    await burnableAssetLedger.getCapabilities().then((q) => q.result),
    [AssetLedgerCapability.BURNABLE],
  );
  ctx.deepEqual(
    await mutableAssetLedger.getCapabilities().then((q) => q.result),
    [AssetLedgerCapability.MUTABLE],
  );
  ctx.deepEqual(
    await pausableAssetLedger.getCapabilities().then((q) => q.result),
    [AssetLedgerCapability.PAUSABLE],
  );
  ctx.deepEqual(
    await revokableAssetLedger.getCapabilities().then((q) => q.result),
    [AssetLedgerCapability.REVOKABLE],
  );
});

export default spec;
