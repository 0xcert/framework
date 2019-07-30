import { GenericProvider, Mutation, MutationEventSignature, MutationEventTypeKind } from '@0xcert/ethereum-generic-provider';
import { bigNumberify } from '@0xcert/ethereum-utils';
import { GatewayBase, ProviderError, ProviderIssue, ValueLedgerBase,
  ValueLedgerDeployRecipe, ValueLedgerInfo, ValueLedgerTransferRecipe } from '@0xcert/scaffold';
import approveAccount from '../mutations/approve-account';
import deploy from '../mutations/deploy';
import transfer from '../mutations/transfer';
import transferFrom from '../mutations/transfer-from';
import getAllowance from '../queries/get-allowance';
import getBalance from '../queries/get-balance';
import getInfo from '../queries/get-info';

/**
 * Ethereum value ledger implementation.
 */
export class ValueLedger implements ValueLedgerBase {

  /**
   * Value ledger Id. Address pointing at the smartcontract.
   */
  protected _id: string;

  /**
   * Provider instance.
   */
  protected _provider: GenericProvider;

  /**
   * Deploys a new smart contract representing value ledger to the blockchain.
   * @param provider Provider class with which we comunicate with blockchain.
   * @param recipe Data needed to deploy a new value ledger.
   */
  public static async deploy(provider: GenericProvider, recipe: ValueLedgerDeployRecipe) {
    return deploy(provider, recipe);
  }

  /**
   * Gets an instance of already deployed value ledger.
   * @param provider Provider class with which we comunicate with blockchain.
   * @param id Address of the erc20 smart contract.
   */
  public static getInstance(provider: GenericProvider, id: string): ValueLedger {
    return new this(provider, id);
  }

  /**
   * Initialize value ledger.
   * @param provider Provider class with which we comunicate with blockchain.
   * @param id Address of the erc20 smart contract.
   */
  public constructor(provider: GenericProvider, id: string) {
    this._provider = provider;
    this._id = this._provider.encoder.normalizeAddress(id);
  }

  /**
   * Gets the address of the smart contract that represents this value ledger.
   */
  public get id() {
    return this._id;
  }

  /**
   * Gets the provider that is used to comunicate with blockchain.
   */
  public get provider() {
    return this._provider;
  }

  /**
   * Gets the amount of value that another account id approved for.
   * @param accountId Account id.
   * @param spenderId Account id of the spender.
   */
  public async getApprovedValue(accountId: string, spenderId: string | GatewayBase): Promise<String> {
    if (typeof spenderId !== 'string') {
      spenderId = await (spenderId as any).getProxyAccountId(1);
    }

    accountId = this._provider.encoder.normalizeAddress(accountId);
    spenderId = this._provider.encoder.normalizeAddress(spenderId as string);

    return getAllowance(this, accountId, spenderId);
  }

  /**
   * Gets the amount of value a specific account owns.
   * @param accountId Account id.
   */
  public async getBalance(accountId: string): Promise<string> {
    accountId = this._provider.encoder.normalizeAddress(accountId);

    return getBalance(this, accountId);
  }

  /**
   * Gets information(name, symbol, total supply, decimals) about the value ledger.
   */
  public async getInfo(): Promise<ValueLedgerInfo> {
    return getInfo(this);
  }

  /**
   * Checks if spender is approved for the specific values.
   * @param accountId Account id.
   * @param spenderId Account id of spender.
   * @param value Value amount we are checking against.
   */
  public async isApprovedValue(value: string, accountId: string, spenderId: string | GatewayBase): Promise<Boolean> {
    if (typeof spenderId !== 'string') {
      spenderId = await (spenderId as any).getProxyAccountId(1);
    }

    accountId = this._provider.encoder.normalizeAddress(accountId);
    spenderId = this._provider.encoder.normalizeAddress(spenderId as string);

    const approved = await getAllowance(this, accountId, spenderId);
    return bigNumberify(approved).gte(bigNumberify(value));
  }

  /**
   * Approves another account to operate with a specified amount of value.
   * @param accountId Account id.
   * @param value Value amount.
   */
  public async approveValue(value: string, accountId: string | GatewayBase): Promise<Mutation> {
    if (typeof accountId !== 'string') {
      accountId = await (accountId as any).getProxyAccountId(1);
    }

    accountId = this._provider.encoder.normalizeAddress(accountId as string);

    const approvedValue = await this.getApprovedValue(this.provider.accountId, accountId);
    if (!bigNumberify(value).isZero() && !bigNumberify(approvedValue).isZero()) {
      throw new ProviderError(ProviderIssue.GENERAL, 'First set approval to 0. ERC20 token potential attack.');
    }

    return approveAccount(this, accountId, value);
  }

  /**
   * Disapproves account for operating with your value.
   * @param accountId Account id.
   */
  public async disapproveValue(accountId: string | GatewayBase): Promise<Mutation> {
    if (typeof accountId !== 'string') {
      accountId = await (accountId as any).getProxyAccountId(1);
    }

    accountId = this._provider.encoder.normalizeAddress(accountId as string);

    return approveAccount(this, accountId, '0');
  }

  /**
   * Transfer value to another account.
   * @param recipe Data needed for the transfer.
   */
  public async transferValue(recipe: ValueLedgerTransferRecipe): Promise<Mutation> {
    const senderId = this._provider.encoder.normalizeAddress(recipe.senderId);
    const receiverId = this._provider.encoder.normalizeAddress(recipe.receiverId);

    return recipe.senderId
      ? transferFrom(this, senderId, receiverId, recipe.value)
      : transfer(this, receiverId, recipe.value);
  }

  /**
   * Gets context for mutation event parsing.
   * This are event definitions for Value Ledger smart contract event parsing. This method is used
   * by the Mutation class to provide log information.
   */
  public getContext(): MutationEventSignature[] {
    return [
      {
        name: 'Transfer',
        topic: '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
        types: [
          {
            kind: MutationEventTypeKind.INDEXED,
            name: 'from',
            type: 'address',
          },
          {
            kind: MutationEventTypeKind.INDEXED,
            name: 'to',
            type: 'address',
          },
          {
            kind: MutationEventTypeKind.NORMAL,
            name: 'value',
            type: 'uint256',
          },
        ],
      },
      {
        name: 'Approval',
        topic: '0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925',
        types: [
          {
            kind: MutationEventTypeKind.INDEXED,
            name: 'owner',
            type: 'address',
          },
          {
            kind: MutationEventTypeKind.INDEXED,
            name: 'spender',
            type: 'address',
          },
          {
            kind: MutationEventTypeKind.NORMAL,
            name: 'value',
            type: 'uint256',
          },
        ],
      },
    ];
  }
}
