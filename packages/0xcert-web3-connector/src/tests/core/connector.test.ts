import { Spec } from '@specron/spec';
import { Protocol } from '@0xcert/web3-sandbox';
import { Connector, ConnectorAction } from '../..';

interface Data {
  connector: Connector;
  protocol: Protocol;
}

const spec = new Spec<Data>();

spec.before(async (stage) => {
  const connector = new Connector(stage.web3);
  stage.set('connector', connector);
});

spec.before(async (stage) => {
  const protocol = new Protocol(stage.web3);
  stage.set('protocol', await protocol.deploy());
});

spec.test('reads folder metadata', async (ctx) => {
  const res = await ctx.get('connector').perform({
    action: ConnectorAction.FOLDER_READ_METADATA,
    folderId: ctx.get('protocol').xcert.instance.options.address,
  });
  ctx.deepEqual(res, {
    name: 'Xcert',
    symbol: 'Xcert',
  });
});

spec.test('reads folder total supply', async (ctx) => {
  const res = await ctx.get('connector').perform({
    action: ConnectorAction.FOLDER_READ_SUPPLY,
    folderId: ctx.get('protocol').xcert.instance.options.address,
  });
  ctx.deepEqual(res, {
    totalCount: 0,
  });
});

spec.test('reads folder capabilities', async (ctx) => {
  const res = await Promise.all([
    ctx.get('connector').perform({
      action: ConnectorAction.FOLDER_READ_CAPABILITIES,
      folderId: ctx.get('protocol').xcertBurnable.instance.options.address,
    }),
    ctx.get('connector').perform({
      action: ConnectorAction.FOLDER_READ_CAPABILITIES,
      folderId: ctx.get('protocol').xcertMutable.instance.options.address,
    }),
    ctx.get('connector').perform({
      action: ConnectorAction.FOLDER_READ_CAPABILITIES,
      folderId: ctx.get('protocol').xcertPausable.instance.options.address,
    }),
    ctx.get('connector').perform({
      action: ConnectorAction.FOLDER_READ_CAPABILITIES,
      folderId: ctx.get('protocol').xcertRevokable.instance.options.address,
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
  const res = await ctx.get('connector').perform({
    action: ConnectorAction.FOLDER_CHECK_IS_PAUSED,
    folderId: ctx.get('protocol').xcert.instance.options.address,
  });
  ctx.deepEqual(res, {
    isPaused: false,
  });
});

export default spec;
