import { ValueLedgerBase } from '@0xcert/scaffold';
import { GenericProvider } from '@0xcert/ethereum-generic-provider';
import getInfo from '../queries/get-info';
import getSupply from '../queries/get-supply';
import getBalance from '../queries/get-balance';
import approveAccount from '../mutations/approve-account';
import { BN } from '../core/utils';

/**
 * 
 */
export class ValueLedger /*implements ValueLedgerBase*/ {
  protected provider: GenericProvider;
  readonly id: string;

  /**
   * 
   */
  public constructor(provider: GenericProvider, id: string) {
    this.provider = provider;
    this.id = id;
  }

  /**
   * 
   */
  public async getInfo() {
    return getInfo(this.provider, this.id);
  }

  /**
   * 
   */
  public async getSupply() {
    return getSupply(this.provider, this.id);
  }

  /**
   * 
   */
  public async getBalance(accountId: string) {
    return getBalance(this.provider, this.id, accountId);
  }

  /**
   * 
   */
  public async approveAccount(accountId: string, amount: BN) {
    return approveAccount(this.provider, this.id, accountId, amount);
  }
}
