import { ConnectorError, ConnectorIssue } from '@0xcert/scaffold';
/**
 * Converts web3 error into uified ConnectorError.
 * @param error Error object.
 */
export function parseError(error: any) {
  if (error instanceof ConnectorError) {
    return error;
  }
  else {
    const stringError = String(error);

    // contract(revert) errors
    if(stringError.indexOf('revert') > 0)
    {
      if(stringError.indexOf('003001') > 0
        || stringError.indexOf('004001') > 0
        || stringError.indexOf('005001') > 0
        || stringError.indexOf('006001') > 0
        || stringError.indexOf('018002') > 0)
      {
        return new ConnectorError(ConnectorIssue.ZERO_ADDRESS, error);
      }
      if(stringError.indexOf('003002') > 0
        || stringError.indexOf('004002') > 0
        || stringError.indexOf('005002') > 0
        || stringError.indexOf('006002') > 0
        || stringError.indexOf('010001') > 0)
      {
        return new ConnectorError(ConnectorIssue.INVALID_NFT, error);
      }
      if(stringError.indexOf('003003') > 0
        || stringError.indexOf('003004') > 0
        || stringError.indexOf('004003') > 0
        || stringError.indexOf('004004') > 0
        || stringError.indexOf('005003') > 0
        || stringError.indexOf('005004') > 0
        || stringError.indexOf('006003') > 0
        || stringError.indexOf('006004') > 0
        || stringError.indexOf('008001') > 0
        || stringError.indexOf('017001') > 0
        || stringError.indexOf('018001') > 0
        || stringError.indexOf('019001') > 0)
      {
        return new ConnectorError(ConnectorIssue.NOT_AUTHORIZED, error);
      }
      if(stringError.indexOf('003005') > 0
        || stringError.indexOf('004005') > 0
        || stringError.indexOf('005005') > 0
        || stringError.indexOf('006005') > 0)
      {
        return new ConnectorError(ConnectorIssue.RECEIVER_DOES_NOT_SUPPORT_NFT, error);
      }
      if(stringError.indexOf('003006') > 0
        || stringError.indexOf('004006') > 0
        || stringError.indexOf('005006') > 0
        || stringError.indexOf('006006') > 0)
      {
        return new ConnectorError(ConnectorIssue.NFT_ALREADY_EXISTS, error);
      }
      if(stringError.indexOf('005007') > 0
        || stringError.indexOf('006007') > 0)
      {
        return new ConnectorError(ConnectorIssue.INVALID_INDEX, error);
      }
      if(stringError.indexOf('009001') > 0)
      {
        return new ConnectorError(ConnectorIssue.TRANSFERS_PAUSED, error);
      }
      if(stringError.indexOf('012001') > 0)
      {
        return new ConnectorError(ConnectorIssue.COIN_TRANSFER_FAILED, error);
      }
      if(stringError.indexOf('015001') > 0)
      {
        return new ConnectorError(ConnectorIssue.INVALID_SIGNATURE_KIND, error);
      }
      if(stringError.indexOf('015002') > 0)
      {
        return new ConnectorError(ConnectorIssue.INVALID_PROXY, error);
      }
      if(stringError.indexOf('015003') > 0)
      {
        return new ConnectorError(ConnectorIssue.YOU_ARE_NOT_THE_TAKER, error);
      }
      if(stringError.indexOf('015004') > 0)
      {
        return new ConnectorError(ConnectorIssue.SENDER_NOT_TAKER_OR_MAKER, error);
      }
      if(stringError.indexOf('015005') > 0)
      {
        return new ConnectorError(ConnectorIssue.ORDER_EXPIRED, error);
      }
      if(stringError.indexOf('015006') > 0)
      {
        return new ConnectorError(ConnectorIssue.INVALID_SIGNATURE, error);
      }
      if(stringError.indexOf('015007') > 0)
      {
        return new ConnectorError(ConnectorIssue.ORDER_CANCELED, error);
      }
      if(stringError.indexOf('015008') > 0)
      {
        return new ConnectorError(ConnectorIssue.ORDER_CANNOT_BE_PERFORMED_TWICE, error);
      }
      if(stringError.indexOf('015009') > 0)
      {
        return new ConnectorError(ConnectorIssue.YOU_ARE_NOT_THE_MAKER, error);
      }
      if(stringError.indexOf('015010') > 0)
      {
        return new ConnectorError(ConnectorIssue.SIGNER_NOT_AUTHORIZED, error);
      }
      if(stringError.indexOf('017002') > 0)
      {
        return new ConnectorError(ConnectorIssue.ONE_ZERO_ABILITY_HAS_TO_EXIST, error);
      }
      return new ConnectorError(ConnectorIssue.GENERAL_REVERT, error);
    }
    // node errors
    if(stringError.indexOf('Transaction was not mined within') > 0
      || stringError.indexOf('Invalid JSON RPC response') > 0)
    {
      return new ConnectorError(ConnectorIssue.TRANSATION_RESPONSE_ERROR_CHECK_PENDING_TRANSACTIONS, error);
    }
    if(stringError.indexOf('invalid address') > 0
    || stringError.indexOf('is invalid, the capitalization checksum test failed, or its an indrect IBAN address which') > 0
    || stringError.indexOf('Provided address is not a valid addres') > 0)
    {
      return new ConnectorError(ConnectorIssue.INVALID_ADDRESS, error);
    }
    return new ConnectorError(ConnectorIssue.UNHANDLED, error);
  }
}
