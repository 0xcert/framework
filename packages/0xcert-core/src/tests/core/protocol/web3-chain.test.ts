import { Spec } from '@hayspec/spec';
import { Connector } from '@0xcert/web3-connector';
import { Sandbox } from '@0xcert/web3-sandbox';
import { Protocol, ConnectorAction } from '../../..';

interface Data {
  protocol: Protocol;
  sandbox: Sandbox;
}

const spec = new Spec<Data>();

spec.before(async (stage) => {
  const sandbox = new Sandbox();
  stage.set('sandbox', await sandbox.listen(8509));
});

spec.before(async (stage) => {
  stage.set('protocol', new Protocol({
    connector: new Connector(stage.get('sandbox').web3),
  }));
});

spec.after(async (stage) => {
  await stage.get('sandbox').close();
});

spec.test('reads folder metadata', async (ctx) => {
  const res = await ctx.get('protocol').perform({
    action: ConnectorAction.FOLDER_READ_METADATA,
    folderId: ctx.get('sandbox').protocol.xcert.instance.options.address,
  });
  ctx.deepEqual(res, {
    name: 'Xcert',
    symbol: 'Xcert',
  });
});

spec.test('reads folder total supply', async (ctx) => {
  const res = await ctx.get('protocol').perform({
    action: ConnectorAction.FOLDER_READ_SUPPLY,
    folderId: ctx.get('sandbox').protocol.xcert.instance.options.address,
  });
  ctx.deepEqual(res, {
    totalCount: 0,
  });
});

spec.test('reads folder capabilities', async (ctx) => {
  const res = await Promise.all([
    ctx.get('protocol').perform({
      action: ConnectorAction.FOLDER_READ_CAPABILITIES,
      folderId: ctx.get('sandbox').protocol.xcertBurnable.instance.options.address,
    }),
    ctx.get('protocol').perform({
      action: ConnectorAction.FOLDER_READ_CAPABILITIES,
      folderId: ctx.get('sandbox').protocol.xcertMutable.instance.options.address,
    }),
    ctx.get('protocol').perform({
      action: ConnectorAction.FOLDER_READ_CAPABILITIES,
      folderId: ctx.get('sandbox').protocol.xcertPausable.instance.options.address,
    }),
    ctx.get('protocol').perform({
      action: ConnectorAction.FOLDER_READ_CAPABILITIES,
      folderId: ctx.get('sandbox').protocol.xcertRevokable.instance.options.address,
    })
  ]);
  ctx.deepEqual(res, [
    { isBurnable: true, isMutable: false, isPausable: false, isRevokable: false },
    { isBurnable: false, isMutable: true, isPausable: false, isRevokable: false },
    { isBurnable: false, isMutable: false, isPausable: true, isRevokable: false },
    { isBurnable: false, isMutable: false, isPausable: false, isRevokable: true },
  ]);
});

spec.test('checks if folder transfers are paused', async (ctx) => {
  const res = await ctx.get('protocol').perform({
    action: ConnectorAction.FOLDER_CHECK_IS_PAUSED,
    folderId: ctx.get('sandbox').protocol.xcert.instance.options.address,
  });
  ctx.deepEqual(res, {
    isPaused: false,
  });
});

export default spec;
