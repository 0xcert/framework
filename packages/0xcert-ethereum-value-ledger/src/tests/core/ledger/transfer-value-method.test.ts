import { Spec } from '@specron/spec';
import { GenericProvider } from '@0xcert/ethereum-generic-provider';
import { Protocol } from '@0xcert/ethereum-sandbox';
import { ValueLedger } from '../../../core/ledger';

interface Data {
  protocol: Protocol;
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

spec.test('transfers value to another account', async (ctx) => {
  const coinbase = ctx.get('coinbase');
  const bob = ctx.get('bob');
  const token = ctx.get('protocol').erc20;
  const amount = '5000000';
  const provider = new GenericProvider({
    client: ctx.web3,
    accountId: coinbase
  });
  const ledger = new ValueLedger(provider, ctx.get('protocol').erc20.instance.options.address);

  await ledger.transferValue({
    receiverId: bob,
    value: amount
  });

  const balanceOfBob = await token.instance.methods.balanceOf(bob).call();
  ctx.is(balanceOfBob, amount);
});

spec.test('transfers approved amount to another account', async (ctx) => {
  const coinbase = ctx.get('coinbase');
  const bob = ctx.get('bob');
  const sara = ctx.get('sara');
  const token = ctx.get('protocol').erc20;
  const approveAmount = '5000000';

  const provider = new GenericProvider({
    client: ctx.web3,
    accountId: bob
  });
  const ledger = new ValueLedger(provider, ctx.get('protocol').erc20.instance.options.address);

  await token.instance.methods.approve(bob, approveAmount).send({from: coinbase});
  await ledger.transferValue({
    senderId: coinbase,
    receiverId: sara,
    value: approveAmount
  });

  const balanceOfSara = await token.instance.methods.balanceOf(sara).call();
  ctx.is(balanceOfSara, approveAmount);
});

export default spec;
