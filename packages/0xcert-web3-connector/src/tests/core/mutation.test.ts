import { Spec } from '@specron/spec';
import { Transaction } from '../../core/transaction';
import { Context } from '../../core/context';
import { Mutation } from '../../core/mutation';

interface Data {
  context: Context;
  accounts: string[];
  resolver: () => any;
}

const spec = new Spec<Data>();

spec.before(async (stage) => {
  stage.set('context', new Context({
    web3: stage.web3,
  }));
});

spec.before(async (stage) => {
  stage.set('accounts', await stage.web3.eth.getAccounts());
});

spec.before(async (stage) => {
  stage.set('resolver', () => stage.web3.eth.sendTransaction({
    from: stage.get('accounts')[0],
    to: stage.get('accounts')[1],
    value: 1000,
  }))
});

spec.test('submits transaction to the network', async (ctx) => {
  const mutation = new Mutation(null, ctx.get('context'));
  await mutation.resolve(ctx.get('resolver'));
  ctx.true(mutation.transaction instanceof Transaction);
  ctx.true(!!mutation.transaction.id); 
});

export default spec;
