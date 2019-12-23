// import { Protocol } from '@0xcert/ethereum-sandbox';
// import { Spec } from '@specron/spec';
// import { HttpProvider } from '@0xcert/ethereum-http-provider';
// import { ClientMock } from '../../helpers/client-mock';
// import { Priority, ActionCreateAsset, ActionKind, ActionSetAbilities, GeneralAssetLedgerAbility, ActionsOrder } from '../../../core/types';

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
//     tokenAddress: protocol.erc20.instance.options.address,
//     receiverAddress: accounts[3],
//     assetCreateCost: 3,
//     assetTransferCost: 1,
//     paymentAssetUpdateEurAmount: 1,
//     valueTransferCost: 1,
//     assetDeployCost: 5,
//     assetDestroyCost: 1,
//     setAbilitiesCost: 1,
//     assetRevokeCost: 1,
//     assetUpdateCost: 1,
//     ledgers: [
//       {
//         id: '5d01054b8096255271484f08',
//         address: protocol.xcert.instance.options.address,
//         name: 'ledgerName',
//         symbol: 'ledgerSymbol',
//         schema: '{"$schema":"http://json-schema.org/draft-07/schema","description":"An abstract digital asset schema.","properties":{"$evidence":{"description":"A URI pointing to the evidence JSON with data needed to certify this asset.","type":"string"},"$schema":{"description":"A path to JSON Schema definition file.","type":"string"},"name":{"description":"A property that holds a name of an asset.","type":"string"},"description":{"description":"A property that holds a detailed description of an asset.","type":"string"},"image":{"description":"A public property that can be a valid URI pointing to a resource with mime type image/* representing the asset to which this digital assets represents. Consider making any images at a width between 320 and 1080 pixels and aspect ratio between 1.91:1 and 4:5 inclusive.","type":"string"}},"title":"Asset","type":"object","required":["$schema"]}',
//         ledgerAbilities:[
//           {
//             id: '5d01054b8096255271484f07',
//             profileId: accounts[0],
//             kind: 1001,
//           },
//           {
//             id: '5d01054b8096255271484f08',
//             profileId: accounts[0],
//             kind: 1002
//           }
//         ]
//       }
//     ]
//   };

//   const xcert = stage.get('protocol').xcert;
//   const erc20 = stage.get('protocol').erc20;
//   const tokenTransferProxy = stage.get('protocol').tokenTransferProxy.instance.options.address;
//   const xcertCreateProxy = stage.get('protocol').xcertCreateProxy.instance.options.address;
//   const abilitableManageProxy = stage.get('protocol').abilitableManageProxy.instance.options.address;

//   await xcert.instance.methods.grantAbilities(xcertCreateProxy, 16).send({ from: accounts[0] });
//   await xcert.instance.methods.grantAbilities(abilitableManageProxy, 1).send({ from: accounts[0] });
//   await erc20.instance.methods.approve(tokenTransferProxy, '100000000000000000000000').send({ from: accounts[0] });

//   stage.set('accounts', accounts);
//   stage.set('data', data);
//   stage.set('provider', provider);
// });

// spec.skip('test order create asset perform with mock data', async (ctx) => {
//   const provider = ctx.get('provider');
//   const xcert = ctx.get('protocol').xcert;
//   const data = ctx.get('data');
//   const accounts = ctx.get('accounts');

//   const client = new ClientMock({
//     apiUrl: 'http://localhost:4444',
//     provider,
//   });

//   await client.init();
//   client.setValuesFromData(data);

//   const assetData = {
//     "description": "description",
//     "image": "image",
//     "name": "name"
//   };

//   const action = {
//     kind: ActionKind.CREATE_ASSET,
//     assetLedgerId: xcert.instance.options.address,
//     receiverId: accounts[5],
//     asset: assetData,
//     id: '1',
//   } as ActionCreateAsset;

//   const order: ActionsOrder = {
//     actions: [action],
//     signersIds: [],
//     payerId: null,
//     wildcardSigner: true,
//     automatedPerform: true,
//   };

//   await client.createOrder(order, Priority.LOW);
//   ctx.is(await xcert.instance.methods.ownerOf(1).call(), accounts[5]);
// });

// spec.skip('test order set abilitites perform with mock data', async (ctx) => {
//   const provider = ctx.get('provider');
//   const xcert = ctx.get('protocol').xcert;
//   const data = ctx.get('data');
//   const accounts = ctx.get('accounts');

//   const client = new ClientMock({
//     apiUrl: 'http://localhost:4444',
//     provider,
//   });

//   await client.init();
//   client.setValuesFromData(data);

//   const action = {
//     kind: ActionKind.SET_ABILITIES,
//     assetLedgerId: xcert.instance.options.address,
//     receiverId: accounts[5],
//     abilities: [GeneralAssetLedgerAbility.CREATE_ASSET],
//   } as ActionSetAbilities;

//   const order: ActionsOrder = {
//     actions: [action],
//     signersIds: [accounts[1]],
//     payerId: null,
//     wildcardSigner: true,
//     automatedPerform: true,
//   };

//   await client.createOrder(order, Priority.LOW);

//   ctx.true(await xcert.instance.methods.isAble(accounts[5], GeneralAssetLedgerAbility.CREATE_ASSET).call());
// });

// export default spec;
