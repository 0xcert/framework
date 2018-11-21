import { Spec } from '@specron/spec';
import { SignMethod } from '@0xcert/web3-context/dist';
import { Connector } from '../../..';

interface Data {
  connector: Connector;
}

const spec = new Spec<Data>();

spec.before(async (stage) => {
  stage.set('connector', new Connector({
    web3: stage.web3,
    myId: await stage.web3.eth.getAccounts().then((a) => a[0]),
  }));
});

spec.test('signs arbitrary string', async (ctx) => {
  const connector = ctx.get('connector');
  const signature = await connector.sign('foo');
  ctx.true(signature.indexOf(`${SignMethod.ETH_SIGN}:`) === 0);
  ctx.true(signature.length > 10);
});

export default spec;
