pragma solidity ^0.4.24;
pragma experimental ABIEncoderV2;

import "@0xcert/ethereum-utils/contracts/math/SafeMath.sol";
import "@0xcert/ethereum-utils/contracts/utils/SupportsInterface.sol";
import "@0xcert/ethereum-xcert/contracts/tokens/Xcert.sol";
import "@0xcert/web3-erc20/src/contracts/ERC20.sol";
import "@0xcert/web3-proxy/src/contracts/token-transfer-proxy.sol";
import "@0xcert/web3-proxy/src/contracts/xcert-mint-proxy.sol";

/**
 @dev Contract for decetralized minting of NFTs. 
 */
contract Minter is
  SupportsInterface
{
  using SafeMath for uint256;

  /** 
   * @dev contract addresses
   */
  address XCERT_MINT_PROXY_CONTRACT;
  address TOKEN_TRANSFER_PROXY_CONTRACT;

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
   */
  struct XcertData{
    address xcert;
    uint256 id;
    string proof;
    string uri;
    bytes32[] config;
    bytes32[] data;
  }

  /**
   * @dev Struture of fee data.
   */
  struct Fee{
    address feeAddress;
    uint256 feeAmount;
    address tokenAddress;
  }

  /** 
   * @dev Structure of data needed for mint.
   */
  struct MintData{
    address to;
    Fee[] fees;
    uint256 seed;
    uint256 expirationTimestamp;
  }

  /**
   * @dev Structure representing the signature parts.
   */
  struct Signature{
    bytes32 r;
    bytes32 s;
    uint8 v;
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
    TOKEN_TRANSFER_PROXY_CONTRACT = _tokenTransferProxy;
    XCERT_MINT_PROXY_CONTRACT = _xcertMintProxy;
    //supportedInterfaces[0xe0b725c2] = true; // Minter
  }

  /**
   * @dev Get address of token transfer proxy used in minter.
   */
  function getTokenTransferProxyAddress()
    external
    view
    returns (address)
  {
    return TOKEN_TRANSFER_PROXY_CONTRACT;
  }

  /**
   * @dev Get address of xcert mint proxy used in minter.
   */
  function getXcertMintProxyAddress()
    external
    view
    returns (address)
  {
    return XCERT_MINT_PROXY_CONTRACT;
  }

  /**
   * @dev Performs Xcert mint directly to the taker.
   * @param _mintData Data needed for minting.
   * @param _xcertData Data needed for minting a new Xcert.
   * @param _signatureData Data of the signed claim.
   */
  function performMint(
    MintData _mintData,
    XcertData _xcertData,
    Signature _signatureData
  )
    public
  {
    bytes32 claim = getMintDataClaim(_mintData, _xcertData);
    address owner = _getOwner(_xcertData.xcert);

    require(_mintData.to == msg.sender, "You are not the mint recipient.");
    require(owner != _mintData.to, "You cannot mint to the owner.");
    require(_mintData.expirationTimestamp >= now, "Mint claim has expired.");

    require(
      isValidSignature(
        owner,
        claim,
        _signatureData
      ),
      "Invalid signature"
    );

    require(!mintPerformed[claim], "Mint already performed.");
    require(!mintCancelled[claim], "Mint canceled.");

    mintPerformed[claim] = true;

    _mintViaXcertMintProxy(_xcertData, _mintData.to);

    _payfeeAmounts(_mintData);

    emit PerformMint(
      _mintData.to,
      _xcertData.xcert,
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
    require(msg.sender == owner, "You are not the claim maker.");

    bytes32 claim = getMintDataClaim(_mintData, _xcertData);

    require(!mintPerformed[claim], "Cannot cancel performed mint.");

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
   * @param _xcertData Data needed for minting a new Xcert.
   * @return keccak-hash of mint data.
   */
  function getMintDataClaim(
    MintData _mintData,
    XcertData _xcertData
  )
    public
    view
    returns (bytes32)
  {
    return keccak256(
      abi.encodePacked(
        address(this),
        _mintData.to,
        _xcertData.xcert,
        _xcertData.id,
        _xcertData.proof,
        _xcertData.uri,
        _xcertData.config,
        _xcertData.data,
        _mintData.fees,
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
    Signature _signature
  )
    public
    pure
    returns (bool)
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
    internal
    returns (bool)
  {
    return TokenTransferProxy(TOKEN_TRANSFER_PROXY_CONTRACT).transferFrom(
      _token,
      _from,
      _to,
      _value
    );
  }

  /**
   * @dev Mints new Xcert via XcertProxy using mint function.
   * @param _mintData Structure of all mint data.
   * @param _to Address of Xcert receiver.
   * @return Success of Xcert mint.
   */
  function _mintViaXcertMintProxy(
    XcertData _mintData,
    address _to
  )
    internal
  {
    XcertMintProxy(XCERT_MINT_PROXY_CONTRACT).mint(
      _mintData.xcert,
      _to,
      _mintData.id,
      _mintData.uri,
      _mintData.proof,
      _mintData.config,
      _mintData.data
    );
  }

  /** 
   * @dev Gets xcert contract owner.
   * @param _xcert Contract address.
   */
  function _getOwner(
    address _xcert
  )
    internal
    view
    returns (address)
  {
    return Xcert(_xcert).owner();
  }

  /**
   * @dev Helper function that pays all the feeAmounts.
   * @param _mintData Data needed for paying fees.
   * @return Success of payments.
   */
  function _payfeeAmounts(
    MintData _mintData
  )
    internal
  {
    for(uint256 i; i < _mintData.fees.length; i++)
    {
      if(_mintData.fees[i].feeAddress != address(0) 
        && _mintData.fees[i].tokenAddress != address(0)
        && _mintData.fees[i].feeAmount > 0)
      {
        require(
          _transferViaTokenTransferProxy(
            _mintData.fees[i].tokenAddress,
            _mintData.to,
            _mintData.fees[i].feeAddress,
            _mintData.fees[i].feeAmount
          ), 
          "Insufficient balance or allowance."
        );
      }
    }
  }
}
