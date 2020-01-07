import { URLSearchParams } from 'url';
import { Client } from '../client';
import clientFetch from '../helpers/client-fetch';
import { GetStatsCostsOptions, GetStatsTrafficOptions, GetStatsTickersOptions } from '../types';

/**
 * Deposits controller class with deposits related actions.
 */
export class DepositsController {

  /**
   * Client's context.
   */
  public context: Client;

  /**
   * Deposits controller class constructor.
   * @param context Client context instance.
   */
  public constructor(context: Client) {
    this.context = context;
  }

  /**
   * Creates a stripe deposit intent trough which a credit card deposit resulting in receiving DXC tokens can be made.
   * @param amount Amount of EUR to deposit in cents (e.g. 100 cents = 1€). Minimum amount is 1000 cents (10€). 
   */
  public async createDeposit(amount: number) {
    if (!this.context.authentication) {
      throw new Error('Client not connected. Please initialize your client first.');
    }
  
    return clientFetch(`${this.context.apiUrl}/deposits`, {
      method: 'POST',
      body: JSON.stringify({
        amount
      }),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': this.context.authentication,
      },
    });
  }

}
