import { Spec } from '@specron/spec';
import { Context } from '../../../core/context';

interface Data {
  coinbase: string;
  bob: string;
  context: Context;
}

const spec = new Spec<Data>();

spec.before(async (stage) => {
  const context = new Context({
    web3: stage.web3,
    myId: await stage.web3.eth.getCoinbase(),
  });

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

  const mutation = await context.transfer({ to: bob, value: 1000 }, coinbase);

  ctx.true(!!mutation.id);
});

spec.test('handles an error', async (ctx) => {
  const context = ctx.get('context');
  const coinbase = ctx.get('coinbase');

  try {
    await context.transfer({ to: 'foo', value: -10 }, coinbase);
    ctx.fail();
  } catch (error) {
    ctx.is(error.name, 'ConnectorError');
  }
});

export default spec;
