import { Protocol } from '@0xcert/ethereum-sandbox';
import { Spec } from '@specron/spec';
import { timeout } from 'promised-timeout';
import { GenericProvider, Mutation, MutationEvent } from '../../..';

const spec = new Spec<{
  provider: GenericProvider;
  protocol: Protocol;
  coinbase: string;
  bob: string;
}>();

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
  const provider = new GenericProvider({
    client: stage.web3,
    requiredConfirmations: 2,
  });
  stage.set('provider', provider);
});

spec.test('resolves mutation', async (ctx) => {
  const provider = ctx.get('provider');
  const coinbase = ctx.get('coinbase');
  const bob = ctx.get('bob');
  const counters = { confirm: 0, complete: 0 };

  const transactionHash = await ctx.web3.eth.sendTransaction({ from: coinbase, to: bob, value: 0 }).then((t) => t.transactionHash);
  const mutation = new Mutation(provider, transactionHash);
  mutation.on(MutationEvent.CONFIRM, () => counters.confirm++);
  mutation.on(MutationEvent.COMPLETE, () => counters.complete++);

  await ctx.web3.eth.sendTransaction({ from: coinbase, to: bob, value: 0 }); // simulate new block
  await mutation.resolve();
  ctx.false(mutation.isPending());
  ctx.false(mutation.isCompleted());
  ctx.is(counters.confirm, 1);
  ctx.is(counters.complete, 0);
  ctx.is(mutation.confirmations, 1);
  ctx.is(mutation.id, transactionHash);
  ctx.is(mutation.senderId, coinbase);
  ctx.is(mutation.receiverId, bob);

  await ctx.web3.eth.sendTransaction({ from: coinbase, to: bob, value: 0 }); // simulate new block
  await mutation.resolve();
  ctx.true(mutation.isCompleted());
  ctx.is(mutation.confirmations, 2);
  ctx.is(counters.complete, 1);

  await ctx.web3.eth.sendTransaction({ from: coinbase, to: bob, value: 0 }); // simulate new block
  await mutation.resolve();
  ctx.true(mutation.isCompleted());
  ctx.is(mutation.confirmations, 3);
  ctx.is(counters.complete, 2);
});

export default spec;
