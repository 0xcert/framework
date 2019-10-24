pragma solidity 0.5.11;
pragma experimental ABIEncoderV2;

/**
 * @dev Xcert burnable interface.
 */
interface XcertBurnable // is Xcert
{

  /**
   * @dev Enum of available signature kinds.
   * @param eth_sign Signature using eth sign.
   * @param trezor Signature from Trezor hardware wallet.
   * It differs from web3.eth_sign in the encoding of message length
   * (Bitcoin varint encoding vs ascii-decimal, the latter is not
   * self-terminating which leads to ambiguities).
   * See also:
   * https://en.bitcoin.it/wiki/Protocol_documentation#Variable_length_integer
   * https://github.com/trezor/trezor-mcu/blob/master/firmware/ethereum.c#L602
   * https://github.com/trezor/trezor-mcu/blob/master/firmware/crypto.c#L36a
   * @param eip721 Signature using eip721.
   */
  enum SignatureKind
  {
    eth_sign,
    trezor,
    no_prefix
  }

  /**
   * @dev Structure representing the signature parts.
   * @param r ECDSA signature parameter r.
   * @param s ECDSA signature parameter s.
   * @param v ECDSA signature parameter v.
   * @param kind Type of signature.
   */
  struct SignatureData
  {
    bytes32 r;
    bytes32 s;
    uint8 v;
    SignatureKind kind;
  }

  /**
   * @dev Destroys a specified Xcert. Reverts if not called from Xcert owner or operator.
   * @param _tokenId Id of the Xcert we want to destroy.
   */
  function destroy(
    uint256 _tokenId
  )
    external;

  /**
   * @dev Destroys a specified Xcert. Reverts if not called from Xcert owner or operator.
   * @param _destroyer Address that is destroying the token.
   * @param _tokenId Id of the Xcert we want to destroy.
   * @param _feeToken The token then will be tranfered to the executor of this method.
   * @param _feeValue The amount of token then will be tranfered to the executor of this method.
   * @param _seed Arbitrary number to facilitate uniqueness of the order's hash. Usually timestamp.
   * @param _expiration Timestamp of when the claim expires.
   * @param _signature Data from the signature.
   */
  function destroyWithSignature(
    address _destroyer,
    uint256 _tokenId,
    address _feeToken,
    uint256 _feeValue,
    uint256 _seed,
    uint256 _expiration,
    SignatureData calldata _signature
  )
    external;

}