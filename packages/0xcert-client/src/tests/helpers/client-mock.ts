// import { Client } from "../../core/client";
// import { Priority, Signer, ActionsOrder, ActionKind } from "../../core/types";
// import { AssetLedgerDeployOrder, Gateway, OrderKind, ActionsOrder as FrameworkActionsOrder, ActionsOrderAction as FrameworkActionsOrderAction, ActionsOrderActionKind, SignedDynamicActionsOrder, SignedFixedActionsOrder, } from '@0xcert/ethereum-gateway';
// import { sha } from "@0xcert/utils";
// import BigNumber from "bignumber.js";

// export class ClientMock extends Client {

//   /**
//    * Client mock initialization.
//    */
//   public async init() {
//     const data = {
//       data: {
//         tokenAddress: '0x83e2BE8d114F9661221384B3a50d24B96a5653F5',
//         receiverAddress: '0xF9196F9f176fd2eF9243E8960817d5FbE63D79aa',
//         assetCreateCost: 3,
//         assetTransferCost: 1,
//         paymentAssetUpdateEurAmount: 1,
//         valueTransferCost: 1,
//         assetDeployCost: 5,
//         assetDestroyCost: 1,
//         setAbilitiesCost: 1,
//         assetRevokeCost: 1,
//         assetUpdateCost: 1,
//       },
//       id: '5d01054b8096255271484f0a',
//       status: 200
//     };
//     this.payment.tokenAddress = data.data.tokenAddress;
//     this.payment.receiverAddress = data.data.receiverAddress;
//     this.payment.valueTransferCost = data.data.valueTransferCost;
//     this.payment.assetTransferCost = data.data.assetTransferCost;
//     this.payment.assetCreateCost = data.data.assetCreateCost;
//     this.payment.assetDeployCost = data.data.assetDeployCost;
//     this.payment.assetDestroyCost = data.data.assetDestroyCost;
//     this.payment.setAbilitiesCost = data.data.setAbilitiesCost;
//     this.payment.assetRevokeCost = data.data.assetRevokeCost;
//     this.payment.assetUpdateCost = data.data.assetUpdateCost;

//     this.authentication = 'authenticated';
//   }

//   /**
//    * Sets payment values from data.
//    * @param data Payment data.
//    */
//   public setValuesFromData(data: any) {
//     this.payment.tokenAddress = data.tokenAddress;
//     this.payment.receiverAddress = data.receiverAddress;
//     this.payment.valueTransferCost = data.valueTransferCost;
//     this.payment.assetTransferCost = data.assetTransferCost;
//     this.payment.assetCreateCost = data.assetCreateCost;
//     this.payment.assetDeployCost = data.assetDeployCost;
//     this.payment.setAbilitiesCost = data.setAbilitiesCost;
//     this.payment.assetDestroyCost = data.assetDestroyCost;
//   }

//   // public async sendOrderRequest(order: any, priority: Priority) {
//   //   const gateway = new Gateway(this.provider);

//   //   const claim = order.signers.map((s: Signer) => s.claim);
//   //   const performOrder = order;
//   //   performOrder.signers = performOrder.signers.map((s: Signer) => s.accountId);
//   //   if (order.wildCardClaim) {
//   //     performOrder.signers = [...performOrder.signers, order.wildCardClaim.accountId]
//   //   }

//   //   const mutation = await gateway.perform(order, claim);
//   //   return mutation.complete();
//   // }

//   public async sendDeployRequest(deploy: any, claim: string, priority: Priority) {
//     const schemaId = `0x${await sha(256, JSON.stringify(deploy.assetLedgerData.schema))}`;
//     deploy.kind = OrderKind.ASSET_LEDGER_DEPLOY_ORDER;
//     deploy.assetLedgerData.schemaId = schemaId;
//     const gateway = new Gateway(this.provider);
//     const mutation = await gateway.perform(deploy as AssetLedgerDeployOrder, claim);
//     return mutation.complete();
//   }

//   public async createOrder(order: ActionsOrder, priority: Priority) {
//     const orderGateway = new Gateway(this.provider);

//     // Set order's payer.
//     if (!order.payerId && !order.wildcardSigner) {
//       throw new Error('Payer must be specified if `wildcardSigner` tag is set to false.');
//     }

//     // Checks if payer id is order's signer.
//     if (order.payerId) {
//       const isPayerSigner = order.signersIds.find((s) => s.toLowerCase() === order.payerId.toLowerCase());
//       if (!isPayerSigner) {
//         throw new Error('Payer must be listed as order\'s signer.');
//       }
//     }

//     const orderActions : FrameworkActionsOrderAction[] = [];
//     const date = Date.now();
//     let paymentAmount = 0;

//     for (let i = 0; i < order.actions.length; i++) {
//       const action = order.actions[i];
//       switch (action.kind) {
//         case (ActionKind.CREATE_ASSET): {
//           orderActions.push({
//             kind: ActionsOrderActionKind.CREATE_ASSET,
//             senderId: action.senderId,
//             receiverId: action.receiverId,
//             assetId: action.id,
//             assetImprint: action.imprint,
//             ledgerId: action.assetLedgerId
//           } as FrameworkActionsOrderAction);
//           paymentAmount += this.payment.assetCreateCost;
//           break;
//         }
//         case (ActionKind.TRANSFER_ASSET): {
//           orderActions.push({
//             kind: ActionsOrderActionKind.TRANSFER_ASSET,
//             receiverId: action.receiverId,
//             assetId: action.id,
//             ledgerId: action.assetLedgerId,
//             senderId: action.senderId,
//           } as FrameworkActionsOrderAction);
//           paymentAmount += this.payment.assetTransferCost;
//           break;
//         }
//         case (ActionKind.TRANSFER_VALUE): {
//           orderActions.push({
//             kind: ActionsOrderActionKind.TRANSFER_VALUE,
//             senderId: action.senderId,
//             receiverId: action.receiverId,
//             value: (action.value * 1000000000000000000).toString(),
//             ledgerId: action.valueLedgerId,
//           } as FrameworkActionsOrderAction);
//           paymentAmount += this.payment.valueTransferCost;
//           break;
//         }
//         case (ActionKind.SET_ABILITIES): {
//           orderActions.push({
//             kind: ActionsOrderActionKind.SET_ABILITIES,
//             receiverId: action.receiverId,
//             senderId: action.senderId,
//             ledgerId: action.assetLedgerId,
//             abilities: action.abilities,
//           } as FrameworkActionsOrderAction);
//           paymentAmount += this.payment.setAbilitiesCost;
//           break;
//         }
//         case (ActionKind.DESTROY_ASSET): {
//           orderActions.push({
//             kind: ActionsOrderActionKind.DESTROY_ASSET,
//             senderId: action.senderId,
//             ledgerId: action.assetLedgerId,
//             assetId: action.id,
//           } as FrameworkActionsOrderAction);
//           paymentAmount += this.payment.assetDestroyCost;
//           break;
//         }
//         default: {
//           break;
//         }
//       }
//     }

//     // Add order payment action.
//     const multiplier = new BigNumber(1000000000000000000);
//     const value = new BigNumber(paymentAmount).multipliedBy(multiplier);
//     const expiration = Date.now() + 172800000; // 2 days

//     orderActions.push({
//       kind: ActionsOrderActionKind.TRANSFER_VALUE,
//       senderId: order.payerId,
//       receiverId: this.payment.receiverAddress,
//       value: value.toFixed(0),
//       ledgerId: this.payment.tokenAddress,
//     } as FrameworkActionsOrderAction);

//     // Parse signers into valid API structure.
//     const signers: Signer[] = order.signersIds.map((s) => { return { accountId: s, claim: ''} });

//     // Check if account is specified as signer and generate its claim.
//     const accountSignerIndex = signers.findIndex((s) => s.accountId.toLowerCase() === this.provider.accountId.toLowerCase());
//     if (accountSignerIndex !== -1) {
//       const claimOrder = {
//         kind: order.wildcardSigner ? OrderKind.SIGNED_DYNAMIC_ACTIONS_ORDER : OrderKind.SIGNED_FIXED_ACTIONS_ORDER,
//         seed: date,
//         signers: order.signersIds,
//         expiration,
//         actions: orderActions,
//       } as FrameworkActionsOrder;

//       signers[accountSignerIndex].claim = await orderGateway.sign(claimOrder);
//     }

//     const performOrder = {
//       kind: order.wildcardSigner ? OrderKind.SIGNED_DYNAMIC_ACTIONS_ORDER : OrderKind.SIGNED_FIXED_ACTIONS_ORDER,
//       seed: date,
//       signers: signers.map((s: Signer) => s.accountId),
//       expiration,
//       actions: orderActions,
//     }

//     let claim = signers.map((s: Signer) => s.claim);
//     const claimOrder = {
//       kind: order.wildcardSigner ? OrderKind.SIGNED_DYNAMIC_ACTIONS_ORDER : OrderKind.SIGNED_FIXED_ACTIONS_ORDER,
//       seed: date,
//       signers: order.signersIds,
//       expiration,
//       actions: orderActions,
//     } as FrameworkActionsOrder;
//     claim = [...claim, await orderGateway.sign(claimOrder)]

//     console.log(JSON.stringify(performOrder, null ,2));
//     console.log(claim)
//     const mutation = order.wildcardSigner ?
//       await orderGateway.perform(performOrder as SignedDynamicActionsOrder, claim) :
//       await orderGateway.perform(performOrder as SignedFixedActionsOrder, claim);

//     return mutation.complete();

//   }

// }
