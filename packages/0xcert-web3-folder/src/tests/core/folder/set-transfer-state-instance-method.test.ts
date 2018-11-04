import { Spec } from '@specron/spec';
import { Connector } from '@0xcert/web3-connector';
import { Protocol } from '@0xcert/web3-sandbox';
import { Folder } from '../../../core/folder';
import { FolderTransferState } from '@0xcert/scaffold';

interface Data {
  connector: Connector
  folder: Folder;
  protocol: Protocol;
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
  const folderId = stage.get('protocol').xcertPausable.instance.options.address;

  stage.set('folder', new Folder(connector, folderId));
});

spec.test('assignes folder abilities for an account', async (ctx) => {
  const folder = ctx.get('folder');

  const state0 = await folder.getTransferState().then((q) => q.result);
  ctx.is(state0, FolderTransferState.ENABLED);

  await folder.setTransferState(FolderTransferState.DISABLED).then(() => ctx.sleep(200));

  const state1 = await folder.getTransferState().then((q) => q.result);
  ctx.is(state1, FolderTransferState.DISABLED);

  await folder.setTransferState(FolderTransferState.ENABLED).then(() => ctx.sleep(200));

  const state2 = await folder.getTransferState().then((q) => q.result);
  ctx.is(state2, FolderTransferState.ENABLED);
});

export default spec;
