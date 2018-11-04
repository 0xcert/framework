import { Spec } from '@specron/spec';
import { Context } from '@0xcert/web3-context';
import { Protocol } from '@0xcert/web3-sandbox';
import { Folder } from '../../../core/folder';

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
  const folderId = stage.get('protocol').xcert.instance.options.address;

  stage.set('folder', new Folder(context, folderId));
});

spec.test('returns folder info', async (ctx) => {
  const folder = ctx.get('folder');
  
  const info = await folder.getInfo().then((q) => q.result);

  ctx.deepEqual(info, {
    name: 'Xcert',
    symbol: 'Xcert',
    uriBase: 'http://0xcert.org/',
    conventionId: 'Xcert',
  });
});

export default spec;
