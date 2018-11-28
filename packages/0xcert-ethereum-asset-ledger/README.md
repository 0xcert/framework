```ts
## Available methods
A list of all available methods.

### Mutations
await ledger.assignAbilities(accountId, abilities);
await ledger.revokeAbilities(accountId, abilities);
await ledger.setTransferState(state);
await ledger.approveAccount(assetId, takerId); // ERC20 ERC721
await ledger.createAsset({ accountId, assetId, proof });
await ledger.updateAsset(assetId, { proof });
await ledger.destroyAsset(assetId);
await ledger.revokeAsset(assetId);

### Queries
await ledger.getAbilities(accountId);
await ledger.getCapabilities();
await ledger.getInfo();
await ledger.getSupply();
await ledger.getTransferState();
await ledger.isAprovedAccount(takerId, assetId); // ERC20 ERC721
await ledger.getAprovedAccount(assetId); // ERC20 ERC721

## TODO
await ledger.update({ uriBase });
await ledger.transferAsset({ id, to, data? }); // safeTransfer / transfer based on provider info.

await ledger.getAsset(assetId); // proof, uri, assetId
await ledger.getBalance(accountId);
await ledger.getAssetAccount(assetId);

### Special TODO

await ledger.setOperator(accountId, bool);
await ledger.isOperator(ownerId, accountId);
// Enumerable ???
```