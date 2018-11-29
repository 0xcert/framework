import { Spec } from '@specron/spec';
// import { Protocol } from '@0xcert/ethereum-sandbox';
import { HttpProvider } from '../..';

interface Data {
  // protocol: Protocol;
  provider: HttpProvider;
}

const spec = new Spec<Data>();

// spec.before(async (stage) => {
//   const protocol = new Protocol(stage.web3);
  
//   stage.set('protocol', await protocol.deploy());
// });

spec.before(async (stage) => {
  const provider = new HttpProvider({
    host: 'wss://ropsten.infura.io/ws',
  });

  stage.set('provider', provider);
});

spec.test('returns block data', async (ctx) => {
  // const protocol = ctx.get('protocol');
  const provider = ctx.get('provider');

  const res = await provider.getTransactionByHash('0x853f015e3964a00be518dd0f06262165ce464cb261c36e86645077b1eaeb75a9');

  ctx.is(res.hash, '0x853f015e3964a00be518dd0f06262165ce464cb261c36e86645077b1eaeb75a9');
});

export default spec;
