import { GenericProvider } from '@0xcert/ethereum-generic-provider';
import { Protocol } from '@0xcert/ethereum-sandbox';
import { OrderKind, ValueLedgerDeployOrder } from '@0xcert/scaffold';
import { Spec } from '@specron/spec';
import { Gateway } from '../../../../core/gateway';
import { createOrderHash } from '../../../../lib/value-ledger-deploy-order';

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

spec.test('check if order data claim equals locally created one', async (ctx) => {
  const coinbase = ctx.get('coinbase');
  const bob = ctx.get('bob');
  const token = ctx.get('protocol').erc20.instance.options.address;

  const order: ValueLedgerDeployOrder = {
    kind: OrderKind.VALUE_LEDGER_DEPLOY_ORDER,
    makerId: bob,
    takerId: coinbase,
    seed: 1535113220.12345, // should handle floats
    expiration: Date.now() * 60.1234, // should handle floats
    valueLedgerData: {
      name: 'test',
      symbol: 'TST',
      supply: '5000000000000000000000000',
      decimals: '18',
      ownerId: bob,
    },
    tokenTransferData: {
      ledgerId: token,
      receiverId: coinbase,
      value: '10000',
    },
  };

  const provider = ctx.get('makerGenericProvider');
  const tokenDeployGateway = ctx.get('protocol').tokenDeployGateway.instance.options.address;

  const gateway = new Gateway(provider, { actionsOrderId: '', assetLedgerDeployOrderId: '', valueLedgerDeployOrderId: tokenDeployGateway });
  const claim = await gateway.getOrderDataClaim(order);

  const localClaim = createOrderHash(gateway, order);

  ctx.is(claim, localClaim);
});

export default spec;
