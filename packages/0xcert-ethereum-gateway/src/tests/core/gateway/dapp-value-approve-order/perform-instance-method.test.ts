import { GenericProvider } from '@0xcert/ethereum-generic-provider';
import { Protocol } from '@0xcert/ethereum-sandbox';
import { DappValueApproveOrder, OrderKind } from '@0xcert/scaffold';
import { Spec } from '@specron/spec';
import { Gateway } from '../../../../core/gateway';

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
  const bob = stage.get('bob');

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

  stage.set('coinbaseGenericProvider', coinbaseGenericProvider);
  stage.set('bobGenericProvider', bobGenericProvider);
});

spec.before(async (stage) => {
  const coinbase = stage.get('coinbase');
  const bob = stage.get('bob');

  const dappToken = stage.get('protocol').dappToken;

  await dappToken.instance.methods.grantAbilities(coinbase, 16).send({ form: coinbase });
  await dappToken.instance.methods.setWhitelistedRecipient(bob, true).send({ form: coinbase });
  await dappToken.instance.methods.deposit(100000, coinbase).send({ form: coinbase });
});

spec.test('sucessfully performs DappValueApproveOrder', async (ctx) => {
  const coinbase = ctx.get('coinbase');
  const bob = ctx.get('bob');
  const sara = ctx.get('sara');
  const bobGenericProvider = ctx.get('bobGenericProvider');
  const coinbaseGenericProvider = ctx.get('coinbaseGenericProvider');
  const dappTokenAddress = ctx.get('protocol').dappToken.instance.options.address;
  const dappToken = ctx.get('protocol').dappToken;

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

  const gatewayCoinbase = new Gateway(coinbaseGenericProvider);
  const sign = await gatewayCoinbase.sign(order);
  const gatewayBob = new Gateway(bobGenericProvider);
  await gatewayBob.perform(order, sign);
  const allowance = await dappToken.instance.methods.allowance(coinbase, sara).call();
  ctx.true(allowance, '10000');
  const balance = await dappToken.instance.methods.balanceOf(bob).call();
  ctx.true(balance, '10000');
});

export default spec;
