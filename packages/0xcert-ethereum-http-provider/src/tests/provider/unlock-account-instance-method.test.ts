import { Spec } from '@specron/spec';
import { HttpProvider } from '../..';

const spec = new Spec<{
  provider: HttpProvider; 
  bob: string;
}>();

spec.before(async (stage) => {
  const provider = new HttpProvider({
    url: 'http://localhost:8524',
  });
  stage.set('provider', provider);
});

spec.before(async (stage) => {
  const accounts = await stage.web3.eth.getAccounts();
  
  stage.set('bob', accounts[0]);
});

spec.test('unlocks account', async (ctx) => {
  console.log(ctx.get('bob'))
  await ctx.get('provider').unlockAccount(ctx.get('bob'), 'pass', 3600);
});

export default spec;