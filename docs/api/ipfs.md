# API / IPFS

## IPFS storage

### Storage(options)

A `class` used to store and fetch data from IPFS.

**Arguments**

| Argument | Description
|-|-
| ipfsGatewayUri | IPFS gateway URI (`ipfs.io`).
| ipfsGatewayPort | PFS gateway port (`443`).
| ipfsGatewayProtocol | IPFS gateway protocol (`https`).
| ipfsApiUri | IPFS API URI (`ipfs.infura.io`).
| ipfsApiPort | PFS API port (`5001`).
| ipfsApiProtocol | IPFS API protocol (`https`).

### add(file)

An `asynchronous` class instance `function` which adds a new file to the IPFS.

**Example:**

```ts
const text = 'Hello world!';
const res = await ipfs.add(Buffer.alloc(text.length, text));
```

### get(hash)

An `asynchronous` class instance `function` which fetches the file from IPFS.

**Example:**

```ts
const res = await ipfs.get('QmVjfgKwssdn1pU2eVEaTVVNUNWYnLMDXYN2iKuecy79Do');
const body = await res.text();
```

## IPFS express middeware

### StorageMiddleware(options)

A `class` to be used as Express middleware

**Arguments**

| Argument | Description
|-|-
| levelDbPath | Path to LevelDB database.
| ipfsGatewayUri | IPFS gateway URI (`ipfs.io`).
| ipfsGatewayPort | PFS gateway port (`443`).
| ipfsGatewayProtocol | IPFS gateway protocol (`https`).
| ipfsApiUri | IPFS API URI (`ipfs.infura.io`).
| ipfsApiPort | PFS API port (`5001`).
| ipfsApiProtocol | IPFS API protocol (`https`).

### getter()

Express endpoint which stores the string data, coresponding to the token ID, to IPFS.

### setter()

Express endpoint which fetches the data, coresponding to the token ID, from IPFS.
