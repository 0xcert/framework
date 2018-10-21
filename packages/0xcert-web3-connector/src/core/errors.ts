import { ConnectorError } from '@0xcert/connector';

/**
 * Converts Web3 error into unified ConnectorError defined by the framework.
 * @param error Error object.
 */
export function parseError(error: any) {
  return new ConnectorError(1, error);
}
