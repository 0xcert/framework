import { Spec } from '@specron/spec';
import { Transaction } from '../../core/transaction';
import { Context } from '../../core/context';
import { TransactionState, TransactionEvent } from '@0xcert/connector';

interface Data {
  context: Context
  accounts: string[];
  resolver: (value: number) => Promise<string>;
}

const spec = new Spec<Data>();

spec.before(async (stage) => {
  stage.set('context', new Context({
    web3: stage.web3,
    confirmations: 10,
  }));
});

spec.before(async (stage) => {
  stage.set('accounts', await stage.web3.eth.getAccounts());
});

spec.before(async (stage) => {
  stage.set('resolver', (value) => new Promise((resolve) => {
    stage.web3.eth.sendTransaction({
      from: stage.get('accounts')[0],
      to: stage.get('accounts')[1],
      value,
    }).once('transactionHash', resolve);
  }))
});

spec.test('resolves transaction which has been submited to the network', async (ctx) => {
  const hash = await ctx.get('resolver')(1000);
  const initBalance = [
    await ctx.web3.eth.getBalance(ctx.get('accounts')[0]).then((v) => parseInt(v)),
    await ctx.web3.eth.getBalance(ctx.get('accounts')[1]).then((v) => parseInt(v)),
  ];
  const transaction = new Transaction(hash, ctx.get('context'));
  transaction.resolve(); // should resolve only once
  await transaction.resolve(); // should resolve only once
  transaction.resolve(); // should resolve only once
  const newBalance = [
    await ctx.web3.eth.getBalance(ctx.get('accounts')[0]).then((v) => parseInt(v)),
    await ctx.web3.eth.getBalance(ctx.get('accounts')[1]).then((v) => parseInt(v)),
  ];
  ctx.true(initBalance[0] > newBalance[0]);
  ctx.is(newBalance[1], initBalance[1] + 1000);
  ctx.is(transaction.getState(), TransactionState.APPROVED);
});

spec.test('emits transaction events', async (ctx) => {
  const stats = { confirmation: 0, approval: 0 };
  const hash = await ctx.get('resolver')(1000);
  const transaction = new Transaction(hash, ctx.get('context'));
  transaction.on(TransactionEvent.CONFIRMATION, () => stats.confirmation++);
  transaction.on(TransactionEvent.APPROVAL, () => stats.approval++);
  await transaction.resolve();
  ctx.is(stats.confirmation, 10);
  ctx.is(stats.approval, 1);
});

spec.test('maintains transaction state', async (ctx) => {
  const hash = await ctx.get('resolver')(1000);
  const transaction = new Transaction(hash, ctx.get('context'));
  ctx.is(transaction.getState(), TransactionState.INITIALIZED);
  transaction.resolve();
  ctx.is(transaction.getState(), TransactionState.PENDING)
  await transaction.resolve();
  ctx.is(transaction.getState(), TransactionState.APPROVED);
});

spec.test('interrupts transaction resolving', async (ctx) => {
  const hash = await ctx.get('resolver')(1000);
  const transaction = new Transaction(hash, ctx.get('context'));
  transaction.on(TransactionEvent.CONFIRMATION, () => transaction.interrupt());
  await ctx.throws(() => transaction.resolve());
  ctx.is(transaction.getState(), TransactionState.ERROR);
});

export default spec;
