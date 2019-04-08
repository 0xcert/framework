# IPFS Express middleware

Import and create a new instance of StorageMiddleware and expose the two endpoints.

```ts
const { StorageMiddleware } = require('@0xcert/storage-ipfs-middleware');
const storage = new StorageMiddleware({});

app.get('/storage/:id', storage.getter());
app.post('/storage/:id', storage.setter());
```
