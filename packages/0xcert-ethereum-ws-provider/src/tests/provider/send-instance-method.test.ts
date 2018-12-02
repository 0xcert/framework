// import { Spec } from '@specron/spec';
// import { WsProvider } from '../..';

// interface Data {
//   provider: WsProvider;
// }

// const spec = new Spec<Data>();

// spec.before(async (stage) => {
//   const provider = new WsProvider({
//     url: 'wss://ropsten.infura.io/ws',
//   });

//   stage.set('provider', provider);
// });

// spec.test('returns block data', async (ctx) => {
//   const provider = ctx.get('provider');
//   const tx = '0x853f015e3964a00be518dd0f06262165ce464cb261c36e86645077b1eaeb75a9';

//   const res = await provider.post({
//     method: 'eth_getTransactionByHash',
//     params: [tx],
//   });

//   ctx.is(res.result.hash, tx);
// });

// export default spec;
