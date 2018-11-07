import { Spec } from '@specron/spec';
import { Context } from '../../../core/context';
import { ConnectorError } from '@0xcert/scaffold';

interface Data {
  coinbase: string;
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
});

spec.test('reads data from the network', async (ctx) => {
  const context = ctx.get('context');
  const coinbase = ctx.get('coinbase');
  const resolver = async () => parseInt(await ctx.web3.eth.getBalance(coinbase));

  const query = await context.query<number>(resolver);

  ctx.true(query.result > 0);
});

spec.test('handles an error', async (ctx) => {
  const context = ctx.get('context');
  const resolver = async () => { throw 'foo' };

  try {
    await context.query<number>(resolver);
    ctx.fail();
  } catch (error) {
    ctx.is(error.name, 'ConnectorError');
  }
});

export default spec;
