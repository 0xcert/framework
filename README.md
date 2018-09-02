# 0xcert suite

## Account

```ts
import { Account } from '@0xcert/accounts';

// wallet instance
const wallet = new Account({
  address: '0xcf38dogufu3usufuhuru2ugfhj5ofmiu32',
});

// return token balance
await personalWallet.getTokenBalance({
  address: '0xcf38dogufu3usufuhuru2ugfhj5ofmiu32',
});

// send tokens to address
await personalWallet.transferTokens({
  target: '0xcf38dogufu3usufuhuru2ugfhj5ofmiu32',
  amount: 912.412,
  address: '0xcf38dogufu3usufuhuru2ugfhj5ofmiu32',
});
```

## Assets

```ts
import { IdentityCard } from '@0xcert/assets';

const asset = new IdentityCard({
  firstName: 'John',
  lastName: 'Smith',
  socialSecurity: '12398348512',
});



```

## Contributing

See [CONTRIBUTING.md](https://github.com/0xcert/suite/blob/master/CONTRIBUTING.md) for how to help out.

## Licence

See [LICENSE](https://github.com/0xcert/suite/blob/master/LICENCE) for details.
