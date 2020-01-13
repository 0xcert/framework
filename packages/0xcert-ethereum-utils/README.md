<img src="../../assets/cover-sub.png" />

> General Ethereum utility module with helper functions for the Ethereum blockchain.

The [0xcert Framework](https://docs.0xcert.org) is a free and open-source JavaScript library that provides tools for building powerful decentralized applications. Please refer to the [official documentation](https://docs.0xcert.org) for more details.

This module is one of the bricks of the [0xcert Framework](https://docs.0xcert.org). It's written with [TypeScript](https://www.typescriptlang.org) and it's actively maintained. The source code is available on [GitHub](https://github.com/0xcert/framework) where you can also find our [issue tracker](https://github.com/0xcert/framework/issues).

# Ethereum Utilities

This module wraps several useful Ethereum functions which will be useful through the 0xcert Framework. Currently supported are these functions and classes from [ethers.js](https://github.com/ethers-io/ethers.js):

## ABI coder

This converts the value to and from the packed [Ethereum ABI encoding](https://solidity.readthedocs.io/en/develop/abi-spec.html#formal-specification-of-the-encoding).

* `encodeParameters`(types: `any`, values: `Array<any>`): `string`
* `decodeParameters`(types: `any`, data: `any`): `any`

**Encoding example:**

```ts
import { decodeParameters, encodeParameters } from '0xcert/ethereum-utils/abi';

const types = ['tuple(uint256, uint256[])'];
const values = [[ 42, [ 45 ] ]];
const encodedValues = encodeParameters(types, values);
```

**Decoding example:**

```ts
import { decodeParameters, encodeParameters } from '0xcert/ethereum-utils/abi';

const types = ['tuple(uint256, uint256[])'];
const encoded = '0x' +
  '0000000000000000000000000000000000000000000000000000000000000020' +
  '000000000000000000000000000000000000000000000000000000000000002a' +
  '0000000000000000000000000000000000000000000000000000000000000040' +
  '0000000000000000000000000000000000000000000000000000000000000001' +
  '000000000000000000000000000000000000000000000000000000000000002d';
const values = decodeParameters(types, values);
```

## Big umbers

Here is a basic example adapted from [the ethers.js documentation](https://docs.ethers.io/ethers.js/html/api-utils.html?highlight=bignumberify#big-numbers).

```ts
import { bigNumberify } from '0xcert/ethereum-utils/big-number';

let gasPriceWei = bigNumberify("20902747399");
let gasLimit = bigNumberify(3000000);

let maxCostWei = gasPriceWei.mul(gasLimit)
console.log("Max Cost: " + maxCostWei.toString());
// "Max Cost: 62708242197000000"

console.log("Number: " + maxCostWei.toNumber());
// throws an Error, the value is too large for JavaScript to handle safely
```

## Address normalization

The ethers.js [address normalization function](https://docs.ethers.io/ethers.js/html/api-utils.html?highlight=getaddress#addresses) implements [EIP-55 Mixed-case checksum address encoding](https://eips.ethereum.org/EIPS/eip-55).


```ts
import { getAddress } from '0xcert/ethereum-utils/normalize-address';

let zxcTokenAddress = '0x83e2be8d114f9661221384b3a50d24b96a5653f5';
let zxcTokenAddressNormalized = normalizeAddress(zxcToenAddress);
// 0x83e2BE8d114F9661221384B3a50d24B96a5653F5
```