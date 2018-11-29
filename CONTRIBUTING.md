# Contributing

## Issues

We use GitHub issues to track public bugs. Please ensure your description is clear and has sufficient instructions to be able to reproduce the issue.

## Pull Requests

* Fork the repo and create your branch from master.
* If you've added code that should be tested, add tests.
* Ensure the test suite passes.

## Coding Style

Please follow the [TypeScript coding guidelines](https://github.com/Microsoft/TypeScript/wiki/Coding-guidelines).

## Geth

```
docker run -d \
  --name geth-test \
  -p 8545:8545 \
  -v ~/.docker/machine/volumes/geth-test/data:/root/.ethereum \
  ethereum/client-go \
  --testnet \
  --rpc \
  --rpcaddr "0.0.0.0" \
  --rpccorsdomain "*" \
  --rpcapi "db,eth,net,web3,personal,web3" \
  --cache=512
```
```
docker exec -it geth-test geth console --port 35555
```
```
curl -X POST -H "Content-Type: application/json" --data '{"jsonrpc":"2.0","method":"web3_clientVersion","params":[],"id":67}' http://localhost:8545
```

