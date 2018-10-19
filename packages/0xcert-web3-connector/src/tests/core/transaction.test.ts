import { Spec } from '@specron/spec';
import { Web3Transaction } from '../../core/transaction';

interface Data {
  me: string;
  bob: string;
  value: number;
  resolver: () => any;
}

const spec = new Spec<Data>();

spec.before(async (stage) => {
  const accounts = await stage.web3.eth.getAccounts();
  stage.set('me', accounts[0]);
  stage.set('bob', accounts[1]);
  stage.set('value', 10000);
});

spec.before(async (stage) => {
  stage.set('resolver', () => stage.web3.eth.sendTransaction({
    from: stage.get('me'),
    to: stage.get('bob'),
    value: stage.get('value'),
  }));
});

spec.test('performs and resolves transaction on the network', async (ctx) => {
  const initialBalance = {
    me: await ctx.web3.eth.getBalance(ctx.get('me')).then((v) => parseInt(v)),
    bob: await ctx.web3.eth.getBalance(ctx.get('bob')).then((v) => parseInt(v)),
  }
  const transaction = new Web3Transaction({
    web3: ctx.web3,
    resolver: ctx.get('resolver'),
    confirmationsCount: 5,
  });
  transaction.perform();
  await transaction.resolve();
  const currentBalance = {
    me: await ctx.web3.eth.getBalance(ctx.get('me')).then((v) => parseInt(v)),
    bob: await ctx.web3.eth.getBalance(ctx.get('bob')).then((v) => parseInt(v)),
  }
  ctx.true(currentBalance.me, initialBalance.me - ctx.get('value'));
  ctx.true(currentBalance.bob, initialBalance.bob + ctx.get('value'));
  ctx.true(transaction.isApproved());
  ctx.true(transaction.isResolved());
});

spec.test('emits transaction events', async (ctx) => {
  const stats = {
    request: 0,
    response: 0,
    confirmation: 0,
    approval: 0,
  };
  const transaction = new Web3Transaction({
    web3: ctx.web3,
    resolver: ctx.get('resolver'),
    confirmationsCount: 5,
  });
  transaction.on('request', () => stats.request++);
  transaction.on('response', () => stats.response++);
  transaction.on('confirmation', () => stats.confirmation++);
  transaction.on('approval', () => stats.approval++);
  transaction.perform().perform().perform().perform().perform().perform();
  transaction.resolve();
  await transaction.resolve();
  transaction.resolve();
  transaction.perform().perform();
  ctx.deepEqual(stats, {
    request: 1,
    response: 1,
    confirmation: 5,
    approval: 1,
  });
});

spec.test('detaches transaction tracking', async (ctx) => {
  const stats = {
    detach: 0,
    time: Date.now(),
  };
  const transaction = new Web3Transaction({
    web3: ctx.web3,
    resolver: ctx.get('resolver'),
    confirmationsCount: 20,
  });
  transaction.on('detach', () => stats.detach++);
  transaction.perform();
  setTimeout(() => transaction.detach(), 10);
  await transaction.resolve();
  ctx.is(stats.detach, 1);
  ctx.true(Date.now() < stats.time + 20);
});

spec.test('reattachs transaction tracking', async (ctx) => {
  const stats = {
    request: 0,
    response: 0,
    confirmation: 0,
    approval: 0,
  };
  const transaction0 = new Web3Transaction({
    web3: ctx.web3,
    resolver: ctx.get('resolver'),
    confirmationsCount: 20,
  });
  transaction0.on('request', () => stats.request++);
  transaction0.on('response', () => stats.response++);
  transaction0.on('response', () => transaction0.detach());
  transaction0.on('confirmation', () => stats.confirmation++);
  transaction0.on('approval', () => stats.approval++);
  transaction0.perform();
  await transaction0.resolve();
  const transaction1 = new Web3Transaction({
    web3: ctx.web3,
    transactionHash: transaction0.getTransactionHash(),
    confirmationsCount: 5,
  });
  transaction1.on('request', () => stats.request++);
  transaction1.on('response', () => stats.response++);
  transaction1.on('confirmation', () => stats.confirmation++);
  transaction1.on('approval', () => stats.approval++);
  transaction1.perform();
  await transaction1.resolve();
  ctx.deepEqual(stats, {
    request: 1,
    response: 1,
    confirmation: 5,
    approval: 1,
  });
});

export default spec;
