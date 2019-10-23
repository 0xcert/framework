pragma solidity 0.5.11;

/**
 * Interface for accepting migrations.
 */
interface MigrationReceiver {

  /**
   * @dev Handle the receipt of a migration. The dapp token calls this function on the migration
   * address when migrating. Return of other than the magic value MUST result in the transaction
   * being reverted. Returns `bytes4(keccak256("onMigrationReceived(address,uint256)"))` unless
   * throwing.
   * @param _migrator The address which called `migrate` function.
   * @param _amount Amount of tokens being migrated.
   * @return Returns `bytes4(keccak256("onMigrationReceived(address,uint256)"))`.
   */
  function onMigrationReceived(
    address _migrator,
    uint256 _amount
  )
    external
    returns(bytes4);
}
