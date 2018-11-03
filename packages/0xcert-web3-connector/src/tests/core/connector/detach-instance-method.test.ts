import { Spec } from '@specron/spec';
import { Connector } from '../../../core/connector';

interface Data {
  connector: Connector;
}

const spec = new Spec<Data>();

spec.before(async (stage) => {
  const connector = new Connector();
  await connector.attach(stage);

  stage.set('connector', connector);
});

spec.test('wipes connector data', async (ctx) => {
  const connector = ctx.get('connector');
  await connector.detach();

  ctx.is(connector.makerId, null);
  ctx.is(connector.minterId, null);
  ctx.is(connector.signMethod, null);
  ctx.is(connector.web3, null);
});

export default spec;
