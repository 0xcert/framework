# IPFS storage

## Client interface

### Installation

We recommend you employ the package as an NPM package in your application.

```shell
$ npm i --save @0xcert/storage-ipfs
```

On our official [GitHub repository](https://github.com/0xcert/framework), we also host a compiled and minimized JavaScript files that you can directly include in your website.

### Usage overview

We begin by importing the module.

```ts
import { Storage } from '@0xcert/storage-ipfs';
```

We now create a new Storage instance.

```ts
const ipfs = new Storage({
  ipfsGatewayUri: 'ipfs.io',
  ipfsGatewayPort: 443,
  ipfsGatewayProtocol: 'https',
  ipfsApiUri: 'ipfs.infura.io',
  ipfsApiPort: 5001,
  ipfsApiProtocol: 'https',
});
```

This will allow us to store and fetch data from IPFS. To add a string to decentralized storage, we call the add method with buffered string as the parameter.

```ts
const text = 'Hello world!';
const data = await ipfs.add(Buffer.alloc(text.length, text));
```

To fetch the string back from decentralized storage, we call the get method with the data hash we recieved when we posted the data to IPFS.

```ts
const res = await ipfs.get(hash);
//=> 'Hello world!'
```

## Express middleware

A wrapper for Storage interface that uses LevelDB database for mapping ERC721 tokenId to metadata on external storage.

### Installation

We recommend you employ the package as an NPM package in your application.

```shell
$ npm i --save @0xcert/storage-ipfs-middleware
```

### Usage overview

We begin by importing the module.

```ts
import { StorageMiddleware } from '@0xcert/storage-ipfs-middleware';
```

Create a new instance and define API endpoints.

```ts
const storage = new StorageMiddleware({ levelDbPath: '0xcertdb'});
app.get('/storage/:id', storage.getter());
app.post('/storage/:id', storage.setter());
```
