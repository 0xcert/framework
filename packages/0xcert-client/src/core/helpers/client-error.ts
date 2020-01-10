import messages from '../messages';

/**
 * Client error.
 */
export class ClientError extends Error {

  /**
   * Client error message.
   */
  public message: string;

  /**
   * Client error code.
   */
  public code: number;

  /**
   * Original thrown error.
   */
  public original: any;

  /**
   * Class constructor.
   * @param code Error code.
   * @param original Original error code.
   */
  public constructor(code: number, original?: any) {
    super();

    this.message = messages[code];
    this.code = code;
    this.original = original;

    Error.captureStackTrace(this, this.constructor);
  }
}
