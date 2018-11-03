import { Spec } from '@specron/spec';
import { Connector } from '../../../core/connector';
import { ConnectorError } from '@0xcert/scaffold';

interface Data {
  coinbase: string;
  connector: Connector;
}

const spec = new Spec<Data>();

spec.before(async (stage) => {
  const connector = new Connector();
  await connector.attach(stage);

  stage.set('connector', connector);
});

spec.before(async (stage) => {
  const accounts = await stage.web3.eth.getAccounts();

  stage.set('coinbase', accounts[0]);
});

spec.test('reads data from the network', async (ctx) => {
  const connector = ctx.get('connector');
  const coinbase = ctx.get('coinbase');
  const resolver = async () => parseInt(await ctx.web3.eth.getBalance(coinbase));

  const query = await connector.query<number>(resolver);

  ctx.true(query.result > 0);
});

spec.test('handles an error', async (ctx) => {
  const connector = ctx.get('connector');
  const resolver = async () => { throw 'foo' };

  try {
    await connector.query<number>(resolver);
    ctx.fail();
  } catch (error) {
    ctx.is(error.name, 'ConnectorError');
  }
});

export default spec;
