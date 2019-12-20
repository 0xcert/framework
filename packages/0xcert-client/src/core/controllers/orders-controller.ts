import BigNumber from 'bignumber.js';
import clientFetch from '../helpers/client-fetch';
import { Priority, ActionsOrder, ActionKind, Signer, GetOrdersOptions } from '../types';
import { Gateway, ActionsOrder as FrameworkActionsOrder, ActionsOrderAction as FrameworkActionsOrderAction, ActionsOrderActionKind, OrderKind } from '@0xcert/ethereum-gateway';
import { Client } from '../client';
import { URLSearchParams } from 'url';

/**
 * Orders controller class with orders related actions.
 */
export class OrdersController {
  
  /**
   * Client's context.
   */
  public context: Client;

  /**
   * Orders controller class constructor.
   * @param context Provider instance.
   */
  constructor(context: Client) {
    this.context = context;
  }

  /**
   * Returns paginated list of orders.
   * @param pagination Listing pagination configuration.
   */
  public async getOrders(options: GetOrdersOptions) {
    if (!this.context.authentication) {
      throw new Error('Client not connected. Please initialize your client first.');
    }

    const params = new URLSearchParams({
      ...options.filterIds ? { filterIds: options.filterIds } : {},
      ...options.statuses ? { statuses: options.statuses.map((s) => s.toString()) } : {},
      ...options.sort ? { sort: options.sort.toString() } : {},
      ...options.skip ? { skip: options.skip.toString() } : { skip: this.context.defaultPagination.skip.toString() },
      ...options.limit ? { limit: options.limit.toString() } : { limit: this.context.defaultPagination.limit.toString() },
    });

    return clientFetch(`${this.context.apiUrl}/orders?${params.toString()}`, {
      method: 'GET',
      query: {},
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': this.context.authentication,
      },
    });
  }

  /**
   * Returns single order data.
   * @param orderRef Order reference.
   */
  public async getOrder(orderRef: string) {
    if (!this.context.authentication) {
      throw new Error('Client not connected. Please initialize your client first.');
    }

    return clientFetch(`${this.context.apiUrl}/orders/${orderRef}`, {
      method: 'GET',
      query: {},
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': this.context.authentication,
      },
    });
  }

  /**
   * Creates new actions order.
   * @param order Actions order to create.
   * @param priority Priority for this deploy to perform.
   */
  public async createOrder(order: ActionsOrder, priority: Priority) {
    if (!this.context.authentication) {
      throw new Error('Client not connected. Please initialize your client first.');
    }
    const orderGateway = new Gateway(this.context.provider);

    // Set order's payer.
    if (!order.payerId && !order.wildcardSigner) {
      throw new Error('Payer must be specified if `wildcardSigner` tag is set to false.');
    }

    // Checks if payer id is order's signer.
    if (order.payerId) {
      const isPayerSigner = order.signersIds.find((s) => s.toLowerCase() === order.payerId.toLowerCase());
      if (!isPayerSigner) {
        throw new Error('Payer must be listed as order\'s signer.');
      }
    }

    const multiplier = new BigNumber(1000000000000000000);
    const orderActions : FrameworkActionsOrderAction[] = [];
    const date = Date.now();
    let paymentAmount = 0;

    for (let i = 0; i < order.actions.length; i++) {
      const action = order.actions[i];
      switch (action.kind) {
        case (ActionKind.CREATE_ASSET): {
          orderActions.push({
            kind: ActionsOrderActionKind.CREATE_ASSET,
            senderId: action.senderId,
            receiverId: action.receiverId,
            assetId: action.id,
            assetImprint: action.imprint,
            ledgerId: action.assetLedgerId
          } as FrameworkActionsOrderAction);
          paymentAmount += this.context.payment.assetCreateCost;
          break;
        }
        case (ActionKind.TRANSFER_ASSET): {
          orderActions.push({
            kind: ActionsOrderActionKind.TRANSFER_ASSET,
            receiverId: action.receiverId,
            assetId: action.id,
            ledgerId: action.assetLedgerId,
            senderId: action.senderId,
          } as FrameworkActionsOrderAction);
          paymentAmount += this.context.payment.assetTransferCost;
          break;
        }
        case (ActionKind.TRANSFER_VALUE): {
          orderActions.push({
            kind: ActionsOrderActionKind.TRANSFER_VALUE,
            senderId: action.senderId,
            receiverId: action.receiverId,
            value: new BigNumber(action.value).multipliedBy(multiplier).toFixed(0),
            ledgerId: action.valueLedgerId,
          } as FrameworkActionsOrderAction);
          paymentAmount += this.context.payment.valueTransferCost;
          break;
        }
        case (ActionKind.SET_ABILITIES): {
          orderActions.push({
            kind: ActionsOrderActionKind.SET_ABILITIES,
            receiverId: action.receiverId,
            senderId: action.senderId,
            ledgerId: action.assetLedgerId,
            abilities: action.abilities,
          } as FrameworkActionsOrderAction);
          paymentAmount += this.context.payment.setAbilitiesCost;
          break;
        }
        case (ActionKind.DESTROY_ASSET): {
          orderActions.push({
            kind: ActionsOrderActionKind.DESTROY_ASSET,
            senderId: action.senderId,
            ledgerId: action.assetLedgerId,
            assetId: action.id,
          } as FrameworkActionsOrderAction);
          paymentAmount += this.context.payment.assetDestroyCost;
          break;
        }
        default: {
          break;
        }
      }
    }

    // Add order payment action.
    const value = new BigNumber(paymentAmount).multipliedBy(multiplier);
    const expiration = Date.now() + 172800000; // 2 days

    orderActions.push({
      kind: ActionsOrderActionKind.TRANSFER_VALUE,
      senderId: order.payerId,
      receiverId: this.context.payment.receiverAddress,
      value: value.toFixed(0),
      ledgerId: this.context.payment.tokenAddress,
    } as FrameworkActionsOrderAction);

    // Parse signers into valid API structure.
    const signers: Signer[] = order.signersIds.map((s) => { return { accountId: s, claim: ''} });

    // Check if account is specified as signer and generate its claim.
    const accountSignerIndex = signers.findIndex((s) => s.accountId.toLowerCase() === this.context.provider.accountId.toLowerCase());
    if (accountSignerIndex !== -1) {
      const claimOrder = {
        kind: order.wildcardSigner ? OrderKind.SIGNED_DYNAMIC_ACTIONS_ORDER : OrderKind.SIGNED_FIXED_ACTIONS_ORDER,
        seed: date,
        signers: order.signersIds,
        expiration,
        actions: orderActions,
      } as FrameworkActionsOrder;

      signers[accountSignerIndex].claim = await orderGateway.sign(claimOrder);
    }

    return clientFetch(`${this.context.apiUrl}/orders`, {
      method: 'POST',
      body: JSON.stringify({
        priority,
        order: {
          seed: date,
          signers: signers,
          expiration,
          actions: orderActions,
        },
        automatedPerform: order.automatedPerform,
        wildcardSigner: order.wildcardSigner,
      }),
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': this.context.authentication,
      },
    });
  }

  /**
   * Signs existing actions order.
   * @param orderRef Order reference.
   */
  public async signOrder(orderRef: string) {
    if (!this.context.authentication) {
      throw new Error('Client not connected. Please initialize your client first.');
    }
    
    let order = null;
    try {
      const orderData = await clientFetch(`${this.context.apiUrl}/orders/${orderRef}`, {
        method: 'GET',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': this.context.authentication,
        },
      });
      order = orderData.data;
    } catch (error) {
      throw new Error('There was a problem while fetching order data.');
    }

    if(!order) {
      throw new Error('Order doesn\'t. exists');
    }

    const claimOrder = {
      kind: order.wildcardSigner ? OrderKind.SIGNED_DYNAMIC_ACTIONS_ORDER : OrderKind.SIGNED_FIXED_ACTIONS_ORDER,
      seed: order.order.seed,
      signers: order.order.signers.map((s: Signer) => s.accountId),
      expiration: order.order.expiration,
      actions: order.order.actions,
    } as FrameworkActionsOrder;

    const orderGateway = new Gateway(this.context.provider);
    const claim = await orderGateway.sign(claimOrder);

    return clientFetch(`${this.context.apiUrl}/orders/${orderRef}/sign`, {
      method: 'PUT',
      body: JSON.stringify({
        claim,
      }),
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': this.context.authentication,
      },
    });
  }

  /**
   * Performs existing actions order.
   * @param orderRef Order reference.
   */
  public async performOrder(orderRef: string) {
    if (!this.context.authentication) {
      throw new Error('Client not connected. Please initialize your client first.');
    }
    
    return clientFetch(`${this.context.apiUrl}/orders/${orderRef}/perform`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': this.context.authentication,
      },
    });
  }

  /**
   * Cancel existing actions order.
   * @param orderRef Order reference.
   */
  public async cancelOrder(orderRef: string) {
    if (!this.context.authentication) {
      throw new Error('Client not connected. Please initialize your client first.');
    }
    
    return clientFetch(`${this.context.apiUrl}/orders/${orderRef}`, {
      method: 'DELETE',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': this.context.authentication,
      },
    });
  }

}
