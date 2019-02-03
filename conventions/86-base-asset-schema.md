---
issue: 86
title: Base asset schema
id: 3f4a0870cd6039e6c987b067b0d28de54efea17449175d7a8cd6ec10ab23cc5d
author: Kristijan Sedlak <kristijan@0xcert.org>, William Entriken <github.com@phor.net>
version: 1.0.0-rc3
category: conventions
status: Draft
created: 2018-11-07
---

## Simple Summary

A base asset schema definition.

## About

Every digital asset in the 0xcert Protocol is defined using a *convention*. Conventions are data models that allow your application to interoperate with other applications using the 0xcert Protocol.

This convention is the base specification to which all other conventions MUST conform.

This convention is minimal and adopts only the specification for digital assets from [ERC-721](https://eips.ethereum.org/EIPS/eip-721) while adding the requirement that every digital asset specfiy to which convention it conforms.

## Specification

The key words “MUST”, “MUST NOT”, “REQUIRED”, “SHALL”, “SHALL NOT”, “SHOULD”, “SHOULD NOT”, “RECOMMENDED”, “MAY”, and “OPTIONAL” in this document are to be interpreted as described in RFC 2119.

Every digital asset in the 0xcert Protocol MUST follow this convention. Every other convention MUST extend this specification at a minimum.

This specification is provided in a machine-readable format using the [JSON Schema](https://json-schema.org) format also using [JSON-LD](https://json-ld.org/) to connect the digital asset to an optional *evidence* file.

The naming of JSON properties SHOULD follow the [schema.org](http://schema.org/) specification when possible. This enables an easy way to convert a digital asset data object into [JSON-LD](https://json-ld.org/) format.

This schema extends [ERC721 Metadata JSON Schema](https://eips.ethereum.org/EIPS/eip-721), an existing well-known data model for digital assets.

```json
{
  "$schema": "http://json-schema.org/draft-07/schema",
  "description": "An abstract digital asset schema.",
  "properties": {
    "$evidence": {
      "description": "A URI ponit to the evidence JSON with data needed to certify this asset.",
      "type": "string",
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

* The data model is a JSON object.
* The JSON object MUST include a `$schema` string property on the root of the object.
* The JSON object MAY include an `$evidence` string property on the root of the object, and if so this will be interpreted as a URI pointing to an evidence file which certifies any imprints of this digital asset.
* The JSON object MAY include `name`, `description` and `image` string property on the root of the object, which if present will be interpreted as specified in ERC721 Metadata JSON Schema.
* For the optional string properties above, the JSON object MUST NOT include a property on the root of the object with a non-string type using any of those names.

## Examples

Minimal example

```json
{
  "$schema": "https://raw.githubusercontent.com/0xcert/framework/master/conventions/86-base-asset-schema.md",
}
```

Typical example

```json
{
  "$evidence": "https://troopersgame.com/dog/evidence",
  "$schema": "https://raw.githubusercontent.com/0xcert/framework/master/conventions/86-base-asset-schema.md",
  "description": "A weapon for the Troopers game which can severely injure the enemy.",
  "image": "https://troopersgame.com/dog.jpg",
  "name": "Magic Sword"
}
```
