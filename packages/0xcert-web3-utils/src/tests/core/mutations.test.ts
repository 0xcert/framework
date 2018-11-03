import { Spec } from '@specron/spec';
import { performMutate } from '../../core/mutations';

interface Data {
  accounts: string[];
  resolver: () => any;
}

const spec = new Spec<Data>();

spec.before(async (stage) => {
  stage.set('accounts', await stage.web3.eth.getAccounts());
});

spec.before(async (stage) => {
  stage.set('resolver', () => stage.web3.eth.sendTransaction({
    from: stage.get('accounts')[0],
    to: stage.get('accounts')[1],
    value: 1000,
  }))
});

spec.test('method `performMutation` submits transaction to the network', async (ctx) => {
  const mutation = await performMutate(ctx.get('resolver'));
  ctx.true(!!mutation.hash);
});

spec.test('method `performMutation` handles errors', async (ctx) => {
  try {
    await performMutate(() => { throw 'foo' });
    ctx.fail();
  } catch (error) {
    ctx.is(error.name, 'ConnectorError');
  }
});

export default spec;
