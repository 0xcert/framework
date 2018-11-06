import { Spec } from '@specron/spec';
import { Context } from '@0xcert/web3-context';
import { Order, OrderActionKind } from '../../..';

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

  const order = new Order(context);
  order.makerId = '0x342da4DaE236037E9586499DA06494DDE2a0b52b';
  order.takerId = '0x1231858C3aeFe5B5E8A5C81d2b5341fbc41E2B13';
  order.seed = 1535113220;
  order.expiration = 1535113820;
  order.actions.push({
    kind: OrderActionKind.TRANSFER_VALUE,
    ledgerId: '0x2bD270a0F3232E9f11dd439D8E5e74694e46dC53',
    senderId: '0x342da4DaE236037E9586499DA06494DDE2a0b52b',
    receiverId: '0x287206D90777dcB5fb96070D0DDF06737FCE3d1E',
    value: 5000,
  });
  order.actions.push({
    kind: OrderActionKind.TRANSFER_VALUE,
    ledgerId: '0x2bD270a0F3232E9f11dd439D8E5e74694e46dC53',
    senderId: '0x342da4DaE236037E9586499DA06494DDE2a0b52b',
    receiverId: '0x28bC05dd0Eb0A3912AB7ea9d9C0A0502AE0773C7',
    value: 300,
  });
  await order.sign();

  ctx.is(order.signature.indexOf('0:'), 0);
});

export default spec;
