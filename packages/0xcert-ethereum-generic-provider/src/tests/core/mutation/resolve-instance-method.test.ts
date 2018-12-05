import { Spec } from '@specron/spec';
import { Protocol } from '@0xcert/ethereum-sandbox';
import { Mutation, MutationEvent, GenericProvider } from '../../..';

interface Data {
  provider: GenericProvider
  protocol: Protocol;
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
  const provider = new GenericProvider({
    client: stage.web3,
  });

  stage.set('provider', provider);
});

spec.test('method `resolve` resolves mutation', async (ctx) => {
  const provider = ctx.get('provider');
  const coinbase = ctx.get('coinbase');
  const bob = ctx.get('bob');
  const counters = { confirm: 0, resolve: 0 };

  const { transactionHash } = await ctx.web3.eth.sendTransaction({
    from: coinbase,
    to: bob,
    value: 100000,
  });

  const mutation = new Mutation(provider, transactionHash);
  mutation.on(MutationEvent.CONFIRM, () => counters.confirm++)
  mutation.on(MutationEvent.RESOLVE, () => counters.resolve++)

  mutation.resolve();
  ctx.true(mutation.isPending());
  await mutation.resolve();
  ctx.true(mutation.isResolved());

  ctx.true(mutation.confirmations >= 25);
  ctx.true(counters.confirm >= 1);
  ctx.is(mutation.id, transactionHash);
  ctx.is(mutation.senderId, coinbase.toLowerCase());
  ctx.is(mutation.receiverId, bob.toLowerCase());
  ctx.is(counters.confirm, 1);
});

export default spec;
