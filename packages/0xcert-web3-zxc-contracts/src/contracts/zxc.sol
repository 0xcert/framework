pragma solidity ^0.4.25;

import "@0xcert/web3-utils-contracts/src/contracts/permission/claimable.sol";
import "@0xcert/web3-utils-contracts/src/contracts/math/safe-math.sol";
import "@0xcert/web3-erc20-contracts/src/contracts/token.sol";

/*
 * @title ZXC protocol token.
 * @dev Standard ERC20 token used by the 0xcert protocol. This contract follows the implementation
 * at https://goo.gl/twbPwp.
 */
contract Zxc is
  Token,
  Claimable
{
  using SafeMath for uint256;

  /**
   * @dev Error constants.
   */
  string constant NULL_ADDRESS = "002001";
  string constant CANNOT_SEND_TO_ZXC_CONTRACT = "002002";
  string constant CANNOT_SEND_TO_CROWDSALE = "002003";
  string constant TRANSFERS_NOT_ALLOWED = "002004";
  string constant NOT_ENOUGH_BALANCE = "002005";

  /**
   * Transfer feature state.
   */
  bool internal transferEnabled;

  /**
   * Crowdsale smart contract address.
   */
  address public crowdsaleAddress;

  /**
   * @dev An event which is triggered when tokens are burned.
   * @param _burner The address which burns tokens.
   * @param _value The amount of burned tokens.
   */
  event Burn(
    address indexed _burner,
    uint256 _value
  );

  /**
   * @dev Assures that the provided address is a valid destination to transfer tokens to.
   * @param _to Target address.
   */
  modifier validDestination(
    address _to
  )
  {
    require(_to != address(0x0), NULL_ADDRESS);
    require(_to != address(this), CANNOT_SEND_TO_ZXC_CONTRACT);
    require(_to != address(crowdsaleAddress), CANNOT_SEND_TO_CROWDSALE);
    _;
  }

  /**
   * @dev Assures that tokens can be transfered.
   */
  modifier onlyWhenTransferAllowed()
  {
    require(transferEnabled || msg.sender == crowdsaleAddress, TRANSFERS_NOT_ALLOWED);
    _;
  }

  /**
   * @dev Contract constructor.
   */
  constructor()
    public
  {
    tokenName = "0xcert Protocol Token";
    tokenSymbol = "ZXC";
    tokenDecimals = 18;
    tokenTotalSupply = 500000000000000000000000000;
    transferEnabled = false;

    balances[owner] = tokenTotalSupply;
    emit Transfer(address(0x0), owner, tokenTotalSupply);
  }

  /**
   * @dev Transfers token to a specified address.
   * @param _to The address to transfer to.
   * @param _value The amount to be transferred.
   */
  function transfer(
    address _to,
    uint256 _value
  )
    public
    onlyWhenTransferAllowed()
    validDestination(_to)
    returns (bool _success)
  {
    _success = super.transfer(_to, _value);
  }

  /**
   * @dev Transfers tokens from one address to another.
   * @param _from address The address which you want to send tokens from.
   * @param _to address The address which you want to transfer to.
   * @param _value uint256 The amount of tokens to be transferred.
   */
  function transferFrom(
    address _from,
    address _to,
    uint256 _value
  )
    public
    onlyWhenTransferAllowed()
    validDestination(_to)
    returns (bool _success)
  {
    _success = super.transferFrom(_from, _to, _value);
  }

  /**
   * @dev Enables token transfers.
   */
  function enableTransfer()
    external
    onlyOwner()
  {
    transferEnabled = true;
  }

  /**
   * @dev Burns a specific amount of tokens. This function is based on BurnableToken implementation
   * at goo.gl/GZEhaq.
   * @notice Only owner is allowed to perform this operation.
   * @param _value The amount of tokens to be burned.
   */
  function burn(
    uint256 _value
  )
    external
    onlyOwner()
  {
    require(_value <= balances[msg.sender], NOT_ENOUGH_BALANCE);

    balances[owner] = balances[owner].sub(_value);
    tokenTotalSupply = tokenTotalSupply.sub(_value);

    emit Burn(owner, _value);
    emit Transfer(owner, address(0x0), _value);
  }

  /**
    * @dev Set crowdsale address which can distribute tokens even when onlyWhenTransferAllowed is
    * false.
    * @param crowdsaleAddr Address of token offering contract.
    */
  function setCrowdsaleAddress(
    address crowdsaleAddr
  )
    external
    onlyOwner()
  {
    crowdsaleAddress = crowdsaleAddr;
  }

}
