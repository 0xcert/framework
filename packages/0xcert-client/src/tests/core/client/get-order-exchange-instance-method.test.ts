import { Spec } from '@specron/spec';
import { OrderGateway } from '@0xcert/ethereum-order-gateway';
import { Protocol } from '@0xcert/ethereum-sandbox';
import { Connector } from '@0xcert/ethereum-connector';
import { Client } from '../../..';

interface Data {
  protocol: Protocol;
  client: Client;
}

const spec = new Spec<Data>();

spec.before(async (stage) => {
  const protocol = new Protocol(stage.web3);
  stage.set('protocol', await protocol.deploy());
});

spec.before(async (stage) => {
  stage.set('client', new Client({
    connector: new Connector(stage),
  }));
});

spec.test('creates an instance of order exchange', async (ctx) => {
  const client = ctx.get('client');
  const exchangeId = ctx.get('protocol').exchange.instance.options.address;
  const exchange = await client.getOrderGateway(exchangeId);
  ctx.is(exchange.id, exchangeId);
  ctx.true(exchange instanceof OrderGateway); 
});

export default spec;
