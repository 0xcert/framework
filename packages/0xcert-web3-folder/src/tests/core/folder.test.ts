import { FolderTransferState } from '@0xcert/connector';
import { Spec } from '@specron/spec';
import { Protocol } from '@0xcert/web3-sandbox';
import { Folder } from '../../core/folder';

interface Data {
  accounts: string[];
  protocol: Protocol;
  folder: (folderId) => Folder;
}

const spec = new Spec<Data>();

spec.before(async (stage) => {
  const protocol = new Protocol(stage.web3);
  stage.set('protocol', await protocol.deploy());
});

spec.before(async (stage) => {
  stage.set('accounts', await stage.web3.eth.getAccounts());
});

spec.before(async (stage) => {
  stage.set('folder', (folderId) => new Folder({
    web3: stage.web3,
    conventionId: 'foo',
    makerId: stage.get('accounts')[0],
    folderId,
  }));
});

spec.test('queries folder capabilities', async (ctx) => {
  const folders = [
    ctx.get('folder')(ctx.get('protocol').xcert.instance.options.address),
    ctx.get('folder')(ctx.get('protocol').xcertBurnable.instance.options.address),
    ctx.get('folder')(ctx.get('protocol').xcertMutable.instance.options.address),
    ctx.get('folder')(ctx.get('protocol').xcertPausable.instance.options.address),
    ctx.get('folder')(ctx.get('protocol').xcertRevokable.instance.options.address),
  ];
  ctx.deepEqual(
    await folders[0].getCapabilities().then((q) => q.result),
    { isBurnable: false, isMutable: false, isPausable: false, isRevokable: false }
  );
  ctx.deepEqual(
    await folders[1].getCapabilities().then((q) => q.result),
    { isBurnable: true, isMutable: false, isPausable: false, isRevokable: false }
  );
  ctx.deepEqual(
    await folders[2].getCapabilities().then((q) => q.result),
    { isBurnable: false, isMutable: true, isPausable: false, isRevokable: false }
  );
  ctx.deepEqual(
    await folders[3].getCapabilities().then((q) => q.result),
    { isBurnable: false, isMutable: false, isPausable: true, isRevokable: false }
  );
  ctx.deepEqual(
    await folders[4].getCapabilities().then((q) => q.result),
    { isBurnable: false, isMutable: false, isPausable: false, isRevokable: true }
  );
});

spec.test('queries folder info', async (ctx) => {
  const folder = ctx.get('folder')(ctx.get('protocol').xcert.instance.options.address);
  ctx.deepEqual(await folder.getInfo().then((q) => q.result), {
    name: 'Xcert',
    symbol: 'Xcert',
  });
});

spec.test('queries assets supply', async (ctx) => {
  const folder = ctx.get('folder')(ctx.get('protocol').xcert.instance.options.address);
  ctx.is(await folder.getSupply().then((q) => q.result.total), 0);
});

spec.test('queries folder transfer state', async (ctx) => {
  const folder = ctx.get('folder')(ctx.get('protocol').xcertPausable.instance.options.address);
  ctx.is(await folder.getTransferState().then((q) => q.result.state), FolderTransferState.ENABLED);
});

spec.test('mutates folder transfer state', async (ctx) => {
  const folder = ctx.get('folder')(ctx.get('protocol').xcertPausable.instance.options.address);
  ctx.is(await folder.getTransferState().then((q) => q.result.state), FolderTransferState.ENABLED);
  await folder.setTransferState(FolderTransferState.DISABLED).then(() => ctx.sleep(200));
  ctx.is(await folder.getTransferState().then((q) => q.result.state), FolderTransferState.DISABLED);
  await folder.setTransferState(FolderTransferState.ENABLED).then(() => ctx.sleep(200));
  ctx.is(await folder.getTransferState().then((q) => q.result.state), FolderTransferState.ENABLED);
});

export default spec;
