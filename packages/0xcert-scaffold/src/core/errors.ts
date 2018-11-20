/**
 * Error codes.
 */
export enum ConnectorIssue {
  UNHANDLED = 0,
  GENERAL_REVERT = 1,
  SIGNATURE_UNKNOWN = 9000,
  SIGNATURE_FAILED = 9001,
  INVALID_MAKER_ID = 8000,
  ZERO_ADDRESS = 1001,
  INVALID_NFT = 1002,
  NOT_AUTHORIZED = 1003,
  RECEIVER_DOES_NOT_SUPPORT_NFT = 1004,
  NFT_ALREADY_EXISTS = 1005,
  INVALID_INDEX = 1006,
  TRANSFERS_PAUSED = 1007,
  COIN_TRANSFER_FAILED = 1008,
  INVALID_SIGNATURE_KIND = 1009,
  INVALID_PROXY = 1010,
  YOU_ARE_NOT_THE_TAKER = 1011,
  SENDER_NOT_TAKER_OR_MAKER = 1012,
  ORDER_EXPIRED = 1013,
  INVALID_SIGNATURE = 1014,
  ORDER_CANCELED = 1015,
  ORDER_CANNOT_BE_PERFORMED_TWICE = 1016,
  YOU_ARE_NOT_THE_MAKER = 1017,
  SIGNER_NOT_AUTHORIZED = 1018,
  ONE_ZERO_ABILITY_HAS_TO_EXIST = 1019,
  TRANSATION_RESPONSE_ERROR_CHECK_PENDING_TRANSACTIONS = 2001,
  INVALID_ADDRESS = 2002,

}

/**
 * Handled system error.
 */
export class ConnectorError extends Error {
  readonly issue: ConnectorIssue;
  readonly original: any;

  /**
   * Class constructor.
   * @param issue Issue identification.
   * @param details Original error object.
   */
  constructor(issue: ConnectorIssue, original?: any) {
    super();

    this.name = 'ConnectorError';
    this.issue = issue;
    this.original = original;
    this.message = `Connector error [issue: ${issue}]`;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
