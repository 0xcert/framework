<img src="../../assets/cover-sub.png" />

# 🧱 Asset Certification Module

*Data interoperability and assurance*

## Purpose

This is the core tenet of the 0xcert Framework — data interoperability and assurance. This module allows you to take any amount of application data and summarize it into a cryptographically-secure and succinct value.

In addition to just a simple hash — where you could send all the application data to confirm the succinct value — we also support *partially exposing* data. This allows you to send *part* of the application data and a cryptographic proof which can be traced back to the hash.

This technique is called a Merkle tree and it is why you are able to download a file using BitTorrent, from multiple peers, some of which may be hostile, and confirm if each part is correct... all from a tiny little magnet link.

This module applies this technique and allows you to use it against any arbitrary JSON object for any application. To put this into perspective, all of the other 0xcert Framework modules are concerned with using this module and connecting it to the blockchain.

## Walkthrough

You are the application developer and you have some application data which you need to make assurances about to the public or some third party. Maybe you are a national registrar of non-profit corporations and you want to publish some facts about entities that you have registered.

You know your application best and you can model the data how you like:

```ts
// Define certificate with JSON schema definition.
const cert = new Cert({ schema: { ... } });

// Calculate schema ID
const id = await cert.identify();
```

Next, get the actual application data and notarize it:

```ts
// Define arbitrary data object.
const data = { ... };

// Notarize data object (returns all recipes for all data keys).
const evidence = await cert.notarize(data);

// Generate root hash from complete data object.
const imprint = await cert.imprint(data);
```

That imprint succinctly repsents all the data. You can publish it. Also publish your data model, which is just a list of fields and types that your application data will be stored in.

Now you would like to expose some of the data either to the public or some third party.

```ts
// Expose selected data keys (returns recipes and exposed values from which an imprint can be calculated).
const evidence = await cert.disclose(data, [ ...paths ]);
```

You are done. The third party (or the public) can take your public data model, the specific data you have exposed and the evidence you have provided, and ....

```ts
// Verify data object against recipes generated with function `disclose` (if object is valid, an imprint is the root hash).
const imprint = await cert.calculate(data, recipes);
```

🌟 Bam! They are able to corroborate against the imprint which you have previously published.

## What we just accomplished

As the national registrar of non-profit corporations, you have priviledged access to information about corporations. Perhaps this includes names of officers, tax information and more. Based on your reputation, you are able to publish a summary of this data which the public trusts is from your due diligence, without making any details public.

In order to secure a loan, one of the officers of the corporation wants to present your attestation that the officer is associated with the corporation. This can already be done using paper and phone calls. But the above approach allows the officer to do this without bothering you and with a much faster due diligence through their bank.

## Next steps

* These certificates can be published on the Ethereum blockchain. This provides irrefutability (i.e. what has been certified cannot be denied). :arrow_right: See our [Asset Ledger Module](../0xcert-ethereum-asset-ledger/README.md).
* See how these certificates also enable enterprise commerce and other applications. :arrow_right: See our [Ethereum Gateway Module](../0xcert-ethereum-gateway/README.md).
* You can use the techniques above even without sharing any data. For example, you can prove the corporation revenue is over 1MM USD without exposing the actual amount. To learn more, visit your local library to read about zero-knowledge proofs.

## The big picture

The [0xcert Framework](https://docs.0xcert.org) is a free and open-source JavaScript library that provides tools for building powerful decentralized applications. Please refer to the [official documentation](https://docs.0xcert.org) for more details.

This module is one of the bricks of the [0xcert Framework](https://docs.0xcert.org). It's written with [TypeScript](https://www.typescriptlang.org) and it's actively maintained. The source code is available on [GitHub](https://github.com/0xcert/framework) where you can also find our [issue tracker](https://github.com/0xcert/framework/issues).
