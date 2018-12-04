pragma solidity ^0.5.1;

import "../../contracts/mocks/nf-token-metadata-enumerable-mock.sol";

contract NFTokenMetadataEnumerableTestMock is
  NFTokenMetadataEnumerableMock
{
  constructor(
    string memory _name,
    string memory _symbol,
    string memory _uriBase
  )
    NFTokenMetadataEnumerableMock(_name, _symbol, _uriBase)
    public
  {}

  function ownerToIdsLen(
    address _owner
  )
    external
    view
    returns (uint256)
  {
    return ownerToIds[_owner].length;
  }

  function ownerToIdbyIndex(
    address _owner,
    uint256 _index
  )
    external
    view
    returns (uint256)
  {
    return ownerToIds[_owner][_index];
  }

  function idToOwnerIndexWrapper(
    uint256 _tokenId
  )
    external
    view
    returns (uint256)
  {
    return idToOwnerIndex[_tokenId];
  }

  function idToIndexWrapper(
    uint256 _tokenId
  )
    external
    view
    returns (uint256)
  {
    return idToIndex[_tokenId];
  }
}
