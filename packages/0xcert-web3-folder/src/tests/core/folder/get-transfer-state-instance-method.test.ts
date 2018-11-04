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

spec.test('returns folder transfer state', async (ctx) => {
  const folder = ctx.get('folder');
  
  const state = await folder.getTransferState().then((q) => q.result);

  ctx.is(state, FolderTransferState.ENABLED);
});

export default spec;
