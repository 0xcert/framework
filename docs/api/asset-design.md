# Asset Design (Conventions)

A digital asset is a data object which holds information about a real-world asset. Use cases for such digital assets include identities (KYC), collectibles, education certificates and more.

There are three parts you need to create when designing an asset:
* _digital asset specification:_ a JSON Schema definition of your type of objects,
* _specification consensus:_ upgrade your specification to a standard through community engagement and agreement and
* _metadata server:_ an HTTPS server to provide public metadata for every such digital asset.

We describe all the three components below.

## Digital Asset Specification

To define an object, use the [JSON Schema specification](http://json-schema.org/) to define your object. Your keys must be in alphabetical order as per convention (otherwise the framework handles this for you).

### Example

Let's say we are working on a simple application of identities as digital assets and an example of one of our customers is:

```json
{
  "familyName": "Smith",
  "givenName": "John"
}
```

There are two parameters for a person, `familyName` and `givenName`, both a `string`.
The JSON Schema definition for this type of digital asset would be:

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "description": "Person's digital identity.",
  "id": "https://specs.0xcert.org/schemas/1/digital-identity-1-0-0",
  "properties": {
    "familyName": {
      "description": "The last name of a Person.",
      "type": "string"
    },
    "givenName": {
      "description": "The first name of a Person.",
      "type": "string"
    }
  },
  "title": "Person",
  "type": "object"
}
```

## Specification Consensus

Once you have the asset definition from the previous step, open up an [issue](https://github.com/0xcert/0xcert/blob/master/issues) to propose a new convention. The proposal is accepted and merged into the master branch as soon as the interested community approves it, based on majority consensus.

## Metadata Server

Every digital asset from your specification will have a corresponding cryptographic imprint of it called Xcert in the form of a non-fungible token. This Xcert will be stored on a blockchain.

An Xcert does not include any publicly available information, but points to a publicly available object metadata file. We could store this information on the blockchain as well but this would be both expensive and less flexible.

For these reasons the metadata is stored and served on a server where every metadata response needs to:
 * be accessible through HTTPS,
 * have a content type of `application/schema+json`,
 * include a [Link Header](https://www.w3.org/wiki/LinkHeader) of a JSON Schema definition file.

 You have to set up this server during the asset design process.

 ### Example

If we envision a made-up exchange of Magic: The Gathering™ trading cards, we would need to store the public metadata of every card.
An example of an HTTPS request to https://mtgox.org/cards/black-lotus-1st-edition-13 would yield the following response:

```
200 OK
Content-Type: application/schema+json
Link: <https://specc.mtgox.org/cards-metadata-1-0-0> rel=describedBy
{
  "description": "Magic: The Gathering trading cards",
  "data": {
    "name": "Black Lotus",
    "type": "Mono Artifact",
  },
  "image": "https://mtgox.org/cards/black-lotus-1st-edition.jpg",
  "meta": {
    "digestAlgorithm": "sha256",
    "dateCreated": "2017-12-01",
    "expires": "2020-01-01"
  },
  "name": "Magic: The Gathering"
}
```
