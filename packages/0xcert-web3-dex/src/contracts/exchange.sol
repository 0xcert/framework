pragma solidity ^0.4.24;
pragma experimental ABIEncoderV2;

import "@0xcert/web3-proxy/src/contracts/token-transfer-proxy.sol";
import "@0xcert/web3-proxy/src/contracts/nftokens-transfer-proxy.sol";

/**
 * @dev Decentralize exchange for fundgible and non-fundgible tokens powered by atomic swaps. 
 */
contract Exchange 
{
  /**
   * @dev Error constants.
   */
  string constant INVALID_TOKEN_TRANSFER_PROXY = "1001";
  string constant INVALID_NF_TOKEN_TRANSFER_PROXY = "1002";
  string constant INVALID_SIGNATURE_KIND = "1003";
  string constant INVALID_TOKEN_KIND = "1004";

  string constant TAKER_NOT_EQUAL_TO_SENDER = "2001";
  string constant TAKER_EQUAL_TO_MAKER = "2002";
  string constant CLAIM_EXPIRED = "2003";
  string constant INVALID_SIGNATURE = "2004";
  string constant SWAP_CANCELED = "2005";
  string constant SWAP_ALREADY_PERFORMED = "2006";
  string constant ERC20_TRANSFER_FAILED = "2007";
  string constant ERC721_TRANSFER_FAILED = "2008";
  string constant MAKER_NOT_EQUAL_TO_SENDER = "2009";

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
   * @dev Enum of available tokens kinds.
   * @param erc20 ERC20 standard tokens.
   * @param erc721 ERC721 standard tokens.
   */
  enum TokenKind
  {
    erc20,
    erc721
  }

  /**
   * @dev Structure representing what to send and where.
   * @param token Address of the token we are sending (can be ERC20 or ERC721).
   * @param kind Type of the token we are sending
   * @param from Address of the sender.
   * @param to Address of the receiver.
   * @param value Amount of ERC20 or ID of ERC721.
   */
  struct TransferData 
  {
    address token;
    TokenKind kind; // Check other options like ERC165 or checking methods that exists.
    address from;
    address to;
    uint256 value;
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
   * @dev Structure representing the data needed to do the swap.
   * @param maker Address of the one that made the claim.
   * @param taker Address of the one that is executing the claim.
   * @param transfers Data of all the transfers that should accure it this swap.
   * @param signature Data from the signed claim.
   * @param seed Arbitrary number to facilitate uniqueness of the order's hash. Usually timestamp.
   * @param expiration Timestamp of when the claim expires. 0 if indefinet. 
   */
  struct SwapData 
  {
    address maker;
    address taker;
    TransferData[] transfers;
    uint256 seed;
    uint256 expiration;
  }

  /** 
   * @dev Proxy contract addresses.
   */
  address public tokenTransferProxy; 
  address public nfTokenTransferProxy; 

  /**
   * @dev Mapping of all cancelled transfers.
   */
  mapping(bytes32 => bool) public swapCancelled;

  /**
   * @dev Mapping of all performed transfers.
   */
  mapping(bytes32 => bool) public swapPerformed;

  /**
   * @dev This event emmits when tokens change ownership.
   */
  event PerformSwap(
    address indexed _maker,
    address indexed _taker,
    bytes32 _claim
  );

  /**
   * @dev This event emmits when transfer order is cancelled.
   */
  event CancelSwap(
    address indexed _maker,
    address indexed _taker,
    bytes32 _claim
  );

  /**
   * @dev Sets Token proxy address and NFT Proxy address.
   * @param _tokenTransferProxy Address pointing to TokenTransferProxy contract.
   * @param _nfTokenTransferProxy Address pointing to NFTokenTransferProxy contract.
   */
  constructor(
    address _tokenTransferProxy, 
    address _nfTokenTransferProxy
  ) 
    public
  {
    require(_tokenTransferProxy != address(0), INVALID_TOKEN_TRANSFER_PROXY);
    require(_nfTokenTransferProxy != address(0), INVALID_NF_TOKEN_TRANSFER_PROXY);

    tokenTransferProxy = _tokenTransferProxy;
    nfTokenTransferProxy = _nfTokenTransferProxy;
  }

  /**
   * @dev Performs the ERC721/ERC20 atomic swap.
   * @param _data Data required to make the swap.
   * @param _signature Data from the signature. 
   */
  function swap(
    SwapData _data,
    SignatureData _signature
  )
    public 
  {
    require(_data.taker == msg.sender, TAKER_NOT_EQUAL_TO_SENDER);
    require(_data.taker != _data.maker, TAKER_EQUAL_TO_MAKER);
    require(_data.expiration >= now, CLAIM_EXPIRED);

    bytes32 claim = getSwapDataClaim(_data);
    require(
      isValidSignature(
        _data.maker,
        claim,
        _signature
      ), 
      INVALID_SIGNATURE
    );

    require(!swapCancelled[claim], SWAP_CANCELED);
    require(!swapPerformed[claim], SWAP_ALREADY_PERFORMED);

    swapPerformed[claim] = true;

    _makeTransfers(_data.transfers);

    emit PerformSwap(
      _data.maker,
      _data.taker,
      claim
    );
  }

  /** 
   * @dev Cancels swap
   *
   * @param _data Data of swap to cancel.
   */
  function cancelSwap(
    SwapData _data
  )
    public
  {
    require(_data.maker == msg.sender, MAKER_NOT_EQUAL_TO_SENDER);

    bytes32 claim = getSwapDataClaim(_data);
    require(!swapPerformed[claim], SWAP_ALREADY_PERFORMED);

    swapCancelled[claim] = true;
    emit CancelSwap(
      _data.maker,
      _data.taker,
      claim
    );
  }

  /**
   * @dev Calculates keccak-256 hash of SwapData from parameters.
   * @param _swapData Data needed for atomic swap.
   * @return keccak-hash of swap data.
   */
  function getSwapDataClaim(
    SwapData _swapData
  )
    public
    view
    returns (bytes32)
  {
    bytes32 temp = 0x0;

    for(uint256 i = 0; i < _swapData.transfers.length; i++)
    {
      temp = keccak256(
        abi.encodePacked(
          temp,
          _swapData.transfers[i].token,
          _swapData.transfers[i].kind,
          _swapData.transfers[i].from,
          _swapData.transfers[i].to,
          _swapData.transfers[i].value
        )
      );
    }

    return keccak256(
      abi.encodePacked(
        address(this),
        _swapData.maker,
        _swapData.taker,
        temp,
        _swapData.seed,
        _swapData.expiration
      )
    );
  }
  
  /**
   * @dev Verifies if claim signature is valid.
   * @param _signer address of signer.
   * @param _claim Signed Keccak-256 hash.
   * @param _signature Signature data.
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
   * @dev Helper function that makes transfes.
   * @param _transfers Data needed for transfers.
   */
  function _makeTransfers(
    TransferData[] _transfers
  )
    private
  {
    for(uint256 i = 0; i < _transfers.length; i++)
    {
      if(_transfers[i].kind == TokenKind.erc20)
      {
        require(
          _transferViaTokenTransferProxy(
            _transfers[i].token,
            _transfers[i].from,
            _transfers[i].to,
            _transfers[i].value
          ),
          ERC20_TRANSFER_FAILED
        );
      }else if(_transfers[i].kind == TokenKind.erc721)
      {
        _transferViaNFTokenTransferProxy(
          _transfers[i].token,
          _transfers[i].from,
          _transfers[i].to,
          _transfers[i].value
        );
      }else 
      {
        revert(INVALID_TOKEN_KIND);
      }
    }
  }

  /** 
   * @dev Transfers ERC20 tokens via TokenTransferProxy using transferFrom function.
   * @param _token Address of token to transferFrom.
   * @param _from Address transfering token.
   * @param _to Address receiving token.
   * @param _value Amount of token to transfer.
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
   * @dev Transfers NFToken via NFTokenProxy using transferFrom function.
   * @param _nfToken Address of NFToken to transfer.
   * @param _from Address sending NFToken.
   * @param _to Address receiving NFToken.
   * @param _id Id of transfering NFToken.
   */
  function _transferViaNFTokenTransferProxy(
    address _nfToken,
    address _from,
    address _to,
    uint256 _id
  )
    private
  {
    NFTokenTransferProxy(nfTokenTransferProxy).transferFrom(
      _nfToken,
      _from,
      _to,
      _id
    );
  }
}