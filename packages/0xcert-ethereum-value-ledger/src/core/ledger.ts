import { GenericProvider, Mutation } from '@0xcert/ethereum-generic-provider';
import { normalizeAddress } from '@0xcert/ethereum-utils';
import { ValueLedgerBase, ValueLedgerDeployRecipe, ValueLedgerInfo } from "@0xcert/scaffold";
import deploy from '../mutations/deploy';
import getBalance from '../queries/get-balance';
import getInfo from '../queries/get-info';
import approveAccount from '../mutations/approve-account';

/**
 * 
 */
export class ValueLedger implements ValueLedgerBase {
  protected $id: string;
  protected $provider: GenericProvider;

  /**
   * 
   */
  public constructor(provider: GenericProvider, id: string) {
    this.$id = id;
    this.$provider = provider;
  }

  /**
   * 
   */
  public get id() {
    return this.$id;
  }

  /**
   * 
   */
  public get provider() {
    return this.$provider;
  }

  /**
   * 
   */
  public static async deploy(provider: GenericProvider, recipe: ValueLedgerDeployRecipe): Promise<Mutation> {
    return deploy(provider, recipe);
  }

  /**
   * 
   */
  public static getInstance(provider: GenericProvider, id: string): ValueLedger {
    return new ValueLedger(provider, id);
  }

  /**
   * 
   */
  public async getBalance(accountId: string): Promise<string> {
    return getBalance(this, accountId);
  }

  /**
   * 
   */
  public async getInfo(): Promise<ValueLedgerInfo> {
    return getInfo(this);
  }

  /**
   * 
   */
  public async approveAccount(accountId: string, value: string): Promise<Mutation> {
    return approveAccount(this, accountId, value);
  }

}
