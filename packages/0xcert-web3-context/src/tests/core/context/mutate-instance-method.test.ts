import { Spec } from '@specron/spec';
import { Context } from '../../../core/context';
import { ConnectorError } from '@0xcert/scaffold';

interface Data {
  coinbase: string;
  bob: string;
  context: Context;
}

const spec = new Spec<Data>();

spec.before(async (stage) => {
  const context = new Context(stage);
  await context.attach();

  stage.set('context', context);
});

spec.before(async (stage) => {
  const accounts = await stage.web3.eth.getAccounts();

  stage.set('coinbase', accounts[0]);
  stage.set('bob', accounts[1]);
});

spec.test('submits transaction to the network', async (ctx) => {
  const context = ctx.get('context');
  const coinbase = ctx.get('coinbase');
  const bob = ctx.get('bob');
  const resolver = () => ctx.web3.eth.sendTransaction({ from: coinbase, to: bob, value: 1000 });

  const mutation = await context.mutate(resolver);

  ctx.true(!!mutation.hash);
});

spec.test('handles an error', async (ctx) => {
  const context = ctx.get('context');
  const resolver = () => { throw 'foo' };

  try {
    await context.mutate(resolver);
    ctx.fail();
  } catch (error) {
    ctx.is(error.name, 'ConnectorError');
  }
});

export default spec;
