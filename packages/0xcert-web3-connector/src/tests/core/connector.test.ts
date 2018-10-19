// import { Spec } from '@specron/spec';
// import { Protocol } from '@0xcert/web3-sandbox';
// import { Connector } from '../..';
// import { QueryKind, FolderAbilityKind, MutationKind } from '@0xcert/connector';

// interface Data {
//   connector: Connector;
//   protocol: Protocol;
//   owner: string;
// }

// const spec = new Spec<Data>();

// spec.before(async (stage) => {
//   const connector = new Connector({ web3: stage.web3 });
//   stage.set('connector', connector);
// });

// spec.before(async (stage) => {
//   const protocol = new Protocol(stage.web3);
//   stage.set('protocol', await protocol.deploy());
// });

// spec.before(async (stage) => {
//   const accounts = await stage.web3.eth.getAccounts();
//   stage.set('owner', accounts[0]);
// });

// spec.test('checks if account has ability on folder', async (ctx) => {
//   const query = ctx.get('connector').createQuery({
//     queryKind: QueryKind.FOLDER_CHECK_ABILITY,
//     folderId: ctx.get('protocol').xcert.instance.options.address,
//     abilityKind: FolderAbilityKind.MANAGE_ABILITIES,
//     accountId: ctx.get('owner'),
//   })
//   await query.resolve();
//   ctx.deepEqual(query.serialize(), {
//     isAble: true,
//   });
// });

// spec.test('checks if folder transfers are enabled', async (ctx) => {
//   const query = ctx.get('connector').createQuery({
//     queryKind: QueryKind.FOLDER_CHECK_TRANSFER_STATE,
//     folderId: ctx.get('protocol').xcertPausable.instance.options.address,
//   })
//   await query.resolve();
//   ctx.deepEqual(query.serialize(), {
//     isEnabled: false,
//   });
// });

// spec.test('reads folder capabilities', async (ctx) => {
//   const queries = [
//     ctx.get('connector').createQuery({
//       queryKind: QueryKind.FOLDER_READ_CAPABILITIES,
//       folderId: ctx.get('protocol').xcertBurnable.instance.options.address,
//     }),
//     ctx.get('connector').createQuery({
//       queryKind: QueryKind.FOLDER_READ_CAPABILITIES,
//       folderId: ctx.get('protocol').xcertMutable.instance.options.address,
//     }),
//     ctx.get('connector').createQuery({
//       queryKind: QueryKind.FOLDER_READ_CAPABILITIES,
//       folderId: ctx.get('protocol').xcertPausable.instance.options.address,
//     }),
//     ctx.get('connector').createQuery({
//       queryKind: QueryKind.FOLDER_READ_CAPABILITIES,
//       folderId: ctx.get('protocol').xcertRevokable.instance.options.address,
//     })
//   ];
//   await Promise.all(
//     queries.map((q) => q.resolve())
//   );
//   const results = queries.map((q) => q.serialize());
//   ctx.deepEqual(results, [
//     { isBurnable: true, isMutable: false, isPausable: false, isRevokable: false },
//     { isBurnable: false, isMutable: true, isPausable: false, isRevokable: false },
//     { isBurnable: false, isMutable: false, isPausable: true, isRevokable: false },
//     { isBurnable: false, isMutable: false, isPausable: false, isRevokable: true },
//   ]);
// });

// spec.test('reads folder metadata', async (ctx) => {
//   const query = ctx.get('connector').createQuery({
//     queryKind: QueryKind.FOLDER_READ_METADATA,
//     folderId: ctx.get('protocol').xcert.instance.options.address,
//   })
//   await query.resolve();
//   ctx.deepEqual(query.serialize(), {
//     name: 'Xcert',
//     symbol: 'Xcert',
//   });
// });

// spec.test('reads folder total supply', async (ctx) => {
//   const query = ctx.get('connector').createQuery({
//     queryKind: QueryKind.FOLDER_READ_SUPPLY,
//     folderId: ctx.get('protocol').xcert.instance.options.address,
//   })
//   await query.resolve();
//   ctx.deepEqual(query.serialize(), {
//     totalCount: 0,
//   });
//   });

// spec.test('sets folder transfer state', async (ctx) => {

//   await ctx.get('protocol').xcertPausable.instance.methods.assignAbilities(ctx.get('owner'), [3]).send({
//     form: ctx.get('owner'),
//   });

//   const mutation = await ctx.get('connector').createMutation({
//     mutationKind: MutationKind.FOLDER_SET_TRANSFER_STATE,
//     folderId: ctx.get('protocol').xcertPausable.instance.options.address,
//     isEnabled: true,
//     makerId: ctx.get('owner'),
//   });
//   mutation.resolve();
//   mutation.resolve();
//   mutation.resolve();
//   mutation.resolve();
//   mutation.resolve();
//   await mutation.resolve();
//   mutation.resolve();
//   ctx.pass();
// });

// export default spec;
