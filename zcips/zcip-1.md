---
issue: 1
title: Crypto Collectible Asset
author: Kristijan Sedlak <kristijan@0xcert.org>
version: 0.0.1
category: convention
status: Draft
created: 2018-11-07
---

## Simple Summary

A convention describing crypto collectible asset.

## About

This convention represents a digital asset that represents a crypto-collectible. Crypto-collectibles are a type of digital assets that have a unique combination of different properties and cannot be swapped with other digital assets. This makes them indivisible or non-fungible and thus extremely applicable for managing a range of digital (or real-world) valuables - from art to video game content. The most famous example of crypto-collectibles are CryptoKitties, virtual pets with unique attributes - they are all digital kitties, but each kitty is one-of-a-kind and not interchangeable. The present convention represents a basic crypto-collectible which adheres to the ERC-721 standard for non-fungible tokens.

## Specification

The table below shows the "properties" that constitute a crypto-collectible data object.

| Property | Type | Constraints | Default | Strategy | Description
|-|-|-|-|-|-
| description | String | Required | - | metadata, record | Describes the asset.
| id | String | Required | - | record | Unique ID.
| image | String | Yes | Required | metadata, record | A URI pointing to a resource with mime type image/* representing the asset to which this NFT represents. Consider making any images at a width between 320 and 1080 pixels and aspect ratio between 1.91:1 and 4:5 inclusive.
| name | String | Yes | Required | metadata, record | Identifies the asset.

## Example

```json
{
  "description": "Magic Sword",
  "id": "fc819",
  "image": "https://troopersgame.com/dog.jpg",
  "name": "A weapon for the Troopers game which can severely injure the enemy."
}
```

## Copyright

Copyright and related rights waived via [CC0](https://creativecommons.org/publicdomain/zero/1.0/).
