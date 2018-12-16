# Certification

What is proof
Generating proofs
Validate proof
Exposing certified data

```
// VERIFICATION EXAMPLE
// I share an evidence file that imprints certain JSON paths (e.g. public JSON)
// I have an object with just some data.
// The function recreates a recipe for this partial data object and assignes is to the evidence file.
// At this stage we modified evidence file with data we know.
// We then calculate the imprint which must match the one stored in the token.
// NOTE: Custom fields always pass.

// WORDING
// evidence -> consists of imprints -> forms an imprint
// data object -> consists of properties (props)

// USAGE
// Define arbitrary data object.
const data = { ... };
// Define certificate with JSON schema definition.
const cert = new Cert({ schema: { ...} });
// Notarize data object (returns all imprints for whole data object).
const imprints = await cert.notarize(data);
// Expose selected data keys (returns imprints and exposed values from which an imprint can be calculated).
const imprints = await cert.disclose(exampleData, [ ...paths... ]);
// Verify data object against imprints generated with function `disclose` (if object is valid, an imprint is the right root hash).
const imprint = await cert.calculate(data, imprints);
// Generate root hash from complete data object.
const imprint = await cert.imprint(data);
```