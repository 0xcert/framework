import { URLSearchParams } from 'url';
import { Client } from '../client';
import { ClientError } from '../helpers/client-error';
import clientFetch from '../helpers/client-fetch';
import { ClientErrorCode, GetRequestsOptions } from '../types';

/**
 * Requests controller class with requests related actions.
 */
export class RequestsController {

  /**
   * Client's context.
   */
  public context: Client;

  /**
   * Requests controller class constructor.
   * @param context Client context instance.
   */
  public constructor(context: Client) {
    this.context = context;
  }

  /**
   * Returns currently paginated list of requests.
   */
  public async getRequests(options: GetRequestsOptions) {
    if (!this.context.authentication) {
      throw new ClientError(ClientErrorCode.CLIENT_NOT_CONNECTION);
    }

    const params = new URLSearchParams({
      ...options.fromDate ? { fromDate: options.fromDate.toISOString() } : {},
      ...options.toDate ? { toDate: options.toDate.toISOString() } : {},
      ...options.status ? { status: options.status.toString() } : {},
      ...options.methods ? { methods: options.methods } : {},
      ...options.sort ? { sort: options.sort.toString() } : {},
      ...options.skip ? { skip: options.skip.toString() } : { skip: this.context.defaultPagination.skip.toString() },
      ...options.limit ? { limit: options.limit.toString() } : { limit: this.context.defaultPagination.limit.toString() },
    });

    return clientFetch(`${this.context.apiUrl}/requests?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': this.context.authentication,
      },
    });
  }

  /**
   * Returns single request data.
   * @param requestRef Request reference.
   */
  public async getRequest(requestRef: string) {
    if (!this.context.authentication) {
      throw new ClientError(ClientErrorCode.CLIENT_NOT_CONNECTION);
    }

    return clientFetch(`${this.context.apiUrl}/requests/${requestRef}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': this.context.authentication,
      },
    });
  }

}
