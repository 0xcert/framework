pragma solidity ^0.4.24;

import "../Xcert.sol";

/**
 * @dev This is an example implementation of the Xcert smart contract.
 */
contract XcertMock is Xcert {

  /**
   * @dev Contract constructor.
   * @param _name A descriptive name for a collection of NFTs.
   * @param _symbol An abbreviated name for NFT.
   * @param _conventionId A bytes32 of keccak256 of json schema representing 0xcert protocol
   * convention.
   */
  constructor(
    string _name,
    string _symbol,
    bytes32 _conventionId
  )
    public
  {
    nftName = _name;
    nftSymbol = _symbol;
    nftConventionId = _conventionId;
  }
}
