import { Spec } from '@specron/spec';
import { Protocol } from '@0xcert/web3-sandbox';
import { Connector } from '../..';
import { QueryKind, FolderAbilityKind, MutationKind, MutationEvent } from '@0xcert/connector';
import { S_IFSOCK } from 'constants';

interface Data {
  connector: Connector;
  protocol: Protocol;
  owner: string;
  bob: string;
  jane: string;
}

const spec = new Spec<Data>();

spec.before(async (stage) => {
  const connector = new Connector({ web3: stage.web3 });
  stage.set('connector', connector);
});

spec.before(async (stage) => {
  const protocol = new Protocol(stage.web3);
  stage.set('protocol', await protocol.deploy());
});

spec.before(async (stage) => {
  const accounts = await stage.web3.eth.getAccounts();
  stage.set('owner', accounts[0]);
  stage.set('bob', accounts[1]);
  stage.set('jane', accounts[2]);
});

spec.test('checks if account has ability on folder', async (ctx) => {
  const query = ctx.get('connector').createQuery({
    queryKind: QueryKind.FOLDER_CHECK_ABILITY,
    folderId: ctx.get('protocol').xcert.instance.options.address,
    abilityKind: FolderAbilityKind.MANAGE_ABILITIES,
    accountId: ctx.get('owner'),
  })
  await query.resolve();
  ctx.deepEqual(query.serialize(), {
    data: { isAble: true },
  });
});

spec.test('checks if folder transfers are enabled', async (ctx) => {
  const query = ctx.get('connector').createQuery({
    queryKind: QueryKind.FOLDER_CHECK_TRANSFER_STATE,
    folderId: ctx.get('protocol').xcertPausable.instance.options.address,
  })
  await query.resolve();
  ctx.deepEqual(query.serialize(), {
    data: { isEnabled: false },
  });
});

spec.test('reads folder capabilities', async (ctx) => {
  const queries = [
    ctx.get('connector').createQuery({
      queryKind: QueryKind.FOLDER_READ_CAPABILITIES,
      folderId: ctx.get('protocol').xcertBurnable.instance.options.address,
    }),
    ctx.get('connector').createQuery({
      queryKind: QueryKind.FOLDER_READ_CAPABILITIES,
      folderId: ctx.get('protocol').xcertMutable.instance.options.address,
    }),
    ctx.get('connector').createQuery({
      queryKind: QueryKind.FOLDER_READ_CAPABILITIES,
      folderId: ctx.get('protocol').xcertPausable.instance.options.address,
    }),
    ctx.get('connector').createQuery({
      queryKind: QueryKind.FOLDER_READ_CAPABILITIES,
      folderId: ctx.get('protocol').xcertRevokable.instance.options.address,
    }),
  ];
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

spec.test('reads folder metadata', async (ctx) => {
  const query = ctx.get('connector').createQuery({
    queryKind: QueryKind.FOLDER_READ_METADATA,
    folderId: ctx.get('protocol').xcert.instance.options.address,
  })
  await query.resolve();
  ctx.deepEqual(query.serialize(), {
    data: { name: 'Xcert', symbol: 'Xcert' },
  });
});

spec.test('reads folder total supply', async (ctx) => {
  const query = ctx.get('connector').createQuery({
    queryKind: QueryKind.FOLDER_READ_SUPPLY,
    folderId: ctx.get('protocol').xcert.instance.options.address,
  })
  await query.resolve();
  ctx.deepEqual(query.serialize(), {
    data: { totalCount: 0 },
  });
});

spec.test('sets folder transfer state', async (ctx) => {
  const mutation = await ctx.get('connector').createMutation({
    mutationKind: MutationKind.FOLDER_SET_TRANSFER_STATE,
    folderId: ctx.get('protocol').xcertPausable.instance.options.address,
    makerId: ctx.get('owner'),
    data: { isEnabled: true },
  });
  mutation.resolve();
  mutation.resolve();
  mutation.resolve();
  mutation.resolve();
  mutation.resolve();
  await mutation.resolve();
  mutation.resolve();
  ctx.pass();
});

spec.test('sets folder uri base', async (ctx) => {
  const uriBase = 'http://newLink.org/';
  const mutation = await ctx.get('connector').createMutation({
    mutationKind: MutationKind.FOLDER_SET_URI_BASE,
    folderId: ctx.get('protocol').xcert.instance.options.address,
    makerId: ctx.get('owner'),
    data: { uriBase },
  });
  await ctx.notThrows(() => mutation.resolve());
});

spec.test('assign folder abilities', async (ctx) => {
  const owner = ctx.get('owner');
  const bob = ctx.get('bob')

  let query = await ctx.get('connector').createQuery({
    queryKind: QueryKind.FOLDER_CHECK_ABILITY,
    folderId: ctx.get('protocol').xcert.instance.options.address,
    abilityKind: FolderAbilityKind.MINT_ASSET,
    accountId: bob,
  }).resolve();
  let result = query.serialize();

  ctx.is(result.data.isAble, false);

  const mutation = await ctx.get('connector').createMutation({
    mutationKind: MutationKind.FOLDER_ASSIGN_ABILITIES,
    folderId: ctx.get('protocol').xcert.instance.options.address,
    makerId: owner,
    data: { 
      target: bob,
      abilities: [FolderAbilityKind.MINT_ASSET]
    },
  });

  await ctx.notThrows(() => mutation.resolve());

  query = await ctx.get('connector').createQuery({
    queryKind: QueryKind.FOLDER_CHECK_ABILITY,
    folderId: ctx.get('protocol').xcert.instance.options.address,
    abilityKind: FolderAbilityKind.MINT_ASSET,
    accountId: bob,
  }).resolve();
  result = query.serialize();

  ctx.is(result.data.isAble, true);
});

spec.test('revoke folder abilities', async (ctx) => {
  const owner = ctx.get('owner');
  const bob = ctx.get('bob')

  const assign = ctx.get('connector').createMutation({
    mutationKind: MutationKind.FOLDER_ASSIGN_ABILITIES,
    folderId: ctx.get('protocol').xcert.instance.options.address,
    makerId: owner,
    data: { 
      target: bob,
      abilities: [FolderAbilityKind.MINT_ASSET]
    },
  });
  await assign.resolve();

  let query = await ctx.get('connector').createQuery({
    queryKind: QueryKind.FOLDER_CHECK_ABILITY,
    folderId: ctx.get('protocol').xcert.instance.options.address,
    abilityKind: FolderAbilityKind.MINT_ASSET,
    accountId: bob,
  }).resolve();
  let result = query.serialize();
  ctx.is(result.data.isAble, true);

  const revoke = ctx.get('connector').createMutation({
    mutationKind: MutationKind.FOLDER_REVOKE_ABILITIES,
    folderId: ctx.get('protocol').xcert.instance.options.address,
    makerId: owner,
    data: { 
      target: bob,
      abilities: [FolderAbilityKind.MINT_ASSET]
    },
  });

  await ctx.notThrows(() => revoke.resolve());

  query = await ctx.get('connector').createQuery({
    queryKind: QueryKind.FOLDER_CHECK_ABILITY,
    folderId: ctx.get('protocol').xcert.instance.options.address,
    abilityKind: FolderAbilityKind.MINT_ASSET,
    accountId: bob,
  }).resolve();
  result = query.serialize();
  ctx.is(result.data.isAble, false);
});

export default spec;
