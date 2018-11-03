import { Spec } from '@specron/spec';
import { Connector } from '../../../core/connector';
import { SignMethod } from '../../../core/types';

interface Data {
  coinbase: string;
  connector: Connector;
}

const spec = new Spec<Data>();

spec.before(async (stage) => {
  const connector = new Connector();

  stage.set('connector', connector);
});

spec.before(async (stage) => {
  const accounts = await stage.web3.eth.getAccounts();

  stage.set('coinbase', accounts[0]);
});

spec.test('initializes connector data', async (ctx) => {
  const connector = ctx.get('connector');
  await connector.attach(ctx);

  ctx.true(!!connector.minterId);
  ctx.true(!!connector.web3);
  ctx.is(connector.makerId, ctx.get('coinbase'));
  ctx.is(connector.signMethod, SignMethod.ETH_SIGN);
});

export default spec;
