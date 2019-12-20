// import { Protocol } from '@0xcert/ethereum-sandbox';
// import { Spec } from '@specron/spec';
// import { HttpProvider } from '@0xcert/ethereum-http-provider';
// import { schema86 } from '@0xcert/conventions';
// import { ClientMock } from '../../helpers/client-mock';
// import { Priority, AssetLedgerCapability } from '../../../core/types';

// const spec = new Spec<{
//   provider: any;
//   protocol: any;
//   data: any;
//   accounts: string[];
// }>();

// spec.before(async (stage) => {
//   const protocol = new Protocol(stage.web3);
//   stage.set('protocol', await protocol.deploy());
//   const accounts = await stage.web3.eth.getAccounts();

//   const provider = new HttpProvider({
//     url: 'http://localhost:8520',
//     requiredConfirmations: 0,
//     accountId: accounts[0],
//     gatewayConfig: {
//       actionsOrderId: protocol.actionsGateway.instance.options.address,
//       assetLedgerDeployOrderId: protocol.xcertDeployGateway.instance.options.address,
//       valueLedgerDeployOrderId: protocol.tokenDeployGateway.instance.options.address,
//     }
//   });

//   const data = {
//     paymentTokenAddress: protocol.erc20.instance.options.address,
//     paymentReceiverAddress: accounts[3],
//     paymentAssetMintEurAmount: 3,
//     paymentAssetTransferEurAmount: 1,
//     paymentAssetUpdateEurAmount: 1,
//     paymentValueTransferEurAmount: 1,
//     paymentAssetDeployEurAmount: 5,
//     paymentSetAbilitiesEurAmount: 1,
//   };

//   const xcert = stage.get('protocol').xcert;
//   const erc20 = stage.get('protocol').erc20;
//   const tokenTransferProxy = stage.get('protocol').tokenTransferProxy.instance.options.address;
//   const xcertCreateProxy = stage.get('protocol').xcertCreateProxy.instance.options.address;

//   await xcert.instance.methods.grantAbilities(xcertCreateProxy, 2).send({ from: accounts[0] });
//   await erc20.instance.methods.approve(tokenTransferProxy, '100000000000000000000000').send({ from: accounts[0] });

//   stage.set('accounts', accounts);
//   stage.set('data', data);
//   stage.set('provider', provider);
// });

// spec.skip('test deploy perform with mock data', async (ctx) => {
//   const provider = ctx.get('provider');
//   const erc20 = ctx.get('protocol').erc20;
//   const data = ctx.get('data');
//   const accounts = ctx.get('accounts');

//   const client = new ClientMock({
//     apiUrl: 'http://localhost:4444',
//     provider,
//   });

//   await client.init();
//   data.paymentReceiverAddress = accounts[5];
//   client.setValuesFromData(data);

//   const deploy = {
//     name: 'test',
//     symbol: 'TST',
//     uriPrefix: 'https://prefix.com/',
//     uriPostfix: '.json',
//     schemaId: schema86.toString(),
//     capabilities: [AssetLedgerCapability.DESTROY_ASSET],
//     ownerId: accounts[2],
//    };

//   await client.createDeployment(deploy, Priority.LOW);

//   ctx.is(await erc20.instance.methods.balanceOf(accounts[5]).call(), '3571428571428571428571');
// });

// export default spec;
