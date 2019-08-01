import { Protocol } from '@0xcert/ethereum-sandbox';
import { Spec } from '@specron/spec';
import { GenericProvider, Mutation } from '../../..';

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
  const coinbase = stage.get('coinbase');
  const provider = new GenericProvider({
    client: stage.web3,
    requiredConfirmations: 1,
    accountId: coinbase,
  });
  stage.set('provider', provider);
});

spec.test('cancels mutation throws when mutation already mined', async (ctx) => {
  const provider = ctx.get('provider');
  const coinbase = ctx.get('coinbase');
  const bob = ctx.get('bob');

  const transactionHash = await ctx.web3.eth.sendTransaction({ from: coinbase, to: bob, value: 0 }).then((t) => t.transactionHash);
  const mutation = new Mutation(provider, transactionHash);
  await ctx.throws(() => mutation.cancel());
});

export default spec;
