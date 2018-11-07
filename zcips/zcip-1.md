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

A crypto-collectible is a cryptographically unique, non-fungible digital asset.

## Specification

| Property | Type | Constraints | Default | Strategy | Description
|-|-|-|-|-|-
| description | String | Required | - | metadata, record | Describes the asset.
| image | String | Yes | Required | metadata | A URI pointing to a resource with mime type image/* representing the asset to which this NFT represents. Consider making any images at a width between 320 and 1080 pixels and aspect ratio between 1.91:1 and 4:5 inclusive.
| name | String | Yes | Required | metadata | Identifies the asset.

## Example

```json
{ 
  "description": "Magic Sword",
  "image": "https://troopersgame.com/dog.jpg",
  "name": "A weapon for the Troopers game which can severely injure the enemy."
}
```

## Copyright

Copyright and related rights waived via [CC0](https://creativecommons.org/publicdomain/zero/1.0/).
