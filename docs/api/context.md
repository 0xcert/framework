# Context

0xcert uses blockchains to store a cryptographic proof of a particular asset called Xcert in form of a non-fungible token. Currently we support the Ethereum blockchain, but soon we'll expand our support to other blockchains. _Context_ is your gateway to these providers, it's an abstraction on top of the underlying blockchains so that you don't have to concern yourself with the implementation details and nuanced behaviors of every blockchain.

## Context Base

A context base is an `interface` and serves as a base for all the blockchain implementations to build upon. Its properties and functions are what you can always expect to be able to access from all the implementations. There are three functions exposed: `attach`, `detach` and `sign`. We explain these in more detail below.

### Initialization

You can attach to an underlying blockchain using `async attach()`, which you can expect will initialize a connection to the blockchain. A subsequent call to `async detach()` will release all the resources and variables set up during the attaching process.

### Signing

What you ultimately want to do with a context is use it to sign some data. Signing takes the data and your private key creates a signature through a one-way hashing function. This signature verifies the authenticity of the information.

You can do this by calling the `async sign(data: string)` function.

## Ethereum Context

The Ethereum context is a specific implementation of the context base discussed above. It implements the functions mentioned above as the context base explains plus some additional ones described below.

### Signing

`getSignMethod(signMethod?: SignMethod)`: returns the signing method, e.g. `ETH_SIGN` or `EIP712`.

`async signData(data: string)`: the underlying method behind `sign()` that uses the selected sign method.

### Interacting

`async query<T>(resolver: () => Promise<T>): Promise<Query<T>>`: query the Ethereum blockchain, e.g. getting the balance of an Ethereum address.

`async mutate(resolver: () => Promise<any>, from?: string): Promise<Mutation>`: modify the state of the EVM by publishing a transaction, e.g. minting new tokens.

`async transfer(data: { value: number, to: string }, from?: string): Promise<Mutation>‚`: move coins from one address to another.
