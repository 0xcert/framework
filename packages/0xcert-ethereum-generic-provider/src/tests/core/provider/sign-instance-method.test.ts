import { Spec } from '@specron/spec';
import { GenericProvider } from '../../..';
import { SignMethod } from '../../../core/types';

const spec = new Spec<{
  provider: GenericProvider;
}>();

spec.before(async (stage) => {
  const accounts = await stage.web3.eth.getAccounts();
  const provider = new GenericProvider({
    client: stage.web3,
    signMethod: SignMethod.ETH_SIGN,
    accountId: accounts[0],
  });
  stage.set('provider', provider);
});

spec.test('signs a message', async (ctx) => {
  const provider = ctx.get('provider');
  const signature = await provider.sign('test');
  ctx.true(!!signature);
});

export default spec;
