import { Spec } from '@specron/spec';
import { Context } from '@0xcert/web3-context';
import { Protocol } from '@0xcert/web3-sandbox';
import { Folder } from '../../../core/folder';
import { FolderTransferState } from '@0xcert/scaffold';

interface Data {
  context: Context
  folder: Folder;
  protocol: Protocol;
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
  const folderId = stage.get('protocol').xcertPausable.instance.options.address;

  stage.set('folder', new Folder(context, folderId));
});

spec.test('returns folder transfer state', async (ctx) => {
  const folder = ctx.get('folder');
  
  const state = await folder.getTransferState().then((q) => q.result);

  ctx.is(state, FolderTransferState.ENABLED);
});

export default spec;
