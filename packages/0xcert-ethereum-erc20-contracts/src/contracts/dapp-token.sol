pragma solidity 0.6.1;
pragma experimental ABIEncoderV2;

import "@0xcert/ethereum-utils-contracts/src/contracts/math/safe-math.sol";
import "@0xcert/ethereum-utils-contracts/src/contracts/utils/supports-interface.sol";
import "@0xcert/ethereum-utils-contracts/src/contracts/permission/abilitable.sol";
import "./migration-receiver.sol";
import "./erc20.sol";

/**
 * @title This is an ERC-20 token that is bartered against another ERC-20 token. This means that
 * supply can only increase when the bartered token is deposited into this smart contract. Bartered
 * token can also be withdrawn at any moment. At that point the supply will decrease. This smart
 * contract also limits to whom tokens can be sent and adds functionality to migrate to a newer
 * version of the smart contract (this transfers bartered token from this smart contract to the
 * new one) as well and approving tokens with signature.
 * @dev This interface uses the official ERC-20 specification from
 * https://eips.ethereum.org/EIPS/eip-20 and also implements every optional function.
 */
contract DappToken is
  ERC20,
  SupportsInterface,
  Abilitable,
  MigrationReceiver
{
  using SafeMath for uint256;

  /**
   * @dev List of abilities:
   */
  uint8 constant ABILITY_SET_WHITELISTED = 16;
  uint8 constant ABILITY_SET_MIGRATE_ADDRESS = 32;
  uint8 constant ABILITY_SET_MIGRATOR_ADDRESS = 64;

  /**
   * @dev Error constants.
   */
  string constant NOT_ENOUGH_BALANCE = "010001";
  string constant NOT_ENOUGH_ALLOWANCE = "010002";
  string constant NOT_WHITELISTED_ADDRESS = "010003";
  string constant MIGRATION_NOT_STARTED = "010004";
  string constant MIGRATION_STARTED = "010005";
  string constant NOT_ABLE_TO_MIGRATE = "010006";
  string constant INVALID_SIGNATURE = "010007";
  string constant CLAIM_PERFORMED = "010008";
  string constant CLAIM_EXPIRED = "010009";
  string constant INVALID_SIGNATURE_KIND = "010010";
  string constant CLAIM_CANCELED = "010011";
  string constant NOT_APPROVER = "010012";

  /**
   * @dev Token name.
   */
  string internal tokenName;

  /**
   * @dev Token symbol.
   */
  string internal tokenSymbol;

  /**
   * @dev Number of decimals.
   */
  uint8 internal tokenDecimals;

  /**
   * @dev Total supply of tokens.
   */
  uint256 internal tokenTotalSupply;

  /**
   * @dev Balance information map.
   */
  mapping (address => uint256) internal balances;

  /**
   * @dev Token allowance mapping.
   */
  mapping (address => mapping (address => uint256)) internal allowed;

  /**
   * @dev Token transfer proxy contract address.
   */
  address public tokenTransferProxy;

  /**
   * @dev Addresses to which dapp tokens can be transferred.
   */
  mapping (address => bool) public whitelistedRecipients;

  /**
   * @dev Bartered token address. ERC-20 token that when deposited to this contract will create new
   * tokens in this contract. Dapp token is pegged 1 on 1 to the bartered token. Bartered token can
   * be withdrawn at any point.
   */
  ERC20 public barteredToken;

  /**
   * @dev Address to which we can migrate to. Bartered tokens are sent to this address.
   */
  address public migrationAddress;

  /**
   * @dev Dapp token addresses from which tokens can be migrated to the new dapp tokens. Bartered
   * tokens are transfered to the new dapp token address in the process.
   */
  mapping (address => bool) public approvedMigrators;

  /**
   * @dev Magic value of a smart contract that can be migrated to.
   * Equal to: bytes4(keccak256("onMigrationReceived(address,uint256)")).
   */
  bytes4 constant MAGIC_ON_MIGRATION_RECEIVED = 0xc5b97e06;

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
   * @param no_prefix Signatures that do not need a prefix.
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
   * @dev Mapping of all performed claims.
   */
  mapping(bytes32 => bool) public claimPerformed;

  /**
   * @dev Mapping of all canceled claims.
   */
  mapping(bytes32 => bool) public claimCancelled;

  /**
   * @dev Trigger when tokens are transferred, including zero value transfers.
   */
  event Transfer(
    address indexed _from,
    address indexed _to,
    uint256 _value
  );

  /**
   * @dev Trigger on any successful call to approve(address _spender, uint256 _value).
   */
  event Approval(
    address indexed _owner,
    address indexed _spender,
    uint256 _value
  );

  /**
   * @dev Trigger of any change of a whitelisted recipient.
   */
  event WhitelistedRecipient(
    address indexed _target,
    bool state
  );

  /**
   * @dev Trigger of any change of a approved migrator.
   */
  event ApprovedMigrator(
    address indexed _target,
    bool state
  );

  /**
   * @dev Contract constructor.
   */
  constructor()
    public
  {
    supportedInterfaces[0x36372b07] = true; // ERC20
    supportedInterfaces[0x06fdde03] = true; // ERC20 name
    supportedInterfaces[0x95d89b41] = true; // ERC20 symbol
    supportedInterfaces[0x313ce567] = true; // ERC20 decimals
  }

  /**
   * @dev Returns the name of the token.
   */
  function name()
    external
    override
    view
    returns (string memory _name)
  {
    _name = tokenName;
  }

  /**
   * @dev Returns the symbol of the token.
   */
  function symbol()
    external
    override
    view
    returns (string memory _symbol)
  {
    _symbol = tokenSymbol;
  }

  /**
   * @dev Returns the number of decimals the token uses.
   */
  function decimals()
    external
    override
    view
    returns (uint8 _decimals)
  {
    _decimals = tokenDecimals;
  }

  /**
   * @dev Returns the total token supply.
   */
  function totalSupply()
    external
    override
    view
    returns (uint256 _totalSupply)
  {
    _totalSupply = tokenTotalSupply;
  }

  /**
   * @dev Returns the account balance of another account with address _owner.
   * @param _owner The address from which the balance will be retrieved.
   */
  function balanceOf(
    address _owner
  )
    external
    override
    view
    returns (uint256 _balance)
  {
    _balance = balances[_owner];
  }

  /**
   * @dev Returns the amount which _spender is still allowed to withdraw from _owner.
   * @param _owner The address of the account owning tokens.
   * @param _spender The address of the account able to transfer the tokens.
   */
  function allowance(
    address _owner,
    address _spender
  )
    external
    override
    view
    returns (uint256 _remaining)
  {
    _remaining = allowed[_owner][_spender];
  }

  /**
   * @dev Sets whitelist state to an address
   * @param _target Address we are setting the whitelist state.
   * @param _state State we are setting. True means the address is whitelisted while false the
   * opposite.
   */
  function setWhitelistedRecipient(
    address _target,
    bool _state
  )
    external
    hasAbilities(ABILITY_SET_WHITELISTED)
  {
    whitelistedRecipients[_target] = _state;
    emit WhitelistedRecipient(_target, _state);
  }

  /**
   * @dev Sets migration caller state to an address.
   * @param _target Address we are setting the migration caller state.
   * @param _state State we are setting. True means the address is a migration caller while false
   * the opposite.
   */
  function setApprovedMigrator(
    address _target,
    bool _state
  )
    external
    hasAbilities(ABILITY_SET_MIGRATOR_ADDRESS)
  {
    approvedMigrators[_target] = _state;
    emit ApprovedMigrator(_target, _state);
  }

  /**
   * @dev Sets address to which migration is done.
   * @param _target Targeted address.
   */
  function startMigration(
    address _target
  )
    external
    hasAbilities(ABILITY_SET_MIGRATE_ADDRESS)
  {
    require(_target != address(0), MIGRATION_NOT_STARTED);
    migrationAddress = _target;
  }

  /**
   * @dev Migrate to a new Dapp token smart contract. Senders bartered tokens get transferred to the
   * new Dapp token where tokens in the same amount get created. Tokens on this smart contract get
   * destroyed.
   */
  function migrate()
    external
  {
    require(migrationAddress != address(0), MIGRATION_NOT_STARTED);
    uint256 balance = balances[msg.sender];
    balances[msg.sender] = 0;
    tokenTotalSupply = tokenTotalSupply.sub(balance);
    barteredToken.transfer(migrationAddress, balance);
    require(
      MigrationReceiver(migrationAddress)
        .onMigrationReceived(msg.sender, balance) == MAGIC_ON_MIGRATION_RECEIVED,
      NOT_ABLE_TO_MIGRATE
    );
    emit Transfer(msg.sender, address(0), balance);
  }

  /**
   * @dev Handles the receipt of a migration. The dapp token calls this function on the migration
   * address when migrating. Return of other than the magic value MUST result in the transaction
   * being reverted. Returns `bytes4(keccak256("onMigrationReceived(address,uint256)"))` unless
   * throwing. This method registers receiving bartered tokens and creates new tokens for the
   * migrator.
   * @param _migrator The address which called `migrate` function.
   * @param _amount Amount of tokens being migrated.
   * @return Returns `bytes4(keccak256("onMigrationReceived(address,uint256)"))`.
   */
  function onMigrationReceived(
    address _migrator,
    uint256 _amount
  )
    external
    override
    returns(bytes4)
  {
    require(approvedMigrators[msg.sender], NOT_ABLE_TO_MIGRATE);
    tokenTotalSupply = tokenTotalSupply.add(_amount);
    balances[_migrator] = balances[_migrator].add(_amount);
    allowed[_migrator][tokenTransferProxy] = allowed[_migrator][tokenTransferProxy].add(_amount);
    emit Approval(_migrator, tokenTransferProxy, allowed[_migrator][tokenTransferProxy]);
    emit Transfer(address(0), _migrator, _amount);
    return MAGIC_ON_MIGRATION_RECEIVED;
  }

  /**
   * @dev Transfers _value amount of tokens to address _to, and MUST fire the Transfer event. The
   * function SHOULD throw if the message caller's account balance does not have enough tokens to
   * spend.
   * @param _to The address of the recipient.
   * @param _value The amount of token to be transferred.
   */
  function transfer(
    address _to,
    uint256 _value
  )
    public
    override
    returns (bool _success)
  {
    require(migrationAddress == address(0), MIGRATION_STARTED);
    require(whitelistedRecipients[_to], NOT_WHITELISTED_ADDRESS);
    require(_value <= balances[msg.sender], NOT_ENOUGH_BALANCE);

    balances[msg.sender] = balances[msg.sender].sub(_value);
    balances[_to] = balances[_to].add(_value);

    emit Transfer(msg.sender, _to, _value);
    _success = true;
  }

  /**
   * @dev Allows _spender to withdraw from your account multiple times, up to the _value amount. If
   * this function is called again it overwrites the current allowance with _value.
   * @notice To prevent attack vectors like the one described here:
   * https://docs.google.com/document/d/1YLPtQxZu1UAvO9cZ1O2RPXBbT0mooh4DYKjA_jp-RLM/edit and
   * discussed here: https://github.com/ethereum/EIPs/issues/20#issuecomment-263524729, clients
   * SHOULD make sure to create user interfaces in such a way that they set the allowance first to 0
   * before setting it to another value for the same spender. THOUGH The contract itself shouldn’t
   * enforce it, to allow backwards compatibility with contracts deployed before.
   * @param _spender The address of the account able to transfer the tokens.
   * @param _value The amount of tokens to be approved for transfer.
   */
  function approve(
    address _spender,
    uint256 _value
  )
    public
    override
    returns (bool _success)
  {
    allowed[msg.sender][_spender] = _value;

    emit Approval(msg.sender, _spender, _value);
    _success = true;
  }

   /**
   * @dev Allows _spender to withdraw from your account multiple times, up to the _value amount. If
   * this function is called again it overwrites the current allowance with _value.
   * @notice To prevent attack vectors like the one described here:
   * https://docs.google.com/document/d/1YLPtQxZu1UAvO9cZ1O2RPXBbT0mooh4DYKjA_jp-RLM/edit and
   * discussed here: https://github.com/ethereum/EIPs/issues/20#issuecomment-263524729, clients
   * SHOULD make sure to create user interfaces in such a way that they set the allowance first to 0
   * before setting it to another value for the same spender. THOUGH The contract itself shouldn’t
   * enforce it, to allow backwards compatibility with contracts deployed before.
   * @param _approver Approving address from which the spender will be able to transfer tokens.
   * @param _spender The address of the account able to transfer the tokens.
   * @param _value The amount of tokens to be approved for transfer.
   * @param _feeValue The amount of token then will be tranfered to the executor of this method.
   * @param _feeRecipient Address of the fee recipient. If set to zero address the msg.sender will
   * automatically become the fee recipient.
   * @param _seed Arbitrary number to facilitate uniqueness of the order's hash. Usually timestamp.
   * @param _expiration Timestamp of when the claim expires.
   * @param _signature Data from the signature.
   */
  function approveWithSignature(
    address _approver,
    address _spender,
    uint256 _value,
    uint256 _feeValue,
    address _feeRecipient,
    uint256 _seed,
    uint256 _expiration,
    SignatureData memory _signature
  )
    public
  {
    bytes32 claim = generateClaim(
      _approver,
      _spender,
      _value,
      _feeValue,
      _feeRecipient,
      _seed,
      _expiration
    );
    require(!claimCancelled[claim], CLAIM_CANCELED);
    require(!claimPerformed[claim], CLAIM_PERFORMED);
    require(
      isValidSignature(
        _approver,
        claim,
        _signature
      ),
      INVALID_SIGNATURE
    );
    require(_expiration > now, CLAIM_EXPIRED);
    claimPerformed[claim] = true;

    allowed[_approver][_spender] = _value;
    emit Approval(_approver, _spender, _value);

    require(_feeValue <= balances[_approver], NOT_ENOUGH_BALANCE);
    balances[_approver] = balances[_approver].sub(_feeValue);
    if (_feeRecipient == address(0)) {
      _feeRecipient = msg.sender;
    }
    balances[_feeRecipient] = balances[_feeRecipient].add(_feeValue);
    emit Transfer(_approver, _feeRecipient, _feeValue);
  }

  /**
   * @dev Cancels approveWithSignature claim.
   * @notice This works even if sender doesn't own any tokens at the time.
   * @param _approver Approving address from which the spender will be able to transfer tokens.
   * @param _spender The address of the account able to transfer the tokens.
   * @param _value The amount of tokens to be approved for transfer.
   * @param _feeValue The amount of token then will be tranfered to the executor of this method.
   * @param _feeRecipient Address of the fee recipient. If set to zero address the msg.sender will
   * automatically become the fee recipient.
   * @param _seed Arbitrary number to facilitate uniqueness of the order's hash. Usually timestamp.
   * @param _expiration Timestamp of when the claim expires.
   */
  function cancelApproveWithSignature(
    address _approver,
    address _spender,
    uint256 _value,
    uint256 _feeValue,
    address _feeRecipient,
    uint256 _seed,
    uint256 _expiration
  )
    external
  {
    require(msg.sender == _approver, NOT_APPROVER);
    bytes32 claim = generateClaim(
      _approver,
      _spender,
      _value,
      _feeValue,
      _feeRecipient,
      _seed,
      _expiration
    );
    require(!claimPerformed[claim], CLAIM_PERFORMED);
    claimCancelled[claim] = true;
  }

  /**
   * @dev Generates hash representing the approve definition.
   * @param _approver Approving address from which the spender will be able to transfer tokens.
   * @param _spender The address of the account able to transfer the tokens.
   * @param _value The amount of tokens to be approved for transfer.
   * @param _feeValue The amount of token then will be tranfered to the executor of this method.
   * @param _feeRecipient Address of the fee recipient. If set to zero address the msg.sender will
   * automatically become the fee recipient.
   * @param _seed Arbitrary number to facilitate uniqueness of the order's hash. Usually timestamp.
   * @param _expiration Timestamp of when the claim expires.
   */
  function generateClaim(
    address _approver,
    address _spender,
    uint256 _value,
    uint256 _feeValue,
    address _feeRecipient,
    uint256 _seed,
    uint256 _expiration
  )
    public
    view
    returns (bytes32 _claim)
  {
    _claim = keccak256(
      abi.encodePacked(
        address(this),
        _approver,
        _spender,
        _value,
        _feeValue,
        _feeRecipient,
        _seed,
        _expiration
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
    SignatureData memory _signature
  )
    public
    pure
    returns (bool)
  {
    if (_signature.kind == SignatureKind.eth_sign)
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
    } else if (_signature.kind == SignatureKind.no_prefix)
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
   * @dev Transfers _value amount of tokens from address _from to address _to, and MUST fire the
   * Transfer event.
   * @param _from The address of the sender.
   * @param _to The address of the recipient.
   * @param _value The amount of token to be transferred.
   */
  function transferFrom(
    address _from,
    address _to,
    uint256 _value
  )
    public
    override
    returns (bool _success)
  {
    require(migrationAddress == address(0), MIGRATION_STARTED);
    require(whitelistedRecipients[_to], NOT_WHITELISTED_ADDRESS);
    require(_value <= balances[_from], NOT_ENOUGH_BALANCE);
    require(_value <= allowed[_from][msg.sender], NOT_ENOUGH_ALLOWANCE);

    balances[_from] = balances[_from].sub(_value);
    balances[_to] = balances[_to].add(_value);
    allowed[_from][msg.sender] = allowed[_from][msg.sender].sub(_value);

    emit Transfer(_from, _to, _value);
    _success = true;
  }

  /**
   * @dev Deposit bartered token into the contract. Calling this function will transfer bartered
   * token into the dapp token and create the same amount of dapp tokens to the caller.
   * This auto approves TokenTransferProxy contract.
   * @param _value Amount of bartered token we are depositing.
   * @param _receiver Receiver of dapp tokens.
   */
  function deposit(
    uint256 _value,
    address _receiver
  )
    public
  {
    require(migrationAddress == address(0), MIGRATION_STARTED);
    tokenTotalSupply = tokenTotalSupply.add(_value);
    balances[_receiver] = balances[_receiver].add(_value);
    barteredToken.transferFrom(msg.sender, address(this), _value);
    allowed[_receiver][tokenTransferProxy] = allowed[_receiver][tokenTransferProxy].add(_value);
    emit Transfer(address(0), _receiver, _value);
    emit Approval(_receiver, tokenTransferProxy, allowed[_receiver][tokenTransferProxy]);
  }

  /**
   * @dev Withdraw bartered token from the contract. Calling this function will destroy dapp tokens
   * and transfer the bartered token back to the caller.
   * @param _value The amount of bartered token we are withdrawing.
   */
  function withdraw(
    uint256 _value
  )
    public
  {
    require(_value <= balances[msg.sender], NOT_ENOUGH_BALANCE);
    tokenTotalSupply = tokenTotalSupply.sub(_value);
    balances[msg.sender] = balances[msg.sender].sub(_value);
    barteredToken.transfer(msg.sender, _value);
    emit Transfer(msg.sender, address(0), _value);
  }
}
