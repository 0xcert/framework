import { Spec } from '@specron/spec';
import { Context } from '../../../core/context';
import { SignMethod } from '../../../core/types';

interface Data {
  coinbase: string;
  context: Context;
}

const spec = new Spec<Data>();

spec.before(async (stage) => {
  const context = new Context();

  stage.set('context', context);
});

spec.before(async (stage) => {
  const accounts = await stage.web3.eth.getAccounts();

  stage.set('coinbase', accounts[0]);
});

spec.test('initializes context data', async (ctx) => {
  const context = ctx.get('context');
  await context.attach(ctx);

  ctx.true(!!context.minterId);
  ctx.true(!!context.web3);
  ctx.is(context.makerId, ctx.get('coinbase'));
  ctx.is(context.signMethod, SignMethod.ETH_SIGN);
});

export default spec;
