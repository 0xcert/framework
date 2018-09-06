pragma solidity ^0.4.24;
pragma experimental ABIEncoderV2;

import "@0xcert/ethereum-xcert/contracts/tokens/Xcert.sol";
import "@0xcert/web3-erc20/src/contracts/ERC20.sol";
import "@0xcert/web3-proxy/src/contracts/token-transfer-proxy.sol";
import "@0xcert/web3-proxy/src/contracts/xcert-mint-proxy.sol";

/**
 @dev Contract for decetralized minting of NFTs. 
 */
contract Minter
{
  /**
   * @dev Error constants.
   */
  string constant INVALID_TOKEN_TRANSFER_PROXY = "1001";
  string constant INVALID_XCERT_MINT_PROXY = "1002";
  string constant INVALID_SIGNATURE_KIND = "1003";

  string constant TAKER_NOT_EQUAL_TO_SENDER = "2001";
  string constant TAKER_EQUAL_TO_OWNER = "2002";
  string constant CLAIM_EXPIRED = "2003";
  string constant INVALID_SIGNATURE = "2004";
  string constant MINT_CANCELED = "2005";
  string constant MINT_ALREADY_PERFORMED = "2006";
  string constant ERC20_TRANSFER_FAILED = "2007";
  string constant OWNER_NOT_EQUAL_TO_SENDER = "2008";

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
   * https://github.com/trezor/trezor-mcu/blob/master/firmware/crypto.c#L36 
   * @param eip721 Signature using eip721.
   */
  enum SignatureKind
  {
    eth_sign,
    trezor,
    eip712
  }

  /** 
   * @dev contract addresses
   */
  address public xcertMintProxy;
  address public tokenTransferProxy;

  /** 
   * @dev Mapping of all canceled mints.
   */
  mapping(bytes32 => bool) public mintCancelled;

  /** 
   * @dev Mapping of all performed mints.
   */
  mapping(bytes32 => bool) public mintPerformed;

  /**
   * @dev Structure of Xcert data.
   * @param xcert Contract address.
   * @param id The NFT to be minted.
   * @param uri An URI pointing to NFT metadata.
   * @param proof Cryptographic asset imprint.
   * @param config Array of protocol config values where 0 index represents token expiration
   * timestamp, other indexes are not yet definied but are ready for future xcert upgrades.
   * @param data Array of convention data values.
   */
  struct XcertData{
    address xcert;
    uint256 id;
    string uri;
    string proof;
    bytes32[] config;
    bytes32[] data;
  }

  /**
   * @dev Struture of fee data.
   * @param token Address of ERC20 contract.
   * @param to Fee recipient.
   * @param amount Amount of tokens to be sent.
   */
  struct Fee{
    address token;
    address to;
    uint256 amount;
  }

  /** 
   * @dev Structure of data needed for mint.
   * @param to Address to which a new Xcert will be minted.
   * @param xcertData Data needed to mint a new xcert.
   * @param fees An array of fees to be paid.
   * @param seed Arbitrary number to facilitate uniqueness of the order's hash. Usually timestamp.
   * @param expiration Timestamp of when the claim expires. 0 if indefinet. 
   */
  struct MintData{
    address to;
    XcertData xcertData;
    Fee[] fees;
    uint256 seed;
    uint256 expirationTimestamp;
  }

  /**
   * @dev Structure representing the signature parts.
   * @param r ECDSA signature parameter r.
   * @param s ECDSA signature parameter s.
   * @param v ECDSA signature parameter v.
   * @param kind Type of signature. 
   */
  struct SignatureData{
    bytes32 r;
    bytes32 s;
    uint8 v;
    SignatureKind kind;
  }

  /** 
   * @dev This event emmits when xcert gets mint directly to the taker.
   * @param _to Address of the xcert recipient.
   * @param _xcert Address of the xcert contract.
   * @param _xcertMintClaim Claim of the mint.
   */
  event PerformMint(
    address _to,
    address indexed _xcert,
    bytes32 _xcertMintClaim
  );

  /** 
   * @dev This event emmits when xcert mint order is canceled.
   * @param _to Address of the xcert recipient.
   * @param _xcert Address of the xcert contract.
   * @param _xcertMintClaim Claim of the mint.
   */
  event CancelMint(
    address _to,
    address indexed _xcert,
    bytes32 _xcertMintClaim
  );

  /**
   * @dev Sets XCT token address, Token proxy address and xcert Proxy address.
   * @param _tokenTransferProxy Address pointing to TokenTransferProxy contract.
   * @param _xcertMintProxy Address pointing to XcertProxy contract.
   */
  constructor(
    address _tokenTransferProxy,
    address _xcertMintProxy
  )
    public
  {
    require(_tokenTransferProxy != address(0), INVALID_TOKEN_TRANSFER_PROXY);
    require(_xcertMintProxy != address(0), INVALID_XCERT_MINT_PROXY);

    tokenTransferProxy = _tokenTransferProxy;
    xcertMintProxy = _xcertMintProxy;
  }

  /**
   * @dev Performs Xcert mint directly to the taker.
   * @param _mintData Data needed for minting.
   * @param _signatureData Data of the signed claim.
   */
  function performMint(
    MintData _mintData,
    SignatureData _signatureData
  )
    public
  {
    bytes32 claim = getMintDataClaim(_mintData);
    address owner = _getOwner(_mintData.xcertData.xcert);

    require(_mintData.to == msg.sender, TAKER_NOT_EQUAL_TO_SENDER);
    require(owner != _mintData.to, TAKER_EQUAL_TO_OWNER);
    require(_mintData.expirationTimestamp >= now, CLAIM_EXPIRED);

    require(
      isValidSignature(
        owner,
        claim,
        _signatureData
      ),
      INVALID_SIGNATURE
    );

    require(!mintPerformed[claim], MINT_ALREADY_PERFORMED);
    require(!mintCancelled[claim], MINT_CANCELED);

    mintPerformed[claim] = true;

    _mintViaXcertMintProxy(_mintData.xcertData, _mintData.to);

    _payfeeAmounts(_mintData.fees, _mintData.to);

    emit PerformMint(
      _mintData.to,
      _mintData.xcertData.xcert,
      claim
    );
  }

  /**
   * @dev Cancels xcert mint.
   * @param _mintData Data needed for minting.
   * @param _xcertData Data needed for minting a new Xcert.
   */
  function cancelMint(
    MintData _mintData,
    XcertData _xcertData
  )
    public
  {
    address owner = _getOwner(_xcertData.xcert);
    require(msg.sender == owner, OWNER_NOT_EQUAL_TO_SENDER);

    bytes32 claim = getMintDataClaim(_mintData);

    require(!mintPerformed[claim], MINT_ALREADY_PERFORMED);

    mintCancelled[claim] = true;

    emit CancelMint(
      _mintData.to,
      _xcertData.xcert,
      claim
    );
  }

  /**
   * @dev Calculates keccak-256 hash of mint data from parameters.
   * @param _mintData Data needed for minting trough minter.
   * @return keccak-hash of mint data.
   */
  function getMintDataClaim(
    MintData _mintData
  )
    public
    view
    returns (bytes32)
  {
    bytes32 temp = 0x0;

    for(uint256 i = 0; i < _mintData.fees.length; i++)
    {
      temp = keccak256(
        abi.encodePacked(
          temp,
          _mintData.fees[i].token,
          _mintData.fees[i].to,
          _mintData.fees[i].amount
        )
      );
    }

    return keccak256(
      abi.encodePacked(
        address(this),
        _mintData.to,
        _mintData.xcertData.xcert,
        _mintData.xcertData.id,
        _mintData.xcertData.proof,
        _mintData.xcertData.uri,
        _mintData.xcertData.config,
        _mintData.xcertData.data,
        temp,
        _mintData.seed,
        _mintData.expirationTimestamp
      )
    );
  }

  /**
   * @dev Verifies if claim signature is valid.
   * @param _signer address of signer.
   * @param _claim Signed Keccak-256 hash.
   * @param _signature Signature data.
   * @return Validity of signature.
   */
  function isValidSignature(
    address _signer,
    bytes32 _claim,
    SignatureData _signature
  )
    public
    pure
    returns (bool)
  {
    if(_signature.kind == SignatureKind.eth_sign)
    {
      return _signer == ecrecover(
        keccak256(
          abi.encodePacked(
            "\x19Ethereum Signed Message:\n32",
            _claim
          )
        ),
        _signature.v,
        _signature.r,
        _signature.s
      );
    } else if (_signature.kind == SignatureKind.trezor)
    {
      return _signer == ecrecover(
        keccak256(
          abi.encodePacked(
            "\x19Ethereum Signed Message:\n\x20",
            _claim
          )
        ),
        _signature.v,
        _signature.r,
        _signature.s
      );
    } else if (_signature.kind == SignatureKind.eip712)
    {
      return _signer == ecrecover(
        _claim,
        _signature.v,
        _signature.r,
        _signature.s
      );
    }

    revert(INVALID_SIGNATURE_KIND);
  }

  /** 
   * @dev Transfers ERC20 tokens via TokenTransferProxy using transferFrom function.
   * @param _token Address of token to transferFrom.
   * @param _from Address transfering token.
   * @param _to Address receiving token.
   * @param _value Amount of token to transfer.
   * @return Success of token transfer.
   */
  function _transferViaTokenTransferProxy(
    address _token,
    address _from,
    address _to,
    uint _value
  )
    private
    returns (bool)
  {
    return TokenTransferProxy(tokenTransferProxy).transferFrom(
      _token,
      _from,
      _to,
      _value
    );
  }

  /**
   * @dev Mints new Xcert via XcertProxy using mint function.
   * @param _xcertData Structure of all mint data.
   * @param _to Address of Xcert receiver.
   * @return Success of Xcert mint.
   */
  function _mintViaXcertMintProxy(
    XcertData _xcertData,
    address _to
  )
    private
  {
    XcertMintProxy(xcertMintProxy).mint(
      _xcertData.xcert,
      _to,
      _xcertData.id,
      _xcertData.uri,
      _xcertData.proof,
      _xcertData.config,
      _xcertData.data
    );
  }

  /** 
   * @dev Gets xcert contract owner.
   * @param _xcert Contract address.
   */
  function _getOwner(
    address _xcert
  )
    private
    view
    returns (address)
  {
    return Xcert(_xcert).owner();
  }

  /**
   * @dev Helper function that pays all the feeAmounts.
   * @param _fees Data about fees needed to be payed.
   * @param _from Address from which fees are getting paid.
   * @return Success of payments.
   */
  function _payfeeAmounts(
    Fee[] _fees,
    address _from
  )
    private
  {
    for(uint256 i; i < _fees.length; i++)
    {
      if(_fees[i].to != address(0)
        && _fees[i].token != address(0)
        && _fees[i].amount > 0)
      {
        require(
          _transferViaTokenTransferProxy(
            _fees[i].token,
            _from,
            _fees[i].to,
            _fees[i].amount
          ), 
          ERC20_TRANSFER_FAILED
        );
      }
    }
  }
}
