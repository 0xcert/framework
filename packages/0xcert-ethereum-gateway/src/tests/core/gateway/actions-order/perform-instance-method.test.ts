import { GenericProvider } from '@0xcert/ethereum-generic-provider';
import { Protocol } from '@0xcert/ethereum-sandbox';
import { ActionsOrderActionKind, DynamicActionsOrder, FixedActionsOrder, GeneralAssetLedgerAbility,
  OrderKind, ProviderIssue, SignedDynamicActionsOrder, SignedFixedActionsOrder, SuperAssetLedgerAbility } from '@0xcert/scaffold';
import { Spec } from '@specron/spec';
import { Gateway } from '../../../..';

interface Data {
  protocol: Protocol;
  coinbaseGenericProvider: GenericProvider;
  bobGenericProvider: GenericProvider;
  saraGenericProvider: GenericProvider;
  coinbase: string;
  bob: string;
  sara: string;
  jane: string;
}

const spec = new Spec<Data>();

spec.before(async (stage) => {
  const protocol = new Protocol(stage.web3);
  stage.set('protocol', await protocol.deploy());
});

spec.before(async (stage) => {
  const accounts = await stage.web3.eth.getAccounts();

  stage.set('coinbase', accounts[0]);
  stage.set('bob', accounts[1]);
  stage.set('sara', accounts[2]);
  stage.set('jane', accounts[3]);
});

spec.before(async (stage) => {
  const coinbase = stage.get('coinbase');
  const bob = stage.get('bob');
  const sara = stage.get('sara');
  const actionsGatewayId = stage.get('protocol').actionsGateway.instance.options.address;

  const coinbaseGenericProvider = new GenericProvider({
    client: stage.web3,
    accountId: coinbase,
    requiredConfirmations: 0,
    gatewayConfig: { actionsOrderId: actionsGatewayId, assetLedgerDeployOrderId: '', valueLedgerDeployOrderId: '' },
  });
  const bobGenericProvider = new GenericProvider({
    client: stage.web3,
    accountId: bob,
    requiredConfirmations: 0,
    gatewayConfig: { actionsOrderId: actionsGatewayId, assetLedgerDeployOrderId: '', valueLedgerDeployOrderId: '' },
  });

  const saraGenericProvider = new GenericProvider({
    client: stage.web3,
    accountId: sara,
    requiredConfirmations: 0,
    gatewayConfig: { actionsOrderId: actionsGatewayId, assetLedgerDeployOrderId: '', valueLedgerDeployOrderId: '' },
  });

  stage.set('coinbaseGenericProvider', coinbaseGenericProvider);
  stage.set('bobGenericProvider', bobGenericProvider);
  stage.set('saraGenericProvider', saraGenericProvider);
});

spec.before(async (stage) => {
  const coinbase = stage.get('coinbase');
  const bob = stage.get('bob');
  const sara = stage.get('sara');

  const xcert = stage.get('protocol').xcertMutable;
  const xcertDestroyable = stage.get('protocol').xcertDestroyable;
  const erc20 = stage.get('protocol').erc20;
  const nftokenSafeTransferProxy = stage.get('protocol').nftokenSafeTransferProxy.instance.options.address;
  const tokenTransferProxy = stage.get('protocol').tokenTransferProxy.instance.options.address;
  const xcertCreateProxy = stage.get('protocol').xcertCreateProxy.instance.options.address;
  const xcertUpdateProxy = stage.get('protocol').xcertUpdateProxy.instance.options.address;
  const xcertBurnProxy = stage.get('protocol').xcertBurnProxy.instance.options.address;
  const abilitableManageProxy = stage.get('protocol').abilitableManageProxy.instance.options.address;

  await erc20.instance.methods.transfer(sara, 100000).send({ from: coinbase });
  await xcert.instance.methods.create(coinbase, '100', '0x0').send({ from: coinbase });
  await xcert.instance.methods.create(bob, '101', '0x0').send({ form: coinbase });
  await xcertDestroyable.instance.methods.create(coinbase, '200', '0x0').send({ from: coinbase });
  await xcertDestroyable.instance.methods.create(coinbase, '201', '0x0').send({ from: coinbase });
  await xcertDestroyable.instance.methods.create(bob, '202', '0x0').send({ from: coinbase });
  await xcertDestroyable.instance.methods.create(bob, '203', '0x0').send({ from: coinbase });
  await xcertDestroyable.instance.methods.create(coinbase, '204', '0x0').send({ from: coinbase });
  await xcert.instance.methods.create(sara, '1000', '0x0').send({ from: coinbase });
  await xcert.instance.methods.setApprovalForAll(nftokenSafeTransferProxy, true).send({ from: coinbase });
  await xcertDestroyable.instance.methods.setApprovalForAll(xcertBurnProxy, true).send({ from: coinbase });
  await xcertDestroyable.instance.methods.setApprovalForAll(xcertBurnProxy, true).send({ from: bob });
  await xcert.instance.methods.grantAbilities(xcertCreateProxy, GeneralAssetLedgerAbility.CREATE_ASSET).send({ from: coinbase });
  await xcert.instance.methods.grantAbilities(xcertUpdateProxy, GeneralAssetLedgerAbility.UPDATE_ASSET).send({ from: coinbase });
  await xcert.instance.methods.grantAbilities(abilitableManageProxy, SuperAssetLedgerAbility.MANAGE_ABILITIES).send({ from: coinbase });
  await xcert.instance.methods.setApprovalForAll(nftokenSafeTransferProxy, true).send({ from: bob });
  await xcert.instance.methods.setApprovalForAll(nftokenSafeTransferProxy, true).send({ from: sara });
  await erc20.instance.methods.approve(tokenTransferProxy, 100000).send({ from: sara });
});

spec.test('submits gateway fixed actions order to the network which executes transfers', async (ctx) => {
  const bobGenericProvider = ctx.get('bobGenericProvider');
  const bob = ctx.get('bob');
  const coinbase = ctx.get('coinbase');
  const xcert = ctx.get('protocol').xcertMutable;
  const xcertId = ctx.get('protocol').xcertMutable.instance.options.address;
  const xcertDestoryableId = ctx.get('protocol').xcertDestroyable.instance.options.address;
  const xcertDestoryable = ctx.get('protocol').xcertDestroyable;

  const order: FixedActionsOrder = {
    kind: OrderKind.FIXED_ACTIONS_ORDER,
    signers: [coinbase, bob],
    seed: 1535113220.12345, // should handle floats
    expiration: Date.now() * 60.1234, // should handle floats
    actions: [
      {
        kind: ActionsOrderActionKind.CREATE_ASSET,
        senderId: coinbase,
        ledgerId: xcertId,
        receiverId: bob,
        assetId: '102',
        assetImprint: '0',
      },
      {
        kind: ActionsOrderActionKind.UPDATE_ASSET_IMPRINT,
        senderId: coinbase,
        ledgerId: xcertId,
        assetImprint: '2',
        assetId: '100',
      },
      {
        kind: ActionsOrderActionKind.TRANSFER_ASSET,
        ledgerId: xcertId,
        senderId: coinbase,
        receiverId: bob,
        assetId: '100',
      },
      {
        kind: ActionsOrderActionKind.TRANSFER_ASSET,
        ledgerId: xcertId,
        senderId: bob,
        receiverId: coinbase,
        assetId: '101',
      },
      {
        kind: ActionsOrderActionKind.SET_ABILITIES,
        senderId: coinbase,
        ledgerId: xcertId,
        receiverId: bob,
        abilities: [GeneralAssetLedgerAbility.CREATE_ASSET],
      },
      {
        kind: ActionsOrderActionKind.DESTROY_ASSET,
        senderId: coinbase,
        ledgerId: xcertDestoryableId,
        assetId: '200',
      },
    ],
  };

  const coinbaseGenericProvider = ctx.get('coinbaseGenericProvider');
  const coinbaseGateway = new Gateway(coinbaseGenericProvider);
  const sign = await coinbaseGateway.sign(order);

  const gateway = new Gateway(bobGenericProvider);
  const mutation = await gateway.perform(order, [sign]);
  await mutation.complete();
  ctx.is((mutation.logs[0]).event, 'Perform');

  ctx.is(await xcert.instance.methods.ownerOf('100').call(), bob);
  ctx.is(await xcert.instance.methods.ownerOf('101').call(), coinbase);
  ctx.is(await xcert.instance.methods.ownerOf('102').call(), bob);
  ctx.is((await xcert.instance.methods.tokenURIIntegrity('100').call()).digest, '0x2000000000000000000000000000000000000000000000000000000000000000');
  ctx.true(await xcert.instance.methods.isAble(bob, GeneralAssetLedgerAbility.CREATE_ASSET).call());
  await ctx.reverts(() => xcertDestoryable.instance.methods.ownerOf('200').call(), '006002');
});

spec.test('submits gateway fixed signed actions order to the network which executes transfers', async (ctx) => {
  const bobGenericProvider = ctx.get('bobGenericProvider');
  const saraGenericProvider = ctx.get('saraGenericProvider');
  const coinbaseGenericProvider = ctx.get('coinbaseGenericProvider');
  const bob = ctx.get('bob');
  const coinbase = ctx.get('coinbase');
  const xcert = ctx.get('protocol').xcertMutable;
  const xcertId = ctx.get('protocol').xcertMutable.instance.options.address;
  const xcertDestoryableId = ctx.get('protocol').xcertDestroyable.instance.options.address;
  const xcertDestoryable = ctx.get('protocol').xcertDestroyable;

  const order: SignedFixedActionsOrder = {
    kind: OrderKind.SIGNED_FIXED_ACTIONS_ORDER,
    signers: [coinbase, bob],
    seed: 1535113220.12345, // should handle floats
    expiration: Date.now() * 60.1234, // should handle floats
    actions: [
      {
        kind: ActionsOrderActionKind.CREATE_ASSET,
        senderId: coinbase,
        ledgerId: xcertId,
        receiverId: bob,
        assetId: '103',
        assetImprint: '0',
      },
      {
        kind: ActionsOrderActionKind.UPDATE_ASSET_IMPRINT,
        senderId: coinbase,
        ledgerId: xcertId,
        assetImprint: '2',
        assetId: '100',
      },
      {
        kind: ActionsOrderActionKind.TRANSFER_ASSET,
        ledgerId: xcertId,
        senderId: coinbase,
        receiverId: bob,
        assetId: '101',
      },
      {
        kind: ActionsOrderActionKind.TRANSFER_ASSET,
        ledgerId: xcertId,
        senderId: bob,
        receiverId: coinbase,
        assetId: '100',
      },
      {
        kind: ActionsOrderActionKind.SET_ABILITIES,
        senderId: coinbase,
        ledgerId: xcertId,
        receiverId: bob,
        abilities: [GeneralAssetLedgerAbility.CREATE_ASSET],
      },
      {
        kind: ActionsOrderActionKind.DESTROY_ASSET,
        senderId: coinbase,
        ledgerId: xcertDestoryableId,
        assetId: '201',
      },
    ],
  };

  const coinbaseGateway = new Gateway(coinbaseGenericProvider);
  const coinbaseSign = await coinbaseGateway.sign(order);

  const bobGateway = new Gateway(bobGenericProvider);
  const bobSign = await bobGateway.sign(order);

  const saraGateway = new Gateway(saraGenericProvider);
  const mutation = await saraGateway.perform(order, [coinbaseSign, bobSign]);
  await mutation.complete();
  ctx.is((mutation.logs[0]).event, 'Perform');

  ctx.is(await xcert.instance.methods.ownerOf('100').call(), coinbase);
  ctx.is(await xcert.instance.methods.ownerOf('101').call(), bob);
  ctx.is(await xcert.instance.methods.ownerOf('103').call(), bob);
  ctx.is((await xcert.instance.methods.tokenURIIntegrity('100').call()).digest, '0x2000000000000000000000000000000000000000000000000000000000000000');
  ctx.true(await xcert.instance.methods.isAble(bob, GeneralAssetLedgerAbility.CREATE_ASSET).call());
  await ctx.reverts(() => xcertDestoryable.instance.methods.ownerOf('201').call(), '006002');
});

spec.test('submits gateway dynamic actions order to the network which executes transfers', async (ctx) => {
  const bobGenericProvider = ctx.get('bobGenericProvider');
  const coinbaseGenericProvider = ctx.get('coinbaseGenericProvider');
  const bob = ctx.get('bob');
  const coinbase = ctx.get('coinbase');
  const xcert = ctx.get('protocol').xcertMutable;
  const xcertId = ctx.get('protocol').xcertMutable.instance.options.address;
  const xcertDestoryableId = ctx.get('protocol').xcertDestroyable.instance.options.address;
  const xcertDestoryable = ctx.get('protocol').xcertDestroyable;

  const order: DynamicActionsOrder = {
    kind: OrderKind.DYNAMIC_ACTIONS_ORDER,
    signers: [coinbase],
    seed: 1535113220.12345, // should handle floats
    expiration: Date.now() * 60.1234, // should handle floats
    actions: [
      {
        kind: ActionsOrderActionKind.CREATE_ASSET,
        senderId: coinbase,
        ledgerId: xcertId,
        assetId: '104',
        assetImprint: '0',
      },
      {
        kind: ActionsOrderActionKind.UPDATE_ASSET_IMPRINT,
        senderId: coinbase,
        ledgerId: xcertId,
        assetImprint: '2',
        assetId: '100',
      },
      {
        kind: ActionsOrderActionKind.TRANSFER_ASSET,
        ledgerId: xcertId,
        senderId: coinbase,
        assetId: '100',
      },
      {
        kind: ActionsOrderActionKind.TRANSFER_ASSET,
        ledgerId: xcertId,
        receiverId: coinbase,
        assetId: '101',
      },
      {
        kind: ActionsOrderActionKind.SET_ABILITIES,
        senderId: coinbase,
        ledgerId: xcertId,
        abilities: [GeneralAssetLedgerAbility.UPDATE_ASSET],
      },
      {
        kind: ActionsOrderActionKind.DESTROY_ASSET,
        ledgerId: xcertDestoryableId,
        assetId: '202',
      },
    ],
  };

  const coinbaseGateway = new Gateway(coinbaseGenericProvider);
  const coinbaseSign = await coinbaseGateway.sign(order);

  const bobGateway = new Gateway(bobGenericProvider);
  const mutation = await bobGateway.perform(order, [coinbaseSign]);
  await mutation.complete();
  ctx.is((mutation.logs[0]).event, 'Perform');

  ctx.is(await xcert.instance.methods.ownerOf('101').call(), coinbase);
  ctx.is(await xcert.instance.methods.ownerOf('100').call(), bob);
  ctx.is(await xcert.instance.methods.ownerOf('104').call(), bob);
  ctx.is((await xcert.instance.methods.tokenURIIntegrity('100').call()).digest, '0x2000000000000000000000000000000000000000000000000000000000000000');
  ctx.true(await xcert.instance.methods.isAble(bob, GeneralAssetLedgerAbility.UPDATE_ASSET).call());
  await ctx.reverts(() => xcertDestoryable.instance.methods.ownerOf('202').call(), '006002');
});

spec.test('submits gateway signed dynamic actions order to the network which executes transfers', async (ctx) => {
  const bobGenericProvider = ctx.get('bobGenericProvider');
  const coinbaseGenericProvider = ctx.get('coinbaseGenericProvider');
  const saraGenericProvider = ctx.get('saraGenericProvider');
  const bob = ctx.get('bob');
  const coinbase = ctx.get('coinbase');
  const xcert = ctx.get('protocol').xcertMutable;
  const xcertId = ctx.get('protocol').xcertMutable.instance.options.address;
  const xcertDestoryableId = ctx.get('protocol').xcertDestroyable.instance.options.address;
  const xcertDestoryable = ctx.get('protocol').xcertDestroyable;

  const order: SignedDynamicActionsOrder = {
    kind: OrderKind.SIGNED_DYNAMIC_ACTIONS_ORDER,
    signers: [coinbase],
    seed: 1535113220.12345, // should handle floats
    expiration: Date.now() * 60.1234, // should handle floats
    actions: [
      {
        kind: ActionsOrderActionKind.CREATE_ASSET,
        senderId: coinbase,
        ledgerId: xcertId,
        assetId: '105',
        assetImprint: '0',
      },
      {
        kind: ActionsOrderActionKind.UPDATE_ASSET_IMPRINT,
        senderId: coinbase,
        ledgerId: xcertId,
        assetImprint: '3',
        assetId: '100',
      },
      {
        kind: ActionsOrderActionKind.TRANSFER_ASSET,
        ledgerId: xcertId,
        senderId: coinbase,
        assetId: '101',
      },
      {
        kind: ActionsOrderActionKind.TRANSFER_ASSET,
        ledgerId: xcertId,
        senderId: null,
        receiverId: coinbase,
        assetId: '100',
      },
      {
        kind: ActionsOrderActionKind.SET_ABILITIES,
        senderId: coinbase,
        ledgerId: xcertId,
        abilities: [GeneralAssetLedgerAbility.REVOKE_ASSET],
      },
      {
        kind: ActionsOrderActionKind.DESTROY_ASSET,
        ledgerId: xcertDestoryableId,
        assetId: '203',
      },
    ],
  };

  const coinbaseGateway = new Gateway(coinbaseGenericProvider);
  const coinbaseSign = await coinbaseGateway.sign(order);

  const bobGateway = new Gateway(bobGenericProvider);
  const bobSign = await bobGateway.sign(order);

  const saraGateway = new Gateway(saraGenericProvider);
  const mutation = await saraGateway.perform(order, [coinbaseSign, bobSign]);
  await mutation.complete();
  ctx.is((mutation.logs[0]).event, 'Perform');

  ctx.is(await xcert.instance.methods.ownerOf('100').call(), coinbase);
  ctx.is(await xcert.instance.methods.ownerOf('101').call(), bob);
  ctx.is(await xcert.instance.methods.ownerOf('105').call(), bob);
  ctx.is((await xcert.instance.methods.tokenURIIntegrity('100').call()).digest, '0x3000000000000000000000000000000000000000000000000000000000000000');
  ctx.true(await xcert.instance.methods.isAble(bob, GeneralAssetLedgerAbility.REVOKE_ASSET).call());
  await ctx.reverts(() => xcertDestoryable.instance.methods.ownerOf('203').call(), '006002');
});

spec.test('handles incorrect dynamic actions order', async (ctx) => {
  const coinbaseGenericProvider = ctx.get('coinbaseGenericProvider');
  const coinbase = ctx.get('coinbase');
  const xcertId = ctx.get('protocol').xcertMutable.instance.options.address;

  const order: DynamicActionsOrder = {
    kind: OrderKind.DYNAMIC_ACTIONS_ORDER,
    signers: [coinbase],
    seed: 1535113220.12345, // should handle floats
    expiration: Date.now() * 60.1234, // should handle floats
    actions: [
      {
        kind: ActionsOrderActionKind.TRANSFER_ASSET,
        ledgerId: xcertId,
        assetId: '100',
      },
    ],
  };

  const coinbaseGateway = new Gateway(coinbaseGenericProvider);
  let error = null;
  await coinbaseGateway.sign(order).catch((e) => {
    error = e;
  });
  ctx.is(error.issue, ProviderIssue.SENDER_ID_AND_RECEIVER_ID_MISSING);
});

spec.test('handles incorrect amount of signatures in fixed order', async (ctx) => {
  const coinbaseGenericProvider = ctx.get('coinbaseGenericProvider');
  const coinbase = ctx.get('coinbase');
  const bob = ctx.get('bob');
  const xcertId = ctx.get('protocol').xcertMutable.instance.options.address;

  const order: FixedActionsOrder = {
    kind: OrderKind.FIXED_ACTIONS_ORDER,
    signers: [coinbase, bob],
    seed: 1535113220.12345, // should handle floats
    expiration: Date.now() * 60.1234, // should handle floats
    actions: [
      {
        kind: ActionsOrderActionKind.TRANSFER_ASSET,
        ledgerId: xcertId,
        senderId: coinbase,
        receiverId: bob,
        assetId: '100',
      },
    ],
  };

  const coinbaseGateway = new Gateway(coinbaseGenericProvider);
  let error = null;
  await coinbaseGateway.perform(order, []).catch((e) => {
    error = e;
  });
  ctx.is(error.issue, ProviderIssue.FIXED_ACTIONS_ORDER_SIGNATURES);
});

spec.test('handles incorrect amount of signatures in signed fixed order', async (ctx) => {
  const coinbaseGenericProvider = ctx.get('coinbaseGenericProvider');
  const coinbase = ctx.get('coinbase');
  const bob = ctx.get('bob');
  const xcertId = ctx.get('protocol').xcertMutable.instance.options.address;

  const order: SignedFixedActionsOrder = {
    kind: OrderKind.SIGNED_FIXED_ACTIONS_ORDER,
    signers: [coinbase],
    seed: 1535113220.12345, // should handle floats
    expiration: Date.now() * 60.1234, // should handle floats
    actions: [
      {
        kind: ActionsOrderActionKind.TRANSFER_ASSET,
        ledgerId: xcertId,
        senderId: coinbase,
        receiverId: bob,
        assetId: '100',
      },
    ],
  };

  const coinbaseGateway = new Gateway(coinbaseGenericProvider);
  let error = null;
  await coinbaseGateway.perform(order, []).catch((e) => {
    error = e;
  });
  ctx.is(error.issue, ProviderIssue.SIGNED_FIXED_ACTIONS_ORDER_SIGNATURES);
});

spec.test('handles incorrect amount of signatures in dynamic order', async (ctx) => {
  const coinbaseGenericProvider = ctx.get('coinbaseGenericProvider');
  const coinbase = ctx.get('coinbase');
  const bob = ctx.get('bob');
  const xcertId = ctx.get('protocol').xcertMutable.instance.options.address;

  const order: DynamicActionsOrder = {
    kind: OrderKind.DYNAMIC_ACTIONS_ORDER,
    signers: [coinbase, bob],
    seed: 1535113220.12345, // should handle floats
    expiration: Date.now() * 60.1234, // should handle floats
    actions: [
      {
        kind: ActionsOrderActionKind.TRANSFER_ASSET,
        ledgerId: xcertId,
        senderId: coinbase,
        assetId: '100',
      },
    ],
  };

  const coinbaseGateway = new Gateway(coinbaseGenericProvider);
  let error = null;
  await coinbaseGateway.perform(order, []).catch((e) => {
    error = e;
  });
  ctx.is(error.issue, ProviderIssue.DYNAMIC_ACTIONS_ORDER_SIGNATURES);
});

spec.test('handles incorrect amount of signatures in signed dynamic order', async (ctx) => {
  const coinbaseGenericProvider = ctx.get('coinbaseGenericProvider');
  const coinbase = ctx.get('coinbase');
  const bob = ctx.get('bob');
  const xcertId = ctx.get('protocol').xcertMutable.instance.options.address;

  const order: SignedDynamicActionsOrder = {
    kind: OrderKind.SIGNED_DYNAMIC_ACTIONS_ORDER,
    signers: [coinbase, bob],
    seed: 1535113220.12345, // should handle floats
    expiration: Date.now() * 60.1234, // should handle floats
    actions: [
      {
        kind: ActionsOrderActionKind.TRANSFER_ASSET,
        ledgerId: xcertId,
        senderId: coinbase,
        assetId: '100',
      },
    ],
  };

  const coinbaseGateway = new Gateway(coinbaseGenericProvider);
  let error = null;
  await coinbaseGateway.perform(order, []).catch((e) => {
    error = e;
  });
  ctx.is(error.issue, ProviderIssue.SIGNED_DYNAMIC_ACTIONS_ORDER_SIGNATURES);
});

export default spec;
