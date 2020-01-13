import { Client } from '../client';
import { ClientError } from '../helpers/client-error';
import clientFetch from '../helpers/client-fetch';
import { AccountInformation, ClientErrorCode, WebhookEventKind } from '../types';

/**
 * Accounts controller class with accounts related actions.
 */
export class AccountsController {

  /**
   * Client's context.
   */
  public context: Client;

  /**
   * Accounts controller class constructor.
   * @param context Client context instance.
   */
  public constructor(context: Client) {
    this.context = context;
  }

  /**
   * Returns currently authenticated account's information.
   */
  public async getAccount() {
    if (!this.context.authentication) {
      throw new ClientError(ClientErrorCode.CLIENT_NOT_CONNECTION);
    }

    return clientFetch(`${this.context.apiUrl}/account`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': this.context.authentication,
      },
    });
  }

  /**
   * Returns a list of current authenticated account's ledger abilities.
   */
  public async getAccountAbilities() {
    if (!this.context.authentication) {
      throw new ClientError(ClientErrorCode.CLIENT_NOT_CONNECTION);
    }

    return clientFetch(`${this.context.apiUrl}/account/abilities`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': this.context.authentication,
      },
    });
  }

  /**
   * Returns currently authenticated account's webhook.
   */
  public async getAccountWebhook() {
    if (!this.context.authentication) {
      throw new ClientError(ClientErrorCode.CLIENT_NOT_CONNECTION);
    }

    return clientFetch(`${this.context.apiUrl}/account/webhook`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': this.context.authentication,
      },
    });
  }

  /**
   * Updates currently authenticated account's webhook.
   * @param url Webhook url.
   * @param events List of webhook event.
   */
  public async updateAccountWebhook(url: string, events: WebhookEventKind[]) {
    if (!this.context.authentication) {
      throw new ClientError(ClientErrorCode.CLIENT_NOT_CONNECTION);
    }

    return clientFetch(`${this.context.apiUrl}/account/webhook`, {
      method: 'PUT',
      body: JSON.stringify({
        url,
        events,
      }),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': this.context.authentication,
      },
    });
  }

  /**
   * Updates currently authenticated account's information.
   * @param accountInformation Account's information.
   */
  public async updateAccountInformation(accountInformation: AccountInformation) {
    if (!this.context.authentication) {
      throw new ClientError(ClientErrorCode.CLIENT_NOT_CONNECTION);
    }

    return clientFetch(`${this.context.apiUrl}/account`, {
      method: 'PUT',
      body: JSON.stringify({
        ...accountInformation,
      }),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': this.context.authentication,
      },
    });
  }

}
