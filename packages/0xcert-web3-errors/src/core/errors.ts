import { ConnectorError, ConnectorIssue } from '@0xcert/connector';

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
