pragma solidity ^0.4.25;

import "./xcert.sol";

/**
 * @dev Xcert implementation where token transfers can be paused.
 */
contract PausableXcert is Xcert {

  /**
   * @dev List of abilities:
   * 3 - Ability to pause xcert transfers.
   */
  uint8 constant ABILITY_TO_PAUSE_TRANSFERS = 3;


  /**
   * @dev Error constants.
   */
  string constant TRANSFERS_PAUSED = "009001";

  /**
   * @dev This emits when ability of beeing able to transfer Xcerts changes (paused/unpaused).
   */
  event IsPaused(bool isPaused);

  /**
   * @dev Are Xcerts paused or not.
   */
  bool public isPaused;

  /**
   * @dev Contract constructor.
   * @notice When implementing this contract don't forget to set nftConventionId, nftName, nftSymbol
   * and default pause state.
   */
  constructor()
    public
  {
    supportedInterfaces[0xbedb86fb] = true; // PausableXcert
  }

  /**
   * @dev Sets if Xcerts are paused or not.
   * @param _isPaused Pause status.
   */
  function setPause(
    bool _isPaused
  )
    external
    hasAbility(ABILITY_TO_PAUSE_TRANSFERS)
  {
    isPaused = _isPaused;
    emit IsPaused(_isPaused);
  }

   /**
   * @dev Helper methods that actually does the transfer.
   * @param _from The current owner of the NFT.
   * @param _to The new owner.
   * @param _tokenId The NFT to transfer.
   */
  function _transferFrom(
    address _from,
    address _to,
    uint256 _tokenId
  )
    internal
  {
    require(!isPaused, TRANSFERS_PAUSED);
    super._transferFrom(_from, _to, _tokenId);
  }
}