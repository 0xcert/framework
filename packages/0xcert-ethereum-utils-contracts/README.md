<img src="https://github.com/0xcert/framework/raw/master/assets/cover-sub.png" />

> General utility module with helper smart contracts.

The [0xcert Framework](https://docs.0xcert.org) is a free and open-source JavaScript library that provides tools for building powerful decentralized applications. Please refer to the [official documentation](https://docs.0xcert.org) for more details.

This module is one of the bricks of the [0xcert Framework](https://docs.0xcert.org). It's written with [TypeScript](https://www.typescriptlang.org) and it's actively maintained. The source code is available on [GitHub](https://github.com/0xcert/framework) where you can also find our [issue tracker](https://github.com/0xcert/framework/issues).

# Ethereum Utility Contracts

This module includes Solidity contracts which should be useful for any smart contract project.

## Safe math -- `safe-math.sol`

This library includes basic arithmetic operations for unsigned 256-bit integers. This is a modern, gas-efficient implementation which also includes error reporting.

This implementation is based on the [openzeppelin-solidity](https://github.com/OpenZeppelin/openzeppelin-solidity/blob/master/contracts/math/SafeMath.sol) however the documentation and readability of code is much improved. We hope this will help you to write more error-free code.

Exampe usage:

```solidity
pragma solidity ^0.5.3;
import "https://github.com/0xcert/framework/packages/0xcert-ethereum-utils-contracts/src/contracts/math/safe-math.sol";

contract MilitaryStrengthAdder
{
  using SafeMath for uint256;
    
  function add(
    uint256 _addend1,
    uint256 _addend2
  )
    external
    pure
    returns (uint256 sum)
  {
    return _addend1.add(_addend2);
  }
}
```

## Abilities -- `abilitable.sol`

This is a permissions model where you may assign different forms of permission on your contract to any address. Typically these permissions will be used to allow administrative tasks on a smart contract.

## Ownership -- `ownable.sol` and `claimable.sol`

These are two ownership models that you can use for any smart contract. Ownable uses a single owner model which can be transferred unilaterally to a new owner. Claimable extends this model to a two-step transfer process, first the existing must send and the new owner must receive, the ownership privilege.

## Address utilities -- `address-utils.sol`

This allows you to check whether any address is a normal account or if it is a smart contract. Please note that a normal account can become a smart contract (`CREATE`) and a smart contract can become a normal account (`SELFDESTRUCT`).

## ERC-165 -- `erc165.sol` and `supports-interface.sol`

[ERC-165](https://eips.ethereum.org/EIPS/eip-165) is a standard for publishing interfaces which your smart contract supports. If you are implementing a standard interface then it is best practice for your contract to identify this with ERC-165. This makes it simple for other contracts to detect how it works so they can cooperate as expected.