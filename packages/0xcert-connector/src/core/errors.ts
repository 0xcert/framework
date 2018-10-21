/**
 * Error codes.
 */
export enum ErrorKind {
  MANAGE_ABILITIES = 0,
  NETWORK_UNREACHED = 1,
}

/**
 * Handled system error.
 */
export class ConnectorError extends Error {
  readonly kind: ErrorKind;
  readonly original: any;
  readonly status: number;

  /**
   * Class constructor.
   * @param kind Connector error kind.
   * @param details Original error object.
   */
  constructor(kind: ErrorKind, original?: any) {
    super();

    this.name = this.constructor['name'];
    this.kind = kind;
    this.original = original;
    this.message = 'Connection error';
    this.status = 500;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
