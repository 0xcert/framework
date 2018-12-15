```ts
## Available methods
A list of all available methods.

### Mutations
await ledger.assignAbilities(accountId, abilities);
await ledger.revokeAbilities(accountId, abilities);
await ledger.enableTransfers();
await ledger.disableTransfers();
await ledger.approveAccount(assetId, takerId);
await ledger.disapproveAccount(assetid);
await ledger.createAsset({ accountId, assetId, imprint });
await ledger.updateAsset(assetId, { imprint });
await ledger.destroyAsset(assetId);
await ledger.revokeAsset(assetId);
await ledger.update({ uriBase });
await ledger.approveOperator(accountId); 
await ledger.disapproveOperator(accountId); 

### Queries
await ledger.getAbilities(accountId);
await ledger.getCapabilities();
await ledger.getInfo();
await ledger.getSupply();
await ledger.isTranserable();
await ledger.isApprovedAccount(assetId, takerId); 
await ledger.getApprovedAccount(assetId);
await ledger.getBalance(accountId);
await ledger.getAssetAccount(assetId);
await ledger.getAsset(assetId); // imprint, uri, assetId
await ledger.isApprovedOperator(accountId, operatorId);

```

# TODO
- deploy contract - kako prebrati `ledgerId` ko je contract zdeployan
