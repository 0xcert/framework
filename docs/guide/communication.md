# Communication

Communication with the blockchain and other similar systems is quite different from communication with storage systems. Two different kinds of communication are employed within the 0xcert Framework - `query` and `mutation`.

## What are queries?

The process of reading a state from the underlying system is called a **query**.

A query represents an instant request which is fast and usually free of charge, and typically does not need any kind of account information.

A query reads data from the system and primarily represents a `GET` operation.

```ts
import { MetamaskProvider } from '@0xcert/ethereum-metamask-provider';
import { AssetLedger } from '@0xcert/ethereum-asset-ledger';

// initialize a provider
const provider = new MetamaskProvider();

// initialize a ledger
const ledgerId = '0xcc567f78e8821fb8d19f7e6240f44553ce3dbfce';
const ledger = new AssetLedger(provider, ledgerId);

// perform a query
const balance = await ledger.getBalance(accountId);
```

## What are mutations?

On the other hand, any request that changes the state on the underlying system (e.g., smart contract on the blockchain) is called a **mutation**.

If a query represents a `GET` operation, then a mutation represents `POST`, `PUT`, and `DELETE` operations. The 0xcert Framework adopts the concept of confirmations which are common in the blockchain systems, therefore, changing a state needs to be confirmed by the involved providers (miners).

Usually, mutations are billable, with payment made to involved parties who support the infrastructure. The fee depends on the storage and computation power required to process a mutation, and is based on the traffic congestion of the network as well.

Mutations must be performed from a user’s account, and the user has to confirm every mutation concerning their assets or values.

```ts
import { MetamaskProvider } from '@0xcert/ethereum-metamask-provider';
import { AssetLedger } from '@0xcert/ethereum-asset-ledger';

// initialize a provider
const provider = new MetamaskProvider();

// initialize a ledger
const ledgerId = '0xcc567f78e8821fb8d19f7e6240f44553ce3dbfce';
const ledger = new AssetLedger(provider, ledgerId);

// mutation is transmited to the system
const mutation = await ledger.enableTransfers();

// awaiting for confirmation
await mutation.complete();

```

To perform a mutation, first we need to send a request to the system that would accept it for handling. Once such request is approved, the response is transmitted in the form of mutation details which include a unique ID of the mutation. We can use this ID to track the state of mutation and its confirmation. Mutation with at least one confirmation can be considered completed (this is settable when creating a provider).

In the 0xcert Framework, every mutation returns an instance of [Mutation class](/api/core.html). You do not need to wait for the mutation to complete unless you need the changes to be made on the asset ledger before doing the next operation. Every mutation has a unique ID and with it you can create an instance of `Mutation` anytime.

This is a general description of how mutations in the 0xcert Framework work. For specific details about how mutations work within the system of your choice, please refer to the system's official documentation.

---

To see how communication works on the blockchain and how to connect to it, let's move to the [next section](/guide/using-providers.html#installation-process).
