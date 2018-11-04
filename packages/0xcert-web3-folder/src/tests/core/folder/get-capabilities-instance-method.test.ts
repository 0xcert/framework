import { Spec } from '@specron/spec';
import { Context } from '@0xcert/web3-context';
import { Protocol } from '@0xcert/web3-sandbox';
import { Folder } from '../../../core/folder';
import { FolderAbility, FolderCapability } from '@0xcert/scaffold';

interface Data {
  coinbase: string;
  context: Context
  protocol: Protocol;
  burnableFolder: Folder;
  mutableFolder: Folder;
  pausableFolder: Folder;
  revokableFolder: Folder;
}

const spec = new Spec<Data>();

spec.before(async (stage) => {
  const protocol = new Protocol(stage.web3);
  
  stage.set('protocol', await protocol.deploy());
});

spec.before(async (stage) => {
  const context = new Context();
  await context.attach(stage);

  stage.set('context', context);
});

spec.before(async (stage) => {
  const context = stage.get('context');
  const burnableFolderId = stage.get('protocol').xcertBurnable.instance.options.address;
  const mutableFolderId = stage.get('protocol').xcertMutable.instance.options.address;
  const pausableFolderId = stage.get('protocol').xcertPausable.instance.options.address;
  const revokableFolderId = stage.get('protocol').xcertRevokable.instance.options.address;

  stage.set('burnableFolder', new Folder(context, burnableFolderId));
  stage.set('mutableFolder', new Folder(context, mutableFolderId));
  stage.set('pausableFolder', new Folder(context, pausableFolderId));
  stage.set('revokableFolder', new Folder(context, revokableFolderId));
});

spec.before(async (stage) => {
  const accounts = await stage.web3.eth.getAccounts();

  stage.set('coinbase', accounts[0]);
});

spec.test('returns folder capabilities', async (ctx) => {
  const coinbase = ctx.get('coinbase');
  const burnableFolder = ctx.get('burnableFolder');
  const mutableFolder = ctx.get('mutableFolder');
  const pausableFolder = ctx.get('pausableFolder');
  const revokableFolder = ctx.get('revokableFolder');

  ctx.deepEqual(
    await burnableFolder.getCapabilities().then((q) => q.result),
    [FolderCapability.BURNABLE],
  );
  ctx.deepEqual(
    await mutableFolder.getCapabilities().then((q) => q.result),
    [FolderCapability.MUTABLE],
  );
  ctx.deepEqual(
    await pausableFolder.getCapabilities().then((q) => q.result),
    [FolderCapability.PAUSABLE],
  );
  ctx.deepEqual(
    await revokableFolder.getCapabilities().then((q) => q.result),
    [FolderCapability.REVOKABLE],
  );
});

export default spec;
