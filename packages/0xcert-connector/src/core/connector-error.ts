import { ErrorCode } from "./error-code";

/**
 * Handled system error.
 */
export class ConnectorError extends Error {
  readonly code: ErrorCode;
  readonly original: any;

  /**
   * Class constructor.
   * @param code Connector error kind.
   * @param details Original error object.
   */
  constructor(code: ErrorCode, original?: any) {
    super();

    this.name = this.constructor['name'];
    this.code = code;
    this.original = original;
    this.message = `Connector error [${code}]`;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
