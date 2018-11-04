import { Spec } from '@specron/spec';
import { Context } from '@0xcert/web3-context';
import { ExchangeOrder } from '../../../core/order';

interface Data {
  context: Context;
}

const spec = new Spec<Data>();

spec.before(async (stage) => {
  const context = new Context();
  await context.attach(stage);

  stage.set('context', context);
});

spec.test('signes order claim and sets the signature', async (ctx) => {
  const context = ctx.get('context');

  const order = new ExchangeOrder(context);
  order.claim = 'foo';
  await order.sign();

  ctx.is(order.signature.indexOf('0:'), 0);
});

export default spec;
