---
issue: 88
title: Crypto Collectible Asset
id: cd3d7fce94669724f964061572f42ae0391996b0e348c7431251f9ab1bab0f49
author: Kristijan Sedlak <kristijan@0xcert.org>
version: 1.0.0
category: conventions
status: Draft
created: 2018-11-07
---

## Simple Summary

A convention describing crypto collectible asset.

## About

This convention constitutes a digital asset that represents a crypto-collectible. Crypto-collectibles are a type of digital asset that have a unique combination of different properties. This makes them indivisible or non-fungible and thus extremely applicable for managing a range of digital (or real-world) valuables - from art to video game content. The most famous example of crypto-collectibles are CryptoKitties, virtual pets with unique attributes - they are all digital kitties, but each kitty is one-of-a-kind and not interchangeable. The present convention represents a basic crypto-collectible which adheres to the ERC-721 standard for non-fungible tokens.

## Specification

```json
{
  "$schema": "http://json-schema.org/draft-07/schema",
  "description": "A digital asset that has a unique combination of different properties.",
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
      "description": "A public property that can be a valid URI pointing to a resource with mime type image/* representing this digital asset. Consider making any image at a width between 320 and 1080 pixels and an aspect ratio between 1.91:1 and 4:5 inclusive.",
      "type": "string"
    },
    "name": {
      "description": "A property that holds the name of an asset.",
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
  "$schema": "https://0xcert.org/conventions/88-crypto-collectible-schema.json",
  "name": "Magic Sword",
  "description": "A weapon for the Troopers game that can severely injure the enemy.",
  "image": "https://troopersgame.com/dog.jpg"
}
```
