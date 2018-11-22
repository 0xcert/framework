import { Spec } from '@specron/spec';
import { Context } from '@0xcert/web3-context';
import { Protocol } from '@0xcert/web3-sandbox';
import { ValueLedger } from '../../../core/ledger';

interface Data {
  context: Context
  ledger: ValueLedger;
  protocol: Protocol;
}

const spec = new Spec<Data>();

spec.before(async (stage) => {
  const protocol = new Protocol(stage.web3);
  
  stage.set('protocol', await protocol.deploy());
});

spec.before(async (stage) => {
  const context = new Context({
    web3: stage.web3,
    myId: await stage.web3.eth.getCoinbase(),
  });

  stage.set('context', context);
});

spec.before(async (stage) => {
  const context = stage.get('context');
  const ledgerId = stage.get('protocol').erc20.instance.options.address;

  stage.set('ledger', new ValueLedger(context, ledgerId));
});

spec.test('returns ledger info', async (ctx) => {
  const ledger = ctx.get('ledger');
  
  const info = await ledger.getInfo().then((q) => q.result);

  ctx.deepEqual(info, {
    name: "Mock Token",
    symbol: "MCK",
    decimals: 18,
  });
});

export default spec;
