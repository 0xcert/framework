import { ConnectorError, ConnectorIssue } from '@0xcert/scaffold';

/**
 * Converts web3 error into uified ConnectorError.
 * @param error Error object.
 */
export function parseError(error: any) {
  if (error instanceof ConnectorError) {
    return error;
  } else {
    return new ConnectorError(ConnectorIssue.UNHANDLED, error);
  }
}
