import { Spec } from '@specron/spec';
import { HttpProvider } from '../..';

interface Data {
  provider: HttpProvider;
}

const spec = new Spec<Data>();

spec.before(async (stage) => {
  const provider = new HttpProvider({
    host: 'https://ropsten.infura.io/v3/06312ac7a50b4bd49762abc5cf79dab8',
  });

  stage.set('provider', provider);
});

spec.test('returns block data', async (ctx) => {
  const provider = ctx.get('provider');
  const tx = '0x853f015e3964a00be518dd0f06262165ce464cb261c36e86645077b1eaeb75a9';

  const res = await provider.send({
    method: 'eth_getTransactionByHash',
    params: [tx],
  });

  ctx.is(res.result.hash, tx);
});

export default spec;
