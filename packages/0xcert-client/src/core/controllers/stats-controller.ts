import { URLSearchParams } from 'url';
import { Client } from '../client';
import { ClientError } from '../helpers/client-error';
import clientFetch from '../helpers/client-fetch';
import { ClientErrorCode, GetStatsCostsOptions, GetStatsTickersOptions, GetStatsTrafficOptions } from '../types';

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
   * @param context Client context instance.
   */
  public constructor(context: Client) {
    this.context = context;
  }

  /**
   * Returns currently authenticated account's traffic stats.
   */
  public async getTrafficStats(options: GetStatsTrafficOptions) {
    if (!this.context.authentication) {
      throw new ClientError(ClientErrorCode.CLIENT_NOT_CONNECTION);
    }

    const params = new URLSearchParams({
      ...options.fromDate ? { fromDate: options.fromDate.toISOString() } : {},
      ...options.toDate ? { toDate: options.toDate.toISOString() } : {},
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
      throw new ClientError(ClientErrorCode.CLIENT_NOT_CONNECTION);
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

  /**
   * Returns information about ZXC price.
   */
  public async getTickerStats(options: GetStatsTickersOptions) {
    if (!this.context.authentication) {
      throw new ClientError(ClientErrorCode.CLIENT_NOT_CONNECTION);
    }

    const params = new URLSearchParams({
      ...options.fromDate ? { fromDate: options.fromDate.toISOString() } : {},
      ...options.toDate ? { toDate: options.toDate.toISOString() } : {},
      ...options.filterIds ? { filterIds: options.filterIds } : {},
      ...options.sort ? { sort: options.sort.toString() } : {},
      ...options.skip ? { skip: options.skip.toString() } : { skip: this.context.defaultPagination.skip.toString() },
      ...options.limit ? { limit: options.limit.toString() } : { limit: this.context.defaultPagination.limit.toString() },
    });

    return clientFetch(`${this.context.apiUrl}/stats/tickers?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

}
