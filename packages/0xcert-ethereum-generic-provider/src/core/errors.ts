import { ProviderError, ProviderIssue } from '@0xcert/scaffold';

/**
 * Converts provider error into unified ProviderError.
 * @param error Error object.
 */
export function parseError(error: any) {

  if (error instanceof ProviderError) {
    return error;
  }
  else {
    return new ProviderError(ProviderIssue.GENERAL, error);
  }
}
