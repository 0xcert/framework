# Queries & Mutations

Comunication with the blockchain is quite different than communication with any kind of other storage systems. For this reason, we will explain two different kinds of communication employed within the 0xcert Framework.

The process of reading a state from the underlying system is called a **query**. A query represents an instant request which is fast and usually free of charge, and usually does not need any kind of account information. A query reads data from the system and basically represents a `GET` operation.

```ts
import { AssetLedger } from '@0xcert/ethereum-asset-ledger';

// initialize a ledger
const ledgerId = '0xcc567f78e8821fb8d19f7e6240f44553ce3dbfce';
const ledger = new AssetLedger(provider, ledgerId);

// perform a query
const balance = await ledger.getBalance(accountId);
```

On the other hand, the 0xcert Framework performs **mutations** for any request that changes the state on the underlying system (e.g. smart contract on the blockchain). If a query represents a `GET` operation, then a mutation represents `POST`, `PUT`, and `DELETE` operations. The 0xcert Framework adopts the concept of confirmations common in the blockchain systems, therefore, changing anything on the blockchain needs to be confirmed by involved providers (miners). Usually, mutations need to be paid to involved parties supporting the system. The fee depends on the storage and computation power needed to process the mutation based on the traffic congestion of the network. Mutations must be performed from a user’s account, and the user has to confirm every mutation concerning their assets or values.

```
import { MetamaskProvider } from '@0xcert/ethereum-metamask-provider';
import { AssetLedger } from '@0xcert/ethereum-asset-ledger';

// initialize a provider
const provider = new MetamaskProvider();

// initialize a ledger
const ledgerId = '0xcc567f78e8821fb8d19f7e6240f44553ce3dbfce';
const ledger = new AssetLedger(provider, ledgerId);

// enqueue mutation for processing
const mutation = await ledger.enableTransfers().then((mutation) => {
    // wait until confirmed
    return mutation.complete();
});
```

Mutations work by first sending a request to the system to be accepted to handling. Once the request is accepted, the response is sent in the form of mutation details which include a unique ID of the mutation. This ID can be used to track the state of mutation and its confirmation. Mutation with at least one confirmation can be considered completed.

This is a general description of how mutations in the 0xcert Framework work. For specific details about how mutations work on the system of your choice, please consider its official documentation.
