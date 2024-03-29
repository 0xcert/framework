// SPDX-License-Identifier: MIT

pragma solidity 0.8.6;

/**
 * @dev Xcert pausable interface.
 */
interface XcertPausable // is Xcert
{

  /**
   * @dev Sets if Xcerts transfers are paused (can be performed) or not.
   * @param _isPaused Pause status.
   */
  function setPause(
    bool _isPaused
  )
    external;

}