import { GenericProvider } from '@0xcert/ethereum-generic-provider';
import { Protocol } from '@0xcert/ethereum-sandbox';
import { DappValueApproveOrder, OrderKind } from '@0xcert/scaffold';
import { Spec } from '@specron/spec';
import { Gateway } from '../../../../core/gateway';
import { createOrderHash } from '../../../../lib/dapp-value-approve-order';

interface Data {
  protocol: Protocol;
  coinbaseGenericProvider: GenericProvider;
  bobGenericProvider: GenericProvider;
  coinbase: string;
  bob: string;
  sara: string;
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
});

spec.before(async (stage) => {
  const coinbase = stage.get('coinbase');

  const coinbaseGenericProvider = new GenericProvider({
    client: stage.web3,
    accountId: coinbase,
    requiredConfirmations: 0,
  });

  stage.set('coinbaseGenericProvider', coinbaseGenericProvider);
});

spec.test('check if order data claim equals locally created one', async (ctx) => {
  const coinbase = ctx.get('coinbase');
  const bob = ctx.get('bob');
  const sara = ctx.get('sara');
  const dappTokenAddress = ctx.get('protocol').dappToken.instance.options.address;
  const order: DappValueApproveOrder = {
    kind: OrderKind.DAPP_VALUE_APPROVE_ORDER,
    ledgerId: dappTokenAddress,
    approver: coinbase,
    spender: sara,
    value: '10000',
    feeRecipient: bob,
    feeValue: '10000',
    seed: 1535113220.12345, // should handle floats
    expiration: Date.now() * 60.1234, // should handle floats
  };

  const provider = ctx.get('coinbaseGenericProvider');

  const gateway = new Gateway(provider);
  const claim = await gateway.getOrderDataClaim(order);

  const localClaim = createOrderHash(order);

  ctx.is(claim, localClaim);
});

export default spec;
