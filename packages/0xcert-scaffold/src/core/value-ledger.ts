import { GatewayBase } from './gateway';
import { MutationBase } from './mutation';

/**
 * Value ledger methods.
 */
export interface ValueLedgerBase {

  /**
   * Value ledger Id. Address pointing at the smartcontract.
   */
  readonly id: string;

  /**
   * Approves another account to operate with a specified amount of value.
   * @param accountId Account id.
   * @param value Value amount.
   */
  approveValue(value: string, accountId: string | GatewayBase): Promise<MutationBase>;

  /**
   * Disapproves account for operating with your value.
   * @param accountId Account id.
   */
  disapproveValue(accountId: string | GatewayBase): Promise<MutationBase>;

  /**
   * Gets the amount of value that another account id approved for.
   * @param accountId Account id.
   * @param spenderId Account if of the spender.
   */
  getApprovedValue(accountId: string, spenderId: string): Promise<String>;

  /**
   * Gets the amount of value a specific account owns.
   * @param accountId Account id.
   */
  getBalance(accountId: string): Promise<string>;

  /**
   * Gets information (name, symbol, total supply, decimals) about the value ledger.
   */
  getInfo(): Promise<ValueLedgerInfo>;

  /**
   * Checks if spender is approved for the specific values.
   * @param accountId Account id.
   * @param spenderId Account id of spender.
   * @param value Value amount we are checking against.
   */
  isApprovedValue(value: string, accountId: string | GatewayBase, spenderId: string): Promise<Boolean>;

  /**
   * Transfer value to another account.
   * @param recipe Data needed for the transfer.
   */
  transferValue(recipe: ValueLedgerTransferRecipe): Promise<MutationBase>;
}

/**
 * Value ledger deploy data definition.
 */
export interface ValueLedgerDeployRecipe {

  /**
   * Value Ledger name.
   */
  name: string;

  /**
   * Value Ledger symbol.
   */
  symbol: string;

  /**
   * Number of decimals the token uses - e.g. 8, means to divide the token amount by 100000000 to get its user representation.
   */
  decimals: string;

  /**
   * Number of total tokens.
   */
  supply: string;
}

/**
 * Value ledger information data definition.
 */
export interface ValueLedgerInfo {

  /**
   * Value Ledger name.
   */
  name: string;

  /**
   * Value Ledger symbol.
   */
  symbol: string;

  /**
   * Number of decimals the token uses - e.g. 8, means to divide the token amount by 100000000 to get its user representation.
   */
  decimals: number;

  /**
   * Number of total tokens.
   */
  supply: string;
}

/**
 * Value transfer data definition.
 */
export interface ValueLedgerTransferRecipe {

  /**
   * Id (address) of the sender.
   */
  senderId?: string;

  /**
   * Id (address) of the receiver.
   */
  receiverId: string;

  /**
   * The amount of value(erc20 tokens).
   */
  value: string;
}
