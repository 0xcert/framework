import { Spec } from '@hayspec/spec';
import { Connector } from '@0xcert/web3-connector';
import { Sandbox } from '@0xcert/web3-sandbox';
import { Protocol } from '../../..';
import { QueryKind } from '@0xcert/connector';

interface Data {
  protocol: Protocol;
  sandbox: Sandbox;
}

const spec = new Spec<Data>();

spec.before(async (stage) => {
  const sandbox = new Sandbox();
  stage.set('sandbox', await sandbox.listen({ port: 8509 }));
});

spec.before(async (stage) => {
  const connector = new Connector({
    web3: stage.get('sandbox').web3,
  });
  stage.set('protocol', new Protocol({ connector }));
});

spec.after(async (stage) => {
  await stage.get('sandbox').close();
});

spec.test('reads folder metadata', async (ctx) => {
  const query = await ctx.get('protocol').createQuery({
    queryKind: QueryKind.FOLDER_READ_METADATA,
    folderId: ctx.get('sandbox').protocol.xcert.instance.options.address,
  });
  const result = await query.resolve();
  ctx.deepEqual(result.serialize(), {
    data: { name: 'Xcert', symbol: 'Xcert' },
  });
});

spec.test('reads folder total supply', async (ctx) => {
  const query = await ctx.get('protocol').createQuery({
    queryKind: QueryKind.FOLDER_READ_SUPPLY,
    folderId: ctx.get('sandbox').protocol.xcert.instance.options.address,
  });
  const result = await query.resolve();
  ctx.deepEqual(result.serialize(), {
    data: { totalCount: 0 },
  });
});

spec.test('reads folder capabilities', async (ctx) => {
  const queries = await Promise.all([
    ctx.get('protocol').createQuery({
      queryKind: QueryKind.FOLDER_READ_CAPABILITIES,
      folderId: ctx.get('sandbox').protocol.xcertBurnable.instance.options.address,
    }),
    ctx.get('protocol').createQuery({
      queryKind: QueryKind.FOLDER_READ_CAPABILITIES,
      folderId: ctx.get('sandbox').protocol.xcertMutable.instance.options.address,
    }),
    ctx.get('protocol').createQuery({
      queryKind: QueryKind.FOLDER_READ_CAPABILITIES,
      folderId: ctx.get('sandbox').protocol.xcertPausable.instance.options.address,
    }),
    ctx.get('protocol').createQuery({
      queryKind: QueryKind.FOLDER_READ_CAPABILITIES,
      folderId: ctx.get('sandbox').protocol.xcertRevokable.instance.options.address,
    })
  ]);
  await Promise.all(
    queries.map((q) => q.resolve())
  );
  const results = queries.map((q) => q.serialize());
  ctx.deepEqual(results, [
    { data: { isBurnable: true, isMutable: false, isPausable: false, isRevokable: false }},
    { data: { isBurnable: false, isMutable: true, isPausable: false, isRevokable: false }},
    { data: { isBurnable: false, isMutable: false, isPausable: true, isRevokable: false }},
    { data: { isBurnable: false, isMutable: false, isPausable: false, isRevokable: true }},
  ]);
});

spec.test('checks if folder transfers are enabled', async (ctx) => {
  const query = ctx.get('protocol').createQuery({
    queryKind: QueryKind.FOLDER_CHECK_TRANSFER_STATE,
    folderId: ctx.get('sandbox').protocol.xcertPausable.instance.options.address,
  })
  await query.resolve();
  const result = await query.resolve();
  ctx.deepEqual(result.serialize(), {
    data: { isEnabled: false },
  });
});

export default spec;
