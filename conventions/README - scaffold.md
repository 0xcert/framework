<img src="https://github.com/0xcert/framework/raw/master/assets/cover-sub.png" />

The [0xcert Framework](https://docs.0xcert.org) is a free and open-source JavaScript library that provides tools for building powerful decentralized applications. Please refer to the [official documentation](https://docs.0xcert.org) for more details.

# Simple Summary of 0xcert Conventions

*Conventions* are data models that allow your application to interoperate with other applications using the 0xcert Protocol. Additionally, conventions enable *imprints*, a tamper-evident system for assuring data consistency in which some of the data can be public and some can be private.

## About

Every digital asset in the 0xcert Protocol is defined using a *convention*. Conventions are data models that allow your application to interoperate with other applications using the 0xcert Protocol.

This convention is the base specification to which all other conventions MUST conform.

This convention is minimal and adopts only the specification for digital assets from [ERC-721](https://eips.ethereum.org/EIPS/eip-721) while adding the requirement that every digital asset specify to which convention it conforms.

## Motivation

The European Qualification Framework (EQF) enables learners, learning providers and employers to compare qualifications between different national systems. The metadata is, therefore, an attempt to create a new or additional EQF schema within the EQF pillar in ESCO that proposes a set of standard metadata for documenting micro-credentials, and specifically on how to record, store and transfer them via computer systems.

This means interoperability is of crucial importance. The metadata standard is therefore mapped to other frameworks in order to have a take-up and launch micro-credentials as a feasible innovation in the qualification market.

With this interoperable, validated and widely acknowledged metadata standard – adopted even by the European Commission through public consultations - we claim that we can build a clearinghouse for academic credentials or micro-credentials on top of a new and accepted standard, integrated and supported by ESCO (European Skills, Competences, Qualifications and Occupations).

The idea is to translate this standard into conventions offered by the 0xcert framework.

## What's in this directory?

This directory contains *approved* conventions and represents best practices in industry. These conventions are public. You can use these public conventions as-is, derive your own more specific versions of these public conventions or create your own conventions from scratch.

## Convention format

Please see the [base asset schema](./86-base-asset-schema.md) as an example of the convention format. Also, every convention must adopt this base asset schema.

## Rationale

## Json Schema

The key words “MUST”, “MUST NOT”, “REQUIRED”, “SHALL”, “SHALL NOT”, “SHOULD”, “SHOULD NOT”, “RECOMMENDED”, “MAY”, and “OPTIONAL” in this document are to be interpreted as described in RFC 2119.

Every digital asset in the 0xcert Protocol MUST follow this convention. Every other convention MUST extend this specification at a minimum.

This specification is provided in a machine-readable format using the [JSON Schema](https://json-schema.org/) format also using [JSON-LD](https://json-ld.org/) to connect the digital asset to an optional evidence file.

The naming of JSON properties SHOULD follow the [schema.org](http://schema.org/) specification when possible. This enables an easy way to convert a digital asset data object into [JSON-LD](https://json-ld.org/) format.

This schema extends [ERC721 Metadata JSON Schema](https://eips.ethereum.org/EIPS/eip-721), an existing well-known data model for digital assets.

```
{
  "$schema": "http://json-schema.org/draft-07/schema",
  "description": "An abstract digital asset schema.",
  "properties": {
    "$evidence": {
      "description": "A URI pointing to the evidence JSON with data needed to certify this asset.",
      "type": "string"
    },
    "$schema": {
      "description": "A path to JSON Schema definition file.",
      "type": "string"
    },
    "name": {
      "description": "A property that holds a name of an asset.",
      "type": "string"
    },
    "description": {
      "description": "A property that holds a detailed description of an asset.",
      "type": "string"
    },
    "image": {
      "description": "A public property that can be a valid URI pointing to a resource with mime type image/* representing the asset to which this digital assets represents. Consider making any images at a width between 320 and 1080 pixels and aspect ratio between 1.91:1 and 4:5 inclusive.",
      "type": "string"
    }
  },
  "title": "Asset",
  "type": "object",
  "required": ["$schema"]
}
```

A more human-friendly description of this above specification follows. This is provided to help the reader however only the above machine-readable description is authoritative.

- The data model is a JSON object.
- The JSON object MUST include a `$schema` string property on the root of the object.
- The JSON object MAY include an `$evidence` string property on the root of the object, and if so this will be interpreted as a URI pointing to an evidence file which certifies any imprints of this digital asset.
- The JSON object MAY include `name`, `description` and `image` string property on the root of the object, which if present will be interpreted as specified in ERC721 Metadata JSON Schema.
- For the optional string properties above, the JSON object MUST NOT include a property on the root of the object with a non-string type using any of those names

## Examples

```
{
  "$evidence": "https://troopersgame.com/dog/evidence.json",
  "$schema": "https://conventions.0xcert.org/86-base-asset-schema.json",
  "description": "A weapon for the Troopers game which can severely injure the enemy.",
  "image": "https://troopersgame.com/dog.jpg",
  "name": "Magic Sword"
}
```

## Rationale

- Why micro-credentials
- What are they solving
- Typical terms

## Backwards Compatibility

Currently, there is no schema defined for backwards compatibility, so it's backwards-related to everything blockchain. Blockchain-wise it has no problem. As for the current academic status, please elaborate on specific standards for academic credentials in Europe, and how this convention is compatible with existing EU standards for micro-credentials.

## Implementations

Use of ERC-721 non-fungible tokens (NFTs)

0xcert ERC721 -- a reference implementation

- MIT licensed, so you can freely use it for your projects
- Includes test cases
- Active bug bounty, you will be paid if you find errors

XXXXERC721, by William Entriken -- a scalable example implementation

- Deployed on testnet with 1 billion assets and supporting all lookups with the metadata extension. This demonstrates that scaling is NOT a problem.

## How to add a convention here

Open a pull request to start this process.

## References

Add references.
