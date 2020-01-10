import { ClientErrorCode } from './types';

/**
 * List of possible client messages.
 */
export default {
  // Client error codes.
  [ClientErrorCode.CLIENT_INITIALIZATION_FAILED]: 'There was an error while initializing client.',
  [ClientErrorCode.CLIENT_NOT_CONNECTION]: 'Client not connected. Please initialize your client first.',
  [ClientErrorCode.PAYER_NOT_SPECIFIED]: 'Payer must be specified if `wildcardSigner` tag is set to false.',
  [ClientErrorCode.PAYER_NOT_LISTED_AS_ORDER_SIGNER]: 'Payer must be listed as order\'s signer.',
  [ClientErrorCode.ORDER_FETCHING_FAILED]: 'There was a problem while fetching order data.',
};
