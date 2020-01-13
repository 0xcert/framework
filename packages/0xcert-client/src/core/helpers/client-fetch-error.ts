/**
 * Client fetch error.
 */
export class ClientFetchError extends Error {

  /**
   * Error result of client fetch operation.
   */
  public result: any;

  /**
   * Error status code of client fetch operation.
   */
  public status: number;

  /**
   * Class constructor.
   * @param result Error result.
   * @param status Error status.
   */
  public constructor(result: any, status: number) {
    super();

    this.result = result;
    this.status = status;

    Error.captureStackTrace(this, this.constructor);
  }
}
