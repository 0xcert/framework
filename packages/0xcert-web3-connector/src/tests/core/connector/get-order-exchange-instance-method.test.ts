import { Spec } from '@specron/spec';
import { Protocol } from '@0xcert/web3-sandbox';
import { OrderExchange } from '@0xcert/web3-order-exchange';
import { Connector } from '../../..';

interface Data {
  protocol: Protocol;
  connector: Connector;
}

const spec = new Spec<Data>();

spec.before(async (stage) => {
  const protocol = new Protocol(stage.web3);
  stage.set('protocol', await protocol.deploy());
});

spec.before((stage) => {
  stage.set('connector', new Connector(stage));
});

spec.test('creates an instance of order exchange', async (ctx) => {
  const connector = ctx.get('connector');
  const exchangeId = ctx.get('protocol').exchange.instance.options.address;
  const exchange = await connector.getOrderExchange(exchangeId);
  ctx.is(exchange.id, exchangeId);
  ctx.true(exchange instanceof OrderExchange); 
});

export default spec;
