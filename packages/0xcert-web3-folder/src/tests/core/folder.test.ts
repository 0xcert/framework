import { FolderTransferState, FolderAbility } from '@0xcert/connector';
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

spec.test('method `getAbilities` returns account abilities', async (ctx) => {
  const folder = ctx.get('folder')(ctx.get('protocol').xcert.instance.options.address);
  const abilities = await folder.getAbilities(ctx.get('accounts')[0]).then((q) => q.result);
  ctx.not(abilities.indexOf(FolderAbility.MANAGE_ABILITIES), -1);
  ctx.not(abilities.indexOf(FolderAbility.MINT_ASSET), -1);
  ctx.not(abilities.indexOf(FolderAbility.PAUSE_TRANSFER), -1);
  ctx.not(abilities.indexOf(FolderAbility.REVOKE_ASSET), -1);
  ctx.not(abilities.indexOf(FolderAbility.SIGN_MINT_CLAIM), -1);
  ctx.not(abilities.indexOf(FolderAbility.UPDATE_PROOF), -1);
});

spec.test('method `getCapabilities` returns folder capabilities', async (ctx) => {
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

spec.test('method `getInfo` returns folder info', async (ctx) => {
  const folder = ctx.get('folder')(ctx.get('protocol').xcert.instance.options.address);
  ctx.deepEqual(await folder.getInfo().then((q) => q.result), {
    name: 'Xcert',
    symbol: 'Xcert',
  });
});

spec.test('method `getSupply` returns folder assets supply', async (ctx) => {
  const folder = ctx.get('folder')(ctx.get('protocol').xcert.instance.options.address);
  ctx.is(await folder.getSupply().then((q) => q.result), 0);
});

spec.test('method `getTransferState` returns folder state', async (ctx) => {
  const folder = ctx.get('folder')(ctx.get('protocol').xcertPausable.instance.options.address);
  ctx.is(await folder.getTransferState().then((q) => q.result), FolderTransferState.ENABLED);
});

spec.test('method `assignAbilities` adds folder abilities for account', async (ctx) => {
  const folder = ctx.get('folder')(ctx.get('protocol').xcert.instance.options.address);
  ctx.deepEqual(await folder.getAbilities(ctx.get('accounts')[1]).then((q) => q.result), []);
  await folder.assignAbilities(ctx.get('accounts')[1], [2, 3]).then(() => ctx.sleep(200));
  ctx.deepEqual(await folder.getAbilities(ctx.get('accounts')[1]).then((q) => q.result), [2, 3]);
});

spec.test('method `revokeAbilities` removes folder abilities for account', async (ctx) => {
  const folder = ctx.get('folder')(ctx.get('protocol').xcert.instance.options.address);
  await folder.assignAbilities(ctx.get('accounts')[2], [0, 1]).then(() => ctx.sleep(200));
  await folder.revokeAbilities(ctx.get('accounts')[2], [0]).then(() => ctx.sleep(200));
  ctx.deepEqual(await folder.getAbilities(ctx.get('accounts')[2]).then((q) => q.result), [1]);
});

spec.test('method `setTransferState` sets folder transfer state', async (ctx) => {
  const folder = ctx.get('folder')(ctx.get('protocol').xcertPausable.instance.options.address);
  ctx.is(await folder.getTransferState().then((q) => q.result), FolderTransferState.ENABLED);
  await folder.setTransferState(FolderTransferState.DISABLED).then(() => ctx.sleep(200));
  ctx.is(await folder.getTransferState().then((q) => q.result), FolderTransferState.DISABLED);
  await folder.setTransferState(FolderTransferState.ENABLED).then(() => ctx.sleep(200));
  ctx.is(await folder.getTransferState().then((q) => q.result), FolderTransferState.ENABLED);
});

export default spec;
