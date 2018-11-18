```ts
// VERIFICATION EXAMPLE
// I share an evidence file that proofs certain JSON paths (e.g. public JSON)
// I have an object with just some data.
// The function recreates a recipe for this partial data object and assignes is to the evidence file.
// At this stage we modified evidence file with data we know.
// We then calculate the imprint which must match the one stored in the token.
// NOTE: Custom fields always pass.

// WORDING
// evidence -> consists of proofs -> forms an imprint
// data object -> consists of properties (props)

// USAGE
// Define arbitrary data object.
const data = { ... };
// Define certificate with JSON schema definition.
const cert = new Cert({ schema: { ...} });
// Notarize data object (returns all proofs for whole data object).
const proofs = await cert.notarize(data);
// Expose selected data keys (returns proofs and exposed values from which an imprint can be calculated).
const proofs = await cert.disclose(exampleData, [ ...paths... ]);
// Verify data object against proofs generated with function `disclose` (if object is valid, an imprint is the right root hash).
const imprint = await cert.calculate(data, proofs);
// Generate root hash from complete data object.
const imprint = await cert.imprint(data);
```
