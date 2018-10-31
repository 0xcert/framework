import { Spec } from '@specron/spec';
import { Protocol } from '@0xcert/web3-sandbox';
import { Folder } from '../../core/folder';
import { FolderTransferState } from '@0xcert/folder';

interface Data {
  accounts: string[];
  protocol: Protocol;
}

const spec = new Spec<Data>();

spec.before(async (stage) => {
  const protocol = new Protocol(stage.web3);
  stage.set('protocol', await protocol.deploy());
});

spec.before(async (stage) => {
  stage.set('accounts', await stage.web3.eth.getAccounts());
});

spec.test('queries assets supply', async (ctx) => {
  const folder = new Folder({
    web3: ctx.web3,
    folderId: ctx.get('protocol').xcert.instance.options.address,
  });
  ctx.is(await folder.getSupply().then((q) => q.result.total), 0);
});

spec.test('queries folder transfer state', async (ctx) => {
  const folder = new Folder({
    web3: ctx.web3,
    folderId: ctx.get('protocol').xcertPausable.instance.options.address,
  });
  ctx.is(await folder.getTransferState().then((q) => q.result.state), FolderTransferState.ENABLED);
});

spec.test('mutates folder transfer state', async (ctx) => {
  const folder = new Folder({
    web3: ctx.web3,
    folderId: ctx.get('protocol').xcertPausable.instance.options.address,
  });
  ctx.is(await folder.getTransferState().then((q) => q.result.state), FolderTransferState.ENABLED);
  await folder.setTransferState(FolderTransferState.DISABLED).then(({ transaction }) => transaction.resolve());
  ctx.is(await folder.getTransferState().then((q) => q.result.state), FolderTransferState.DISABLED);
  await folder.setTransferState(FolderTransferState.ENABLED).then(({ transaction }) => transaction.resolve());
  ctx.is(await folder.getTransferState().then((q) => q.result.state), FolderTransferState.ENABLED);
});

export default spec;
