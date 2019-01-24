---
issue: 86
title: Base asset schema
id: 3f4a0870cd6039e6c987b067b0d28de54efea17449175d7a8cd6ec10ab23cc5d
author: Kristijan Sedlak <kristijan@0xcert.org>
version: 0.0.0-rc1
category: conventions
status: Draft
created: 2018-11-07
---

## Simple Summary

A base asset schema definition.

## About

A digital asset in the 0xcert protocol is defined in form of a specifically designed JSON object. Every data object has its own convention which follows the [JSON Schema](http://json-schema.org) specification. To simplify the process of describing a digital asset as a data object and to enable interoperability between different applications 0xcert provides a convention for each digital asset.

## Specification

The schema represents a technical specification of a particular digital asset, which explains the JSON data object structure and a detailed description of each data key. The naming of JSON properties should follow the [schema.org](http://schema.org/) specification when possible. This enables an easy way to convert a digital asset data object into [JSON-LD](https://json-ld.org/) format. The convention also expects the JSON keys to be defined in alphabetical order.

This schema follows [ERC721 Metadata JSON Schema](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-721.md). Every asset convention should extend from this basic metadata schema.

```json
{
  "$schema": "http://json-schema.org/draft-07/schema",
  "description": "An abstract digital asset schema.",
  "properties": {
    "$evidence": {
      "description": "A path to the evidence JSON with data needed to verify the asset.",
      "type": "string"
    },
    "$schema": {
      "description": "A path to JSON Schema definition file.",
      "type": "string"
    },
    "description": {
      "description": "A public property of type string that holds a detailed description of an asset. The property is always required and is limited to 255 characters.",
      "type": "string"
    },
    "image": {
      "description": "A public property that can be a valid URI pointing to a resource with mime type image/* representing the asset to which this NFT represents. Consider making any images at a width between 320 and 1080 pixels and aspect ratio between 1.91:1 and 4:5 inclusive.",
      "type": "string"
    },
    "name": {
      "description": "A public property that holds a name of an asset. This property is required and is limited to 255 characters.",
      "type": "string"
    }
  },
  "title": "Asset",
  "type": "object"
}
```

## Example

```json
{
  "$evidence": "https://troopersgame.com/dog/evidence",
  "$schema": "http://json-schema.org/draft-07/schema",
  "description": "A weapon for the Troopers game which can severely injure the enemy.",
  "image": "https://troopersgame.com/dog.jpg",
  "name": "Magic Sword"
}
```
