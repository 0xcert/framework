// import { Spec } from '@specron/spec';
// import { HttpProvider } from '@0xcert/ethereum-http-provider';
// import { Client } from '../../../core/client';
// import { ClientMock } from '../../helpers/client-mock';

// const spec = new Spec<{
// }>();

// spec.skip('tests on local 0xcert api', async (ctx) => {
//   const accounts = await ctx.web3.eth.getAccounts();
//   const provider = new HttpProvider({
//     url: 'http://localhost:8520',
//     requiredConfirmations: 1,
//     accountId: accounts[0],
//   });
//   const client = new Client({
//     apiUrl: 'http://localhost:4444',
//     provider,
//   });
//   await client.init().catch((e) => { ctx.fail(); });
//   ctx.pass();
// });

// spec.skip('test init with mock data', async (ctx) => {
//   const accounts = await ctx.web3.eth.getAccounts();
//   const provider = new HttpProvider({
//     url: 'http://localhost:8520',
//     requiredConfirmations: 1,
//     accountId: accounts[0],
//   });
//   const client = new ClientMock({
//     apiUrl: 'http://localhost:4444',
//     provider,
//   });
//   await client.init();
// });

// export default spec;
