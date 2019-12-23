import { URLSearchParams } from 'url';
import { Client } from '../client';
import clientFetch from '../helpers/client-fetch';
import { GetStatsCostsOptions, GetStatsTrafficOptions } from '../types';

/**
 * Stats controller class with stats related actions.
 */
export class StatsController {

  /**
   * Client's context.
   */
  public context: Client;

  /**
   * Stats controller class constructor.
   * @param context Provider instance.
   */
  public constructor(context: Client) {
    this.context = context;
  }

  /**
   * Returns currently authenticated account's traffic stats.
   */
  public async getTrafficStats(options: GetStatsTrafficOptions) {
    if (!this.context.authentication) {
      throw new Error('Client not connected. Please initialize your client first.');
    }

    const params = new URLSearchParams({
      ...options.fromDate ? { fromDate: options.fromDate.toISOString() } : {},
      ...options.toDate ? { toDate: options.toDate.toISOString() } : {},
      ...options.accountId ? { accountId: options.accountId } : {},
      ...options.skip ? { skip: options.skip.toString() } : { skip: this.context.defaultPagination.skip.toString() },
      ...options.limit ? { limit: options.limit.toString() } : { limit: this.context.defaultPagination.limit.toString() },
    });

    return clientFetch(`${this.context.apiUrl}/stats/traffic?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': this.context.authentication,
      },
    });
  }

  /**
   * Returns currently authenticated account's costs stats.
   */
  public async getCostStats(options: GetStatsCostsOptions) {
    if (!this.context.authentication) {
      throw new Error('Client not connected. Please initialize your client first.');
    }

    const params = new URLSearchParams({
      ...options.fromDate ? { fromDate: options.fromDate.toISOString() } : {},
      ...options.toDate ? { toDate: options.toDate.toISOString() } : {},
      ...options.skip ? { skip: options.skip.toString() } : { skip: this.context.defaultPagination.skip.toString() },
      ...options.limit ? { limit: options.limit.toString() } : { limit: this.context.defaultPagination.limit.toString() },
    });

    return clientFetch(`${this.context.apiUrl}/stats/costs?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': this.context.authentication,
      },
    });
  }

}
