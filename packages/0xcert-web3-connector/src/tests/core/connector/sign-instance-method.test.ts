import { Spec } from '@specron/spec';
import { Connector } from '../../../core/connector';
import { SignMethod } from '../../../core/types';

interface Data {
  connector: Connector;
}

const spec = new Spec<Data>();

spec.before(async (stage) => {
  const connector = new Connector();
  await connector.attach(stage);

  stage.set('connector', connector);
});

spec.test('signs data and returns signature', async (ctx) => {
  const connector = ctx.get('connector');

  const signature = await connector.sign('foo');

  ctx.true(signature.indexOf(`${SignMethod.ETH_SIGN}:`) === 0);
  ctx.true(signature.length > 10);
});

export default spec;
