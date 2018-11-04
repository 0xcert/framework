import { Spec } from '@specron/spec';
import { Context } from '@0xcert/web3-context';
import { Protocol } from '@0xcert/web3-sandbox';
import { Folder } from '../../../core/folder';
import { FolderAbility } from '@0xcert/scaffold';

interface Data {
  context: Context
  folder: Folder;
  protocol: Protocol;
  bob: string;
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

spec.before(async (stage) => {
  const accounts = await stage.web3.eth.getAccounts();

  stage.set('bob', accounts[1]);
});

spec.test('revokes folder abilities for an account', async (ctx) => {
  const folder = ctx.get('folder');
  const bob = ctx.get('bob');
  
  await folder.assignAbilities(bob, [FolderAbility.MINT_ASSET, FolderAbility.SIGN_MINT_CLAIM]).then(() => ctx.sleep(200));
  await folder.revokeAbilities(bob, [FolderAbility.SIGN_MINT_CLAIM]).then(() => ctx.sleep(200));

  const abilities = await folder.getAbilities(bob).then((q) => q.result);
  ctx.deepEqual(abilities, [FolderAbility.MINT_ASSET]);
});

export default spec;
