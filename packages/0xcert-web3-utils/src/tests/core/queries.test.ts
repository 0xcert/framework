import { Spec } from '@specron/spec';
import { performQuery } from '../../core/queries';

interface Balance {
  value: number;
}

interface Data {
  accounts: string[];
  resolver: () => Promise<any>;
}

const spec = new Spec<Data>();

spec.before(async (stage) => {
  stage.set('accounts', await stage.web3.eth.getAccounts());
});

spec.before(async (stage) => {
  stage.set('resolver', async () => ({
    value: parseInt(await stage.web3.eth.getBalance(stage.get('accounts')[0])),
  }))
});

spec.test('method `performQuery` reads data from network', async (ctx) => {
  const query = await performQuery<Balance>(ctx.get('resolver'));
  ctx.true(!!query.result);
  ctx.true(query.result.value > 0);
});

spec.test('method `performQuery` handle errors', async (ctx) => {
  try {
    await performQuery(() => { throw 'foo' });
    ctx.fail();
  } catch (error) {
    ctx.is(error.name, 'ConnectorError');
  }
});

export default spec;
