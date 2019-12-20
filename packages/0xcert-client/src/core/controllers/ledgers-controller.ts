import clientFetch from '../helpers/client-fetch';
import { Client } from '../client';
import { GetLedgersOptions, GetLedgersAccountsOptions, GetLedgersAbilitiesOptions, GetLedgersAssetsOptions } from '../types';
import { URLSearchParams } from 'url';

/**
 * Ledgers controller class with ledgers related actions.
 */
export class LedgersController {

  /**
   * Client's context.
   */
  public context: Client;

  /**
   * Ledgers controller class constructor.
   * @param context Provider instance.
   */
  constructor(context: Client) {
    this.context = context;
  }

  /**
   * Returns specific ledger data.
   * @param ledgerRef Ledger reference.
   */
  public async getLedger(ledgerRef: string) {
    if (!this.context.authentication) {
      throw new Error('Client not connected. Please initialize your client first.');
    }

    return clientFetch(`${this.context.apiUrl}/ledgers/${ledgerRef}`, {
      method: 'GET',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': this.context.authentication,
      },
    });
  }

  /**
   * Returns ledgers data.
   */
  public async getLedgers(options: GetLedgersOptions) {
    if (!this.context.authentication) {
      throw new Error('Client not connected. Please initialize your client first.');
    }

    const params = new URLSearchParams({
      ...options.skip ? { skip: options.skip.toString() } : { skip: this.context.defaultPagination.skip.toString() },
      ...options.limit ? { limit: options.limit.toString() } : { limit: this.context.defaultPagination.limit.toString() },
    });

    return clientFetch(`${this.context.apiUrl}/ledgers?${params.toString()}`, {
      method: 'GET',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': this.context.authentication,
      },
    });
  }


  /**
   * Returns specific ledger's account.
   * @param ledgerRef Ledger reference.
   */
  public async getLedgerAccounts(ledgerRef: string, options: GetLedgersAccountsOptions) {
    if (!this.context.authentication) {
      throw new Error('Client not connected. Please initialize your client first.');
    }

    const params = new URLSearchParams({
      ...options.skip ? { skip: options.skip.toString() } : { skip: this.context.defaultPagination.skip.toString() },
      ...options.limit ? { limit: options.limit.toString() } : { limit: this.context.defaultPagination.limit.toString() },
      ...options.filterAccountIds ? { filterAccountIds: options.filterAccountIds } : {},
    });

    return clientFetch(`${this.context.apiUrl}/ledgers/${ledgerRef}/accounts?${params.toString()}`, {
      method: 'GET',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': this.context.authentication,
      },
    });
  }

  /**
   * Returns specific ledger's abilities.
   * @param ledgerRef Ledger reference.
   */
  public async getLedgerAbilities(ledgerRef: string, options: GetLedgersAbilitiesOptions) {
    if (!this.context.authentication) {
      throw new Error('Client not connected. Please initialize your client first.');
    }

    const params = new URLSearchParams({
      ...options.skip ? { skip: options.skip.toString() } : { skip: this.context.defaultPagination.skip.toString() },
      ...options.limit ? { limit: options.limit.toString() } : { limit: this.context.defaultPagination.limit.toString() },
      ...options.filterAccountIds ? { filterAccountIds: options.filterAccountIds } : {},
    });

    return clientFetch(`${this.context.apiUrl}/ledgers/${ledgerRef}/abilities?${params.toString()}`, {
      method: 'GET',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': this.context.authentication,
      },
    });
  }

  /**
   * Returns specific ledger's assets.
   * @param ledgerRef Ledger reference.
   */
  public async getLedgerAssets(ledgerRef: string, options: GetLedgersAssetsOptions) {
    if (!this.context.authentication) {
      throw new Error('Client not connected. Please initialize your client first.');
    }

    const params = new URLSearchParams({
      ...options.skip ? { skip: options.skip.toString() } : { skip: this.context.defaultPagination.skip.toString() },
      ...options.limit ? { limit: options.limit.toString() } : { limit: this.context.defaultPagination.limit.toString() },
      ...options.filterIds ? { filterIds: options.filterIds } : {},
      ...options.sort ? { sort: options.sort.toString() } : {},
      ...options.ledgerRef ? { ledgerRef: options.ledgerRef } : {},
    });

    return clientFetch(`${this.context.apiUrl}/ledgers/${ledgerRef}/assets?${params.toString()}`, {
      method: 'GET',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': this.context.authentication,
      },
    });
  }

  /**
   * Returns specific ledger's asset.
   * @param ledgerRef Ledger reference.
   */
  public async getLedgerAsset(ledgerRef: string, assetId: string) {
    if (!this.context.authentication) {
      throw new Error('Client not connected. Please initialize your client first.');
    }

    return clientFetch(`${this.context.apiUrl}/ledgers/${ledgerRef}/assets/${assetId}`, {
      method: 'GET',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': this.context.authentication,
      },
    });
  }

}
