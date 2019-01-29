---
issue: 88
title: Crypto Collectible Asset
id: a4cf0407b223849773430feaf0949827373c40feb3258d82dd605ed41c5e9a2c
author: Kristijan Sedlak <kristijan@0xcert.org>
version: 1.0.0-rc2
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
  "allOf": [
    { "$ref": "#/schemas/asset-metadata" }
  ],
  "description": "A digital assets that have a unique combination of different properties.",
  "title": "Crypto Collectible Asset",
  "type": "object",
  "required": ["$schema"]
}
```

## Example

```json
{
  "$evidence": "https://troopersgame.com/dog/evidence",
  "$schema": "https://raw.githubusercontent.com/0xcert/framework/master/conventions/86-base-asset-schema.md",
  "description": "A weapon for the Troopers game which can severely injure the enemy.",
  "image": "https://troopersgame.com/dog.jpg",
  "name": "Magic Sword"
}
```
