import { Spec } from '@specron/spec';
import { Transaction } from '../../core/transaction';
import { Query } from '../../core/query';

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

spec.test('reads data from network', async (ctx) => {
  const query = new Query<Balance>();
  await query.resolve(ctx.get('resolver'));
  ctx.true(!!query.result);
  ctx.true(query.result.value > 0);
});

export default spec;
