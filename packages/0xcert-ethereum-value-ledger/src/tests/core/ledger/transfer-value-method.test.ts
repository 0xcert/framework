import { GenericProvider } from '@0xcert/ethereum-generic-provider';
import { Protocol } from '@0xcert/ethereum-sandbox';
import { Spec } from '@specron/spec';
import { ValueLedger } from '../../../core/ledger';

const spec = new Spec<{
  protocol: Protocol;
  coinbase: string;
  bob: string;
  sara: string;
}>();

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
    accountId: coinbase,
    requiredConfirmations: 0,
  });
  const ledger = new ValueLedger(
    provider,
    ctx.get('protocol').erc20.instance.options.address,
  );
  const mutation = await ledger.transferValue({
    receiverId: bob,
    value: amount,
  });
  await mutation.complete();
  ctx.is(mutation.logs[0].event, 'Transfer');
  ctx.is(await token.instance.methods.balanceOf(bob).call(), amount);
});

spec.test('transfers approved amount to another account', async (ctx) => {
  const coinbase = ctx.get('coinbase');
  const bob = ctx.get('bob');
  const sara = ctx.get('sara');
  const token = ctx.get('protocol').erc20;
  const approveAmount = '5000000';
  const provider = new GenericProvider({
    client: ctx.web3,
    accountId: bob,
    requiredConfirmations: 0,
  });
  const ledger = new ValueLedger(
    provider,
    ctx.get('protocol').erc20.instance.options.address,
  );
  await token.instance.methods.approve(bob, approveAmount).send({from: coinbase});
  const mutation = await ledger.transferValue({
    senderId: coinbase,
    receiverId: sara,
    value: approveAmount,
  });
  await mutation.complete();
  ctx.is(mutation.logs[0].event, 'Transfer');
  ctx.is(await token.instance.methods.balanceOf(sara).call(), approveAmount);
});

export default spec;
