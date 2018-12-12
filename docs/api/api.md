---
title: API
type: api
---

## new HttpProvider(options)

**Arguments**

| Option | Type | Description
|-|-|-
| options.accountId | string | Ethereum wallet address of a maker (required for all mutations).
| options.cache | string | Cache mode. See details [here](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch). Defaults to `no-cache`.
| options.credentials | string | Request credentials. See details [here](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch). Defaults to `omit`.

**Result**

| Option | Type | Description
|-|-|-
| options.accountId | string | Ethereum wallet address of a maker (required for all mutations).
| options.cache | string | Cache mode. See details [here](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch). Defaults to `no-cache`.
| options.credentials | string | Request credentials. See details [here](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch). Defaults to `omit`.

**Usage**

```ts
import { HttpProvider } from '@0xcert/ethereum-http-provider';

const provider = new HttpProvider({
    url: 'https://ropsten.infura.io/v3/06312ac7a50b4bd49762abc5cf79dab8',
});
```

> In case you use your own Ethereum node and besides reading you also want to sign and send transactions, do not forget to manually unlock your account. If you don't unlock your account, errors will appear.
