---
issue: 88
title: Crypto Collectible Asset
id: b17216d996781173f5c97e36610d173a85335dfcccf785dcaaf4a3d1f71f5169
author: Kristijan Sedlak <kristijan@0xcert.org>
version: 1.0.0
category: conventions
status: Draft
created: 2018-11-07
---

## Simple Summary

A convention describing crypto collectible asset.

## About

This convention represents a digital asset that represents a crypto-collectible. Crypto-collectibles are a type of digital assets that have a unique combination of different properties. This makes them indivisible or non-fungible and thus extremely applicable for managing a range of digital (or real-world) valuables - from art to video game content. The most famous example of crypto-collectibles are CryptoKitties, virtual pets with unique attributes - they are all digital kitties, but each kitty is one-of-a-kind and not interchangeable. The present convention represents a basic crypto-collectible which adheres to the ERC-721 standard for non-fungible tokens.

## Specification

```json
{
  "$schema": "http://json-schema.org/draft-07/schema",
  "description": "A digital assets that have a unique combination of different properties.",
  "properties": {
    "$evidence": {
      "description": "A URI pointing to the evidence JSON with data needed to certify this asset.",
      "type": "string"
    },
    "$schema": {
      "description": "A path to JSON Schema definition file.",
      "type": "string"
    },
    "description": {
      "description": "A property that holds a detailed description of an asset.",
      "type": "string"
    },
    "image": {
      "description": "A public property that can be a valid URI pointing to a resource with mime type image/* representing the asset to which this digital assets represents. Consider making any images at a width between 320 and 1080 pixels and aspect ratio between 1.91:1 and 4:5 inclusive.",
      "type": "string"
    },
    "name": {
      "description": "A property that holds a name of an asset.",
      "type": "string"
    }
  },
  "required": ["$schema", "description", "image", "name"],
  "title": "Crypto collectible asset",
  "type": "object"
}
```

## Example

```json
{
  "$evidence": "https://troopersgame.com/dog/evidence.json",
  "$schema": "https://conventions.0xcert.org/88-crypto-collectible-schema.json",
  "name": "Magic Sword",
  "description": "A weapon for the Troopers game which can severely injure the enemy.",
  "image": "https://troopersgame.com/dog.jpg"
}
```
