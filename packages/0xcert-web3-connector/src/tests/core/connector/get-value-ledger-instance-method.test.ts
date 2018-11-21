import { Spec } from '@specron/spec';
import { Protocol } from '@0xcert/web3-sandbox';
import { ValueLedger } from '@0xcert/web3-value-ledger';
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

spec.test('creates an instance of a value ledger', async (ctx) => {
  const connector = ctx.get('connector');
  const ledgerId = ctx.get('protocol').erc20.instance.options.address;
  const ledger = await connector.getValueLedger(ledgerId);
  ctx.is(ledger.id, ledgerId);
  ctx.true(ledger instanceof ValueLedger); 
});

export default spec;
