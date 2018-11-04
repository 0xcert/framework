import { Spec } from '@specron/spec';
import { Context } from '@0xcert/web3-context';
import { Protocol } from '@0xcert/web3-sandbox';
import { Folder } from '../../../core/folder';
import { FolderAbility } from '@0xcert/scaffold';

interface Data {
  coinbase: string;
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

spec.before(async (stage) => {
  const accounts = await stage.web3.eth.getAccounts();

  stage.set('coinbase', accounts[0]);
});

spec.test('returns account abilities', async (ctx) => {
  const coinbase = ctx.get('coinbase');
  const folder = ctx.get('folder');

  const abilities = await folder.getAbilities(coinbase).then((q) => q.result);

  ctx.deepEqual(abilities, [
    FolderAbility.MANAGE_ABILITIES,
    FolderAbility.MINT_ASSET,
    FolderAbility.REVOKE_ASSET,
    FolderAbility.PAUSE_TRANSFER,
    FolderAbility.UPDATE_PROOF,
    FolderAbility.SIGN_MINT_CLAIM,
  ]);
});

export default spec;
