import { TransactionIssue } from "./issues";

/**
 * Handled system error.
 */
export class TransactionError extends Error {
  readonly issue: TransactionIssue;
  readonly original: any;

  /**
   * Class constructor.
   * @param issue Issue identification.
   * @param details Original error object.
   */
  constructor(issue: TransactionIssue, original?: any) {
    super();

    this.name = this.constructor['name'];
    this.issue = issue;
    this.original = original;
    this.message = `Transaction error [issue: ${issue}]`;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
