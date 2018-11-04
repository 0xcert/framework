import { Spec } from '@specron/spec';
import { Connector } from '@0xcert/web3-connector';
import { Protocol } from '@0xcert/web3-sandbox';
import { Folder } from '../../../core/folder';
import { FolderAbility, FolderCapability } from '@0xcert/scaffold';

interface Data {
  coinbase: string;
  connector: Connector
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
  const connector = new Connector();
  await connector.attach(stage);

  stage.set('connector', connector);
});

spec.before(async (stage) => {
  const connector = stage.get('connector');
  const burnableFolderId = stage.get('protocol').xcertBurnable.instance.options.address;
  const mutableFolderId = stage.get('protocol').xcertMutable.instance.options.address;
  const pausableFolderId = stage.get('protocol').xcertPausable.instance.options.address;
  const revokableFolderId = stage.get('protocol').xcertRevokable.instance.options.address;

  stage.set('burnableFolder', new Folder(connector, burnableFolderId));
  stage.set('mutableFolder', new Folder(connector, mutableFolderId));
  stage.set('pausableFolder', new Folder(connector, pausableFolderId));
  stage.set('revokableFolder', new Folder(connector, revokableFolderId));
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
