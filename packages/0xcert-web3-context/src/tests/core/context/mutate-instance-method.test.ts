import { Spec } from '@specron/spec';
import { Protocol } from '@0xcert/web3-sandbox';
import { Context } from '../../../core/context';

interface Data {
  protocol: Protocol;
  coinbase: string;
  bob: string;
  context: Context;
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
  const accounts = await stage.web3.eth.getAccounts();

  stage.set('coinbase', accounts[0]);
  stage.set('bob', accounts[1]);
});

spec.test('submits transaction to the network', async (ctx) => {
  const context = ctx.get('context');
  const coinbase = ctx.get('coinbase');
  const bob = ctx.get('bob');
  const xcert = ctx.get('protocol').xcert;

  const resolver = async () => xcert.instance.methods.mint(bob, '100', '0x0');
  const mutation = await context.mutate(resolver, coinbase);

  ctx.true(!!mutation.id);
});

spec.test('handles an error', async (ctx) => {
  const context = ctx.get('context');
  const resolver = async () => { throw 'foo' };

  try {
    await context.mutate(resolver);
    ctx.fail();
  } catch (error) {
    ctx.is(error.name, 'ConnectorError');
  }
});

export default spec;
