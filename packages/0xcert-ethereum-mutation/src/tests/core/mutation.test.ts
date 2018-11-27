import { Spec } from '@specron/spec';
import { GenericProvider } from '@0xcert/ethereum-generic-provider';
import { Protocol } from '@0xcert/ethereum-sandbox';
import { Mutation, MutationEvent } from '../..';

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
  const counters = { confirm: 0, resolve: 0 };

  const { transactionHash } = await ctx.web3.eth.sendTransaction({
    from: ctx.get('coinbase'),
    to: ctx.get('bob'),
    value: 100000,
  });

  const mutation = new Mutation(provider, transactionHash);
  mutation.on(MutationEvent.CONFIRM, () => counters.confirm++)
  mutation.on(MutationEvent.RESOLVE, () => counters.resolve++)
  await mutation.resolve();

  ctx.is(mutation.id, transactionHash);
  ctx.is(counters.confirm, 1);
  ctx.true(counters.confirm >= 1);
  ctx.true(mutation.confirmations >= 25);
});

export default spec;
