import { GenericProvider } from '@0xcert/ethereum-generic-provider';
import { Protocol } from '@0xcert/ethereum-sandbox';
import { ActionsOrderActionKind, FixedActionsOrder, OrderKind } from '@0xcert/scaffold';
import { Spec } from '@specron/spec';
import { Gateway } from '../../../../core/gateway';
import { createOrderHash } from '../../../../lib/actions-order';

interface Data {
  protocol: Protocol;
  makerGenericProvider: GenericProvider;
  claim: string;
  coinbase: string;
  bob: string;
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
});

spec.before(async (stage) => {
  const coinbase = stage.get('coinbase');

  const makerGenericProvider = new GenericProvider({
    client: stage.web3,
    accountId: coinbase,
  });

  stage.set('makerGenericProvider', makerGenericProvider);
});

spec.test('gets order data claim', async (ctx) => {
  const coinbase = ctx.get('coinbase');
  const bob = ctx.get('bob');
  const xcertId = ctx.get('protocol').xcert.instance.options.address;

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
      {
        kind: ActionsOrderActionKind.TRANSFER_ASSET,
        ledgerId: xcertId,
        senderId: bob,
        receiverId: coinbase,
        assetId: '101',
      },
    ],
  };

  const provider = ctx.get('makerGenericProvider');
  const actionsGatewayId = ctx.get('protocol').actionsGateway.instance.options.address;

  const gateway = new Gateway(provider, { actionsOrderId: actionsGatewayId, assetLedgerDeployOrderId: '', valueLedgerDeployOrderId: '' });
  const claim = createOrderHash(gateway, order);
  ctx.is(await gateway.getOrderDataClaim(order), claim);
});

export default spec;
