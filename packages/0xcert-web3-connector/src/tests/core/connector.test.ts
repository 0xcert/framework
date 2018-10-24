import { Spec } from '@specron/spec';
import { Protocol } from '@0xcert/web3-sandbox';
import { Connector } from '../..';
import { QueryKind, FolderAbilityKind, MutationKind, MutationEvent, ClaimKind } from '@0xcert/connector';
import { S_IFSOCK } from 'constants';
import { ProxyKind } from '../../core/connector';

interface Data {
  connector: Connector;
  protocol: Protocol;
  owner: string;
  bob: string;
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
});

spec.before(async (stage) => {
  await stage.get('protocol').xcert.instance.methods
    .mint(stage.get('bob'), '100', 'foo')
    .send({ form: stage.get('owner') });
});

spec.test('checks if account has ability on folder', async (ctx) => {
  const query = ctx.get('connector').createQuery({
    queryKind: QueryKind.FOLDER_CHECK_ABILITY,
    folderId: ctx.get('protocol').xcert.instance.options.address,
    abilityKind: FolderAbilityKind.MANAGE_ABILITIES,
    accountId: ctx.get('owner'),
  });
  await query.resolve();
  ctx.deepEqual(query.serialize(), {
    data: { isAble: true },
  });
});

spec.test('checks if account has approval on token', async (ctx) => {
  const query = ctx.get('connector').createQuery({
    queryKind: QueryKind.FOLDER_CHECK_APPROVAL,
    folderId: ctx.get('protocol').xcert.instance.options.address,
    accountId: ctx.get('owner'),
    assetId: '100',
  });
  await query.resolve();
  ctx.deepEqual(query.serialize(), {
    data: { isApproved: false },
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
    data: { totalCount: 1 },
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

spec.test('generates claim for minting an asset', async (ctx) => {

  const connector = new Connector({ 
    web3: ctx.web3, 
    minterAddress: '0x825C96c2c73f9eC9C983BAAa3f5EbBc77aC2e981' 
  });
  
  const claim = await connector.createClaim({
    claimKind: ClaimKind.MINTER_CREATE_ASSET,
    makerId: '0x342da4DaE236037E9586499DA06494DDE2a0b52b',
    takerId: '0x1231858C3aeFe5B5E8A5C81d2b5341fbc41E2B13',
    asset: {
      folderId: '0x146E35b007B76A4455890cF6d1b82F6A8ef12e0E',
      assetId: '1',
      publicProof: '1e205550c271490347e5e2393a02e94d284bbe9903f023ba098355b8d75974c8',
    },
    transfers: [
      {
        vaultId: '0x2bD270a0F3232E9f11dd439D8E5e74694e46dC53',
        senderId: '0x342da4DaE236037E9586499DA06494DDE2a0b52b',
        receiverId: '0x287206D90777dcB5fb96070D0DDF06737FCE3d1E',
        amount: 5000,
      },
      {
        vaultId: '0x2bD270a0F3232E9f11dd439D8E5e74694e46dC53',
        senderId: '0x342da4DaE236037E9586499DA06494DDE2a0b52b',
        receiverId: '0x28bC05dd0Eb0A3912AB7ea9d9C0A0502AE0773C7',
        amount: 300,
      },
    ],
    seed: 1535113220,
    expiration: 1535113820,
  });
  claim.generate();
  const data = claim.serialize().data;

  await ctx.is(data, '0x43695986f951d66d34a52513e4992b1f410371d724ee31c6629eac756fc29993');  
});

spec.test('generates claim for swaping stuff', async (ctx) => {

  const connector = new Connector({ 
    web3: ctx.web3,
    exchangeAddress: '0x45fC42D5b864373A4DC3cF73CBdA529247c37e6F'
  });
   
  const claim = await connector.createClaim({
    claimKind: ClaimKind.EXCHANGE_SWAP, // EXCHANGE_SWAP_STUFF
    makerId: '0x28bC05dd0Eb0A3912AB7ea9d9C0A0502AE0773C7',
    takerId: '0x287206D90777dcB5fb96070D0DDF06737FCE3d1E',
    transfers: [
      {
        folderId: '0x2bD270a0F3232E9f11dd439D8E5e74694e46dC53',
        senderId: '0x28bC05dd0Eb0A3912AB7ea9d9C0A0502AE0773C7',
        receiverId: '0x287206D90777dcB5fb96070D0DDF06737FCE3d1E',
        assetId: '1',
      },
      {
        folderId: '0x2bD270a0F3232E9f11dd439D8E5e74694e46dC53',
        senderId: '0x287206D90777dcB5fb96070D0DDF06737FCE3d1E',
        receiverId: '0x28bC05dd0Eb0A3912AB7ea9d9C0A0502AE0773C7',
        assetId: '2',
      }
    ],
    seed: 1535113220,
    expiration: 1535113820,
  });

  claim.generate();
  const data = claim.serialize().data;

  await ctx.is(data, '0xa3e4b672ab50ad0573dd51f179bae90c877e674424ae143ef6d6e3a849b2800b');  
});

export default spec;
