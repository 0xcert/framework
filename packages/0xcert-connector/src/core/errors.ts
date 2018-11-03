/**
 * Error codes.
 */
export enum ConnectorIssue {
  UNHANDLED = 0,
  SIGNATURE_FAILED = 9000,
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
