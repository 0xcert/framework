# 0xcert suite

## TODO
- Notary class, evidence
- Update the merkle module - use William's proposal of calculation instead
- JSON schema definition, implementations do not have references, always extend ERC721 and evidence schema.
- error parsing
- ledger event subscription
- webpack for bundling bundles '.min.js' (where you can select which components you need), https://www.npmjs.com/package/simplifyify

## Development

Repository management: https://gist.github.com/xpepermint/eecfc6ad6cd7c9f5dcda381aa255738d
Codecov integration: https://gist.github.com/xpepermint/34c1815c2c0eae7aebed58941b16094e
Rush commands: https://gist.github.com/xpepermint/eecfc6ad6cd7c9f5dcda381aa255738d
Error code list: https://docs.google.com/spreadsheets/d/1TKiFKO9oORTIrMyjC11oqcaWWpTUVli5o9tOTh5Toio/edit?usp=sharing

## Contributing

See [CONTRIBUTING.md](https://github.com/0xcert/suite/blob/master/CONTRIBUTING.md) for how to help out.

## Licence

See [LICENSE](https://github.com/0xcert/suite/blob/master/LICENCE) for details.







[a, b, c, d, e]

hashA ------- ROOT (iz hashA in hashBC)
hashBC(hashB, hashC) ------- ROOT (iz hashBC in hashDEFG)
hashD, hashE, prazenHashF, prazenHashG => hashDEFG ------- ROOT ()

