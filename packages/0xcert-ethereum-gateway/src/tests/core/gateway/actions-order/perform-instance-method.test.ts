import { GenericProvider } from '@0xcert/ethereum-generic-provider';
import { Protocol } from '@0xcert/ethereum-sandbox';
import { ActionsOrder, ActionsOrderActionKind, GeneralAssetLedgerAbility, OrderKind, SuperAssetLedgerAbility } from '@0xcert/scaffold';
import { Spec } from '@specron/spec';
import { Gateway } from '../../../..';
import { OrderGatewayProxy } from '../../../../core/types';

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

  const coinbaseGenericProvider = new GenericProvider({
    client: stage.web3,
    accountId: coinbase,
    requiredConfirmations: 0,
  });
  const bobGenericProvider = new GenericProvider({
    client: stage.web3,
    accountId: bob,
    requiredConfirmations: 0,
  });

  const saraGenericProvider = new GenericProvider({
    client: stage.web3,
    accountId: sara,
    requiredConfirmations: 0,
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
  const erc20 = stage.get('protocol').erc20;
  const nftokenSafeTransferProxy = stage.get('protocol').nftokenSafeTransferProxy.instance.options.address;
  const tokenTransferProxy = stage.get('protocol').tokenTransferProxy.instance.options.address;
  const xcertCreateProxy = stage.get('protocol').xcertCreateProxy.instance.options.address;
  const xcertUpdateProxy = stage.get('protocol').xcertUpdateProxy.instance.options.address;
  const abilitableManageProxy = stage.get('protocol').abilitableManageProxy.instance.options.address;

  await erc20.instance.methods.transfer(sara, 100000).send({ form: coinbase });
  await xcert.instance.methods.create(coinbase, '100', '0x0').send({ form: coinbase });
  await xcert.instance.methods.create(bob, '101', '0x0').send({ form: coinbase });
  await xcert.instance.methods.create(sara, '1000', '0x0').send({ form: coinbase });
  await xcert.instance.methods.setApprovalForAll(nftokenSafeTransferProxy, true).send({ from: coinbase });
  await xcert.instance.methods.grantAbilities(xcertCreateProxy, GeneralAssetLedgerAbility.CREATE_ASSET).send({ from: coinbase });
  await xcert.instance.methods.grantAbilities(xcertUpdateProxy, GeneralAssetLedgerAbility.UPDATE_ASSET).send({ from: coinbase });
  await xcert.instance.methods.grantAbilities(abilitableManageProxy, SuperAssetLedgerAbility.MANAGE_ABILITIES).send({ from: coinbase });
  await xcert.instance.methods.setApprovalForAll(nftokenSafeTransferProxy, true).send({ from: bob });
  await xcert.instance.methods.setApprovalForAll(nftokenSafeTransferProxy, true).send({ from: sara });
  await erc20.instance.methods.approve(tokenTransferProxy, 100000).send({ from: sara });
});

spec.test('submits gateway actions order to the network which executes transfers', async (ctx) => {
  const orderGatewayId = ctx.get('protocol').orderGateway.instance.options.address;
  const bobGenericProvider = ctx.get('bobGenericProvider');
  const bob = ctx.get('bob');
  const coinbase = ctx.get('coinbase');
  const xcert = ctx.get('protocol').xcertMutable;
  const xcertId = ctx.get('protocol').xcertMutable.instance.options.address;

  const order: ActionsOrder = {
    kind: OrderKind.MULTI_ORDER,
    makerId: coinbase,
    takerId: bob,
    seed: 1535113220.12345, // should handle floats
    expiration: Date.now() * 60.1234, // should handle floats
    actions: [
      {
        kind: ActionsOrderActionKind.CREATE_ASSET,
        ledgerId: xcertId,
        receiverId: bob,
        assetId: '102',
        assetImprint: '0',
      },
      {
        kind: ActionsOrderActionKind.UPDATE_ASSET_IMPRINT,
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
        ledgerId: xcertId,
        receiverId: bob,
        abilities: [GeneralAssetLedgerAbility.CREATE_ASSET],
      },
    ],
  };

  const coinbaseGenericProvider = ctx.get('coinbaseGenericProvider');
  const coinbaseGateway = new Gateway(coinbaseGenericProvider, { actionsOrderId: orderGatewayId, assetLedgerDeployOrderId: '', valueLedgerDeployOrderId: '' });
  const claim = await coinbaseGateway.claim(order);

  const gateway = new Gateway(bobGenericProvider, { actionsOrderId: orderGatewayId, assetLedgerDeployOrderId: '', valueLedgerDeployOrderId: '' });
  const mutation = await gateway.perform(order, claim);
  await mutation.complete();

  ctx.is((mutation.logs[0]).event, 'Perform');

  ctx.is(await xcert.instance.methods.ownerOf('100').call(), bob);
  ctx.is(await xcert.instance.methods.ownerOf('101').call(), coinbase);
  ctx.is(await xcert.instance.methods.ownerOf('102').call(), bob);
  ctx.is(await xcert.instance.methods.tokenImprint('100').call(), '0x2000000000000000000000000000000000000000000000000000000000000000');
  ctx.true(await xcert.instance.methods.isAble(bob, GeneralAssetLedgerAbility.CREATE_ASSET).call());
});

spec.test('submits dynamic gateway actions order to the network which executes transfers', async (ctx) => {
  const orderGatewayId = ctx.get('protocol').orderGateway.instance.options.address;
  const saraGenericProvider = ctx.get('saraGenericProvider');
  const coinbase = ctx.get('coinbase');
  const sara = ctx.get('sara');
  const bob = ctx.get('bob');
  const xcert = ctx.get('protocol').xcertMutable;
  const xcertId = ctx.get('protocol').xcertMutable.instance.options.address;
  const erc20 = ctx.get('protocol').erc20;
  const erc20Id = ctx.get('protocol').erc20.instance.options.address;

  const order: ActionsOrder = {
    kind: OrderKind.MULTI_ORDER,
    makerId: coinbase,
    seed: 1535113220.12345, // should handle floats
    expiration: Date.now() * 60.1234, // should handle floats
    actions: [
      {
        kind: ActionsOrderActionKind.CREATE_ASSET,
        ledgerId: xcertId,
        assetId: '105',
        assetImprint: '0',
      },
      {
        kind: ActionsOrderActionKind.TRANSFER_ASSET,
        ledgerId: xcertId,
        senderId: coinbase,
        assetId: '101',
      },
      {
        kind: ActionsOrderActionKind.TRANSFER_VALUE,
        ledgerId: erc20Id,
        receiverId: bob,
        value: '100000',
      },
      {
        kind: ActionsOrderActionKind.UPDATE_ASSET_IMPRINT,
        ledgerId: xcertId,
        assetImprint: '2',
        assetId: '105',
      },
      {
        kind: ActionsOrderActionKind.SET_ABILITIES,
        ledgerId: xcertId,
        abilities: [GeneralAssetLedgerAbility.CREATE_ASSET],
      },
    ],
  };

  const coinbaseGenericProvider = ctx.get('coinbaseGenericProvider');
  const coinbaseGateway = new Gateway(coinbaseGenericProvider, { actionsOrderId: orderGatewayId, assetLedgerDeployOrderId: '', valueLedgerDeployOrderId: '' });
  const claim = await coinbaseGateway.claim(order);

  const gateway = new Gateway(saraGenericProvider, { actionsOrderId: orderGatewayId, assetLedgerDeployOrderId: '', valueLedgerDeployOrderId: '' });

  await gateway.perform(order, claim).then(() => ctx.sleep(200));

  ctx.is(await xcert.instance.methods.tokenImprint('105').call(), '0x2000000000000000000000000000000000000000000000000000000000000000');
  ctx.is(await xcert.instance.methods.ownerOf('105').call(), sara);
  ctx.is(await xcert.instance.methods.ownerOf('101').call(), sara);
  ctx.is(await erc20.instance.methods.balanceOf(bob).call(), '100000');
  ctx.true(await xcert.instance.methods.isAble(sara, GeneralAssetLedgerAbility.CREATE_ASSET).call());
});

spec.test('handles fixed actions order without receiver', async (ctx) => {
  const orderGatewayId = ctx.get('protocol').orderGateway.instance.options.address;
  const coinbase = ctx.get('coinbase');
  const bob = ctx.get('bob');
  const xcertId = ctx.get('protocol').xcertMutable.instance.options.address;
  const coinbaseGenericProvider = ctx.get('coinbaseGenericProvider');
  const coinbaseGateway = new Gateway(coinbaseGenericProvider, { actionsOrderId: orderGatewayId, assetLedgerDeployOrderId: '', valueLedgerDeployOrderId: '' });

  let order: ActionsOrder = {
    kind: OrderKind.MULTI_ORDER,
    makerId: coinbase,
    takerId: bob,
    seed: 1535113220.12345, // should handle floats
    expiration: Date.now() * 60.1234, // should handle floats
    actions: [
      {
        kind: ActionsOrderActionKind.CREATE_ASSET,
        ledgerId: xcertId,
        assetId: '105',
        assetImprint: '0',
      },
    ],
  };

  let error = null;
  await coinbaseGateway.claim(order).catch((e) => {
    error = e;
  });
  ctx.not(error, null);

  order = {
    kind: OrderKind.MULTI_ORDER,
    makerId: coinbase,
    takerId: bob,
    seed: 1535113220.12345, // should handle floats
    expiration: Date.now() * 60.1234, // should handle floats
    actions: [
      {
        kind: ActionsOrderActionKind.TRANSFER_ASSET,
        ledgerId: xcertId,
        senderId: coinbase,
        assetId: '101',
      },
    ],
  };

  error = null;
  await coinbaseGateway.claim(order).catch((e) => {
    error = e;
  });
  ctx.not(error, null);
});

spec.test('handles fixed actions order without null receiver', async (ctx) => {
  const orderGatewayId = ctx.get('protocol').orderGateway.instance.options.address;
  const coinbase = ctx.get('coinbase');
  const bob = ctx.get('bob');
  const xcertId = ctx.get('protocol').xcertMutable.instance.options.address;
  const coinbaseGenericProvider = ctx.get('coinbaseGenericProvider');
  const coinbaseGateway = new Gateway(coinbaseGenericProvider, { actionsOrderId: orderGatewayId, assetLedgerDeployOrderId: '', valueLedgerDeployOrderId: '' });

  let order: ActionsOrder = {
    kind: OrderKind.MULTI_ORDER,
    makerId: coinbase,
    takerId: bob,
    seed: 1535113220.12345, // should handle floats
    expiration: Date.now() * 60.1234, // should handle floats
    actions: [
      {
        kind: ActionsOrderActionKind.CREATE_ASSET,
        receiverId: null,
        ledgerId: xcertId,
        assetId: '105',
        assetImprint: '0',
      },
    ],
  };

  let error = null;
  await coinbaseGateway.claim(order).catch((e) => {
    error = e;
  });
  ctx.not(error, null);

  order = {
    kind: OrderKind.MULTI_ORDER,
    makerId: coinbase,
    takerId: bob,
    seed: 1535113220.12345, // should handle floats
    expiration: Date.now() * 60.1234, // should handle floats
    actions: [
      {
        kind: ActionsOrderActionKind.TRANSFER_ASSET,
        ledgerId: xcertId,
        senderId: coinbase,
        assetId: '101',
      },
    ],
  };

  error = null;
  await coinbaseGateway.claim(order).catch((e) => {
    error = e;
  });
  ctx.not(error, null);
});

spec.test('handles fixed actions order without sender', async (ctx) => {
  const orderGatewayId = ctx.get('protocol').orderGateway.instance.options.address;
  const coinbase = ctx.get('coinbase');
  const bob = ctx.get('bob');
  const erc20Id = ctx.get('protocol').erc20.instance.options.address;
  const coinbaseGenericProvider = ctx.get('coinbaseGenericProvider');
  const coinbaseGateway = new Gateway(coinbaseGenericProvider, { actionsOrderId: orderGatewayId, assetLedgerDeployOrderId: '', valueLedgerDeployOrderId: '' });

  const order: ActionsOrder = {
    kind: OrderKind.MULTI_ORDER,
    makerId: coinbase,
    takerId: bob,
    seed: 1535113220.12345, // should handle floats
    expiration: Date.now() * 60.1234, // should handle floats
    actions: [
      {
        kind: ActionsOrderActionKind.TRANSFER_VALUE,
        ledgerId: erc20Id,
        receiverId: coinbase,
        value: '100000',
      },
    ],
  };

  let error = null;
  await coinbaseGateway.claim(order).catch((e) => {
    error = e;
  });
  ctx.not(error, null);
});

spec.test('handles fixed actions order with null sender', async (ctx) => {
  const orderGatewayId = ctx.get('protocol').orderGateway.instance.options.address;
  const coinbase = ctx.get('coinbase');
  const bob = ctx.get('bob');
  const erc20Id = ctx.get('protocol').erc20.instance.options.address;
  const coinbaseGenericProvider = ctx.get('coinbaseGenericProvider');
  const coinbaseGateway = new Gateway(coinbaseGenericProvider, { actionsOrderId: orderGatewayId, assetLedgerDeployOrderId: '', valueLedgerDeployOrderId: '' });

  const order: ActionsOrder = {
    kind: OrderKind.MULTI_ORDER,
    makerId: coinbase,
    takerId: bob,
    seed: 1535113220.12345, // should handle floats
    expiration: Date.now() * 60.1234, // should handle floats
    actions: [
      {
        kind: ActionsOrderActionKind.TRANSFER_VALUE,
        ledgerId: erc20Id,
        senderId: null,
        receiverId: coinbase,
        value: '100000',
      },
    ],
  };

  let error = null;
  await coinbaseGateway.claim(order).catch((e) => {
    error = e;
  });
  ctx.not(error, null);
});

spec.test('handles dynamic actions order without sender and receiver', async (ctx) => {
  const orderGatewayId = ctx.get('protocol').orderGateway.instance.options.address;
  const coinbase = ctx.get('coinbase');
  const erc20Id = ctx.get('protocol').erc20.instance.options.address;
  const coinbaseGenericProvider = ctx.get('coinbaseGenericProvider');
  const coinbaseGateway = new Gateway(coinbaseGenericProvider, { actionsOrderId: orderGatewayId, assetLedgerDeployOrderId: '', valueLedgerDeployOrderId: '' });

  const order: ActionsOrder = {
    kind: OrderKind.MULTI_ORDER,
    makerId: coinbase,
    seed: 1535113220.12345, // should handle floats
    expiration: Date.now() * 60.1234, // should handle floats
    actions: [
      {
        kind: ActionsOrderActionKind.TRANSFER_VALUE,
        ledgerId: erc20Id,
        value: '100000',
      },
    ],
  };

  let error = null;
  await coinbaseGateway.claim(order).catch((e) => {
    error = e;
  });
  ctx.not(error, null);
});

spec.test('handles dynamic actions order without null sender and null receiver', async (ctx) => {
  const orderGatewayId = ctx.get('protocol').orderGateway.instance.options.address;
  const coinbase = ctx.get('coinbase');
  const erc20Id = ctx.get('protocol').erc20.instance.options.address;
  const coinbaseGenericProvider = ctx.get('coinbaseGenericProvider');
  const coinbaseGateway = new Gateway(coinbaseGenericProvider, { actionsOrderId: orderGatewayId, assetLedgerDeployOrderId: '', valueLedgerDeployOrderId: '' });

  const order: ActionsOrder = {
    kind: OrderKind.MULTI_ORDER,
    makerId: coinbase,
    takerId: null,
    seed: 1535113220.12345, // should handle floats
    expiration: Date.now() * 60.1234, // should handle floats
    actions: [
      {
        kind: ActionsOrderActionKind.TRANSFER_VALUE,
        senderId: null,
        receiverId: null,
        ledgerId: erc20Id,
        value: '100000',
      },
    ],
  };

  let error = null;
  await coinbaseGateway.claim(order).catch((e) => {
    error = e;
  });
  ctx.not(error, null);
});

export default spec;
